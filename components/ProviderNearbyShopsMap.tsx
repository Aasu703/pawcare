"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { LocateFixed, MapPin, RefreshCw, Store } from "lucide-react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";

type Coordinates = {
  lat: number;
  lng: number;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type NearbyShop = {
  id: string;
  name: string;
  address: string;
  location: Coordinates;
  distanceKm: number;
};

type NearbySearchMode = "pet-shop" | "vet-hospital";

const DEFAULT_CENTER: Coordinates = { lat: 40.7128, lng: -74.006 };
const SEARCH_RADIUS_METERS = 5000;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const SEARCH_MODE_CONFIG: Record<
  NearbySearchMode,
  {
    title: string;
    fallbackName: string;
    loadingText: string;
    errorText: string;
    emptyText: string;
    queryLines: string[];
  }
> = {
  "pet-shop": {
    title: "Pet Shops",
    fallbackName: "Pet Shop",
    loadingText: "Finding pet shops near you...",
    errorText: "Could not fetch nearby pet shops right now.",
    emptyText: "No pet shops found within",
    queryLines: [
      '  node["shop"="pet"]',
      '  way["shop"="pet"]',
      '  relation["shop"="pet"]',
    ],
  },
  "vet-hospital": {
    title: "Vet Hospitals",
    fallbackName: "Vet Hospital",
    loadingText: "Finding vet hospitals near you...",
    errorText: "Could not fetch nearby vet hospitals right now.",
    emptyText: "No vet hospitals found within",
    queryLines: [
      '  node["amenity"="veterinary"]',
      '  way["amenity"="veterinary"]',
      '  relation["amenity"="veterinary"]',
      '  node["healthcare"="veterinary"]',
      '  way["healthcare"="veterinary"]',
      '  relation["healthcare"="veterinary"]',
    ],
  },
};

function isValidCoordinate(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceInKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildAddress(tags?: Record<string, string>) {
  if (!tags) return "";
  const pieces = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return pieces || tags["addr:full"] || tags["contact:street"] || "";
}

async function fetchNearbyPlaces(
  center: Coordinates,
  signal: AbortSignal,
  mode: NearbySearchMode,
): Promise<NearbyShop[]> {
  if (!isValidCoordinate(center.lat, -90, 90) || !isValidCoordinate(center.lng, -180, 180)) {
    throw new Error("Invalid coordinates for nearby shop lookup");
  }

  const config = SEARCH_MODE_CONFIG[mode];
  const queryTargets = config.queryLines
    .map((line) => `${line}(around:${SEARCH_RADIUS_METERS},${center.lat},${center.lng});`)
    .join("\n");

  const overpassQuery = [
    "[out:json][timeout:25];",
    "(",
    queryTargets,
    ");",
    "out center tags;",
  ].join("\n");

  let response: Response | null = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    response = await fetch(endpoint, {
      method: "POST",
      body: new URLSearchParams({ data: overpassQuery }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      signal,
    });

    if (response.ok) break;
    if (response.status !== 429 && response.status < 500) {
      break;
    }
  }

  if (!response?.ok) {
    throw new Error("Could not load nearby places");
  }

  const data: { elements?: OverpassElement[] } = await response.json();
  const elements = Array.isArray(data.elements) ? data.elements : [];

  const shops = elements
    .map((item) => {
      const lat = item.lat ?? item.center?.lat;
      const lng = item.lon ?? item.center?.lon;
      if (lat === undefined || lng === undefined) return null;

      const location = { lat, lng };
      const name = item.tags?.name || config.fallbackName;
      const address = buildAddress(item.tags);

      return {
        id: `${item.id}`,
        name,
        address,
        location,
        distanceKm: distanceInKm(center, location),
      } satisfies NearbyShop;
    })
    .filter((item): item is NearbyShop => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return shops.slice(0, 40);
}

export default function ProviderNearbyShopsMap({
  address,
  mode = "pet-shop",
}: {
  address?: string;
  mode?: NearbySearchMode;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const modeConfig = SEARCH_MODE_CONFIG[mode];

  const subtitle = useMemo(() => {
    if (address) return `Using your location near ${address}`;
    return "Using your current location";
  }, [address]);

  useEffect(() => {
    let ignore = false;

    const fallbackToDefault = (message: string) => {
      if (ignore) return;
      setLocationError(message);
      setCenter(DEFAULT_CENTER);
    };

    if (!navigator.geolocation) {
      fallbackToDefault("Location access is unavailable. Showing a default area.");
      return () => {
        ignore = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (ignore) return;
        setLocationError(null);
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        fallbackToDefault("Location permission denied. Showing a default area.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );

    return () => {
      ignore = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!center) return;
    const controller = new AbortController();

    const loadNearbyShops = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const results = await fetchNearbyPlaces(center, controller.signal, mode);
        setShops(results);
      } catch {
        setErrorMessage(modeConfig.errorText);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    void loadNearbyShops();
    return () => controller.abort();
  }, [center, mode, modeConfig.errorText]);

  useEffect(() => {
    if (!mapRef.current || !center) return;
    let active = true;

    const renderMap = async () => {
      const leaflet = await import("leaflet");
      if (!active || !mapRef.current) return;

      type IconPrototypeWithInternalGetter = typeof leaflet.Icon.Default.prototype & {
        _getIconUrl?: string;
      };
      delete (leaflet.Icon.Default.prototype as IconPrototypeWithInternalGetter)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!leafletMapRef.current) {
        leafletMapRef.current = leaflet.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        });
        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          })
          .addTo(leafletMapRef.current);
      }

      leafletMapRef.current.setView([center.lat, center.lng], 13);

      if (!markerLayerRef.current) {
        markerLayerRef.current = leaflet.layerGroup().addTo(leafletMapRef.current);
      } else {
        markerLayerRef.current.clearLayers();
      }
      const markerLayer = markerLayerRef.current;
      if (!markerLayer) return;

      const centerMarker = leaflet
        .circleMarker([center.lat, center.lng], {
          radius: 7,
          color: "#0f4f57",
          fillColor: "#0f4f57",
          fillOpacity: 0.95,
          weight: 2,
        })
        .bindPopup("You are here");
      centerMarker.addTo(markerLayer);

      shops.forEach((shop) => {
        const popup = `<strong>${escapeHtml(shop.name)}</strong><br/>${escapeHtml(
          shop.address || "Address unavailable",
        )}<br/>${shop.distanceKm.toFixed(2)} km away`;
        leaflet
          .marker([shop.location.lat, shop.location.lng])
          .bindPopup(popup)
          .addTo(markerLayer);
      });
    };

    void renderMap();
    return () => {
      active = false;
    };
  }, [center, shops]);

  useEffect(
    () => () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerLayerRef.current = null;
      }
    },
    [],
  );

  const refreshLocation = () => {
    setReloadToken((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#0c4148]">Nearby {modeConfig.title} (OpenStreetMap)</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={refreshLocation}
          className="inline-flex items-center gap-1 rounded-lg border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-3 py-1.5 text-xs font-semibold text-[#0f4f57] hover:bg-[#0f4f57]/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {locationError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {locationError}
        </p>
      )}
      {errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorMessage}
        </p>
      )}

      <div ref={mapRef} style={{ height: 340, width: "100%" }} className="overflow-hidden rounded-xl border border-gray-200" />

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Nearby Results
        </p>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LocateFixed className="h-4 w-4 animate-pulse text-[#0f4f57]" />
            {modeConfig.loadingText}
          </div>
        ) : shops.length === 0 ? (
          <p className="text-sm text-gray-500">{modeConfig.emptyText} {SEARCH_RADIUS_METERS / 1000} km.</p>
        ) : (
          <ul className="space-y-2">
            {shops.slice(0, 8).map((shop) => (
              <li key={shop.id} className="rounded-lg border border-gray-100 p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0c4148]">{shop.name}</p>
                    <p className="text-xs text-gray-500">{shop.address || "Address unavailable"}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#0f4f57]">{shop.distanceKm.toFixed(2)} km</span>
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${shop.location.lat}&mlon=${shop.location.lng}#map=18/${shop.location.lat}/${shop.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0f4f57] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open in OSM
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="inline-flex items-center gap-1 text-[11px] text-gray-400">
        <Store className="h-3.5 w-3.5" />
        Data source: OpenStreetMap / Overpass API
      </p>
    </div>
  );
}
