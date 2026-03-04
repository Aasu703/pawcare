"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LocateFixed,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Store,
} from "lucide-react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import {
  getVerifiedProviderLocations,
  type VerifiedProviderLocation,
} from "@/lib/api/public/provider";

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

type NearbySearchMode = "pet-shop" | "vet-hospital";
type ShopSource = "pawcare" | "osm";

type NearbyShop = {
  id: string;
  name: string;
  address: string;
  location: Coordinates;
  distanceKm: number;
  source: ShopSource;
};

const DEFAULT_CENTER: Coordinates = { lat: 40.7128, lng: -74.006 };
const SEARCH_RADIUS_METERS = 5000;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const SOURCE_STYLES: Record<ShopSource, { label: string; marker: string; chip: string }> = {
  pawcare: {
    label: "PawCare Verified",
    marker: "#16a34a",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  osm: {
    label: "Near You (OSM)",
    marker: "#ea580c",
    chip: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const SEARCH_MODE_CONFIG: Record<
  NearbySearchMode,
  {
    title: string;
    fallbackName: string;
    pawcareFallbackName: string;
    loadingText: string;
    pawcareErrorText: string;
    osmErrorText: string;
    pawcareEmptyText: string;
    osmEmptyText: string;
    pawcareSectionTitle: string;
    osmSectionTitle: string;
    queryLines: string[];
  }
> = {
  "pet-shop": {
    title: "Pet Shop Locations",
    fallbackName: "Pet Shop",
    pawcareFallbackName: "PawCare Shop",
    loadingText: "Finding pet shops near you...",
    pawcareErrorText: "Could not fetch PawCare verified shops.",
    osmErrorText: "Could not fetch nearby OSM pet shops.",
    pawcareEmptyText: "No PawCare verified shops near your location.",
    osmEmptyText: "No nearby OSM pet shops within 5 km.",
    pawcareSectionTitle: "PawCare Verified Shops",
    osmSectionTitle: "Shops Near You (OSM)",
    queryLines: [
      '  node["shop"="pet"]',
      '  way["shop"="pet"]',
      '  relation["shop"="pet"]',
    ],
  },
  "vet-hospital": {
    title: "Vet Location Map",
    fallbackName: "Vet Hospital",
    pawcareFallbackName: "PawCare Vet",
    loadingText: "Finding vet hospitals near you...",
    pawcareErrorText: "Could not fetch PawCare verified vets.",
    osmErrorText: "Could not fetch nearby OSM vet hospitals.",
    pawcareEmptyText: "No PawCare verified vets near your location.",
    osmEmptyText: "No nearby OSM vet hospitals within 5 km.",
    pawcareSectionTitle: "PawCare Verified Vets",
    osmSectionTitle: "Vet Hospitals Near You (OSM)",
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

function toNearbyFromProvider(
  provider: VerifiedProviderLocation,
  center: Coordinates,
  fallbackName: string,
): NearbyShop | null {
  const lat = Number(provider?.location?.latitude);
  const lng = Number(provider?.location?.longitude);
  if (!isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) {
    return null;
  }

  const location = { lat, lng };
  const name = provider.clinicOrShopName || provider.businessName || fallbackName;
  const address = provider.location.address || provider.address || "Address unavailable";
  return {
    id: `pawcare-${provider._id}`,
    name,
    address,
    location,
    distanceKm: distanceInKm(center, location),
    source: "pawcare",
  };
}

function toNearbyFromOverpass(
  item: OverpassElement,
  center: Coordinates,
  fallbackName: string,
): NearbyShop | null {
  const lat = item.lat ?? item.center?.lat;
  const lng = item.lon ?? item.center?.lon;
  if (lat === undefined || lng === undefined) return null;
  if (!isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) return null;

  const location = { lat, lng };
  const name = item.tags?.name || fallbackName;
  const address = buildAddress(item.tags) || "Address unavailable";
  return {
    id: `osm-${item.id}`,
    name,
    address,
    location,
    distanceKm: distanceInKm(center, location),
    source: "osm",
  };
}

async function fetchPawcarePlaces(center: Coordinates, mode: NearbySearchMode): Promise<NearbyShop[]> {
  const config = SEARCH_MODE_CONFIG[mode];
  const res = await getVerifiedProviderLocations(mode);
  if (!res.success) {
    throw new Error(res.message || config.pawcareErrorText);
  }

  const providers = Array.isArray(res.data) ? res.data : [];
  return providers
    .map((provider) => toNearbyFromProvider(provider, center, config.pawcareFallbackName))
    .filter((item): item is NearbyShop => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 40);
}

async function fetchOsmPlaces(
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
    try {
      response = await fetch(endpoint, {
        method: "POST",
        body: new URLSearchParams({ data: overpassQuery }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        signal,
      });
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }
      continue;
    }

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
  return elements
    .map((item) => toNearbyFromOverpass(item, center, config.fallbackName))
    .filter((item): item is NearbyShop => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 40);
}

function listItemClass(source: ShopSource) {
  return source === "pawcare"
    ? "border-emerald-100 bg-emerald-50/40"
    : "border-orange-100 bg-orange-50/40";
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
  const [pawcareError, setPawcareError] = useState<string | null>(null);
  const [osmError, setOsmError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [sourceVisibility, setSourceVisibility] = useState<Record<ShopSource, boolean>>({
    pawcare: true,
    osm: true,
  });

  const modeConfig = SEARCH_MODE_CONFIG[mode];

  const subtitle = useMemo(() => {
    if (address) return `Using your location near ${address}`;
    return "Using your current location";
  }, [address]);

  const pawcareShops = useMemo(
    () => shops.filter((shop) => shop.source === "pawcare"),
    [shops],
  );
  const osmShops = useMemo(
    () => shops.filter((shop) => shop.source === "osm"),
    [shops],
  );
  const visibleShops = useMemo(
    () => shops.filter((shop) => sourceVisibility[shop.source]),
    [shops, sourceVisibility],
  );

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
    let active = true;

    const loadNearbyShops = async () => {
      setLoading(true);
      setPawcareError(null);
      setOsmError(null);

      const [pawcareResult, osmResult] = await Promise.allSettled([
        fetchPawcarePlaces(center, mode),
        fetchOsmPlaces(center, controller.signal, mode),
      ]);

      if (!active) return;

      const merged: NearbyShop[] = [];

      if (pawcareResult.status === "fulfilled") {
        merged.push(...pawcareResult.value);
      } else {
        setPawcareError(modeConfig.pawcareErrorText);
      }

      if (osmResult.status === "fulfilled") {
        merged.push(...osmResult.value);
      } else if (!controller.signal.aborted) {
        setOsmError(modeConfig.osmErrorText);
      }

      setShops(merged.sort((a, b) => a.distanceKm - b.distanceKm));
      setLoading(false);
    };

    void loadNearbyShops();
    return () => {
      active = false;
      controller.abort();
    };
  }, [center, mode, modeConfig.osmErrorText, modeConfig.pawcareErrorText]);

  useEffect(() => {
    if (!mapRef.current || !center) return;
    let active = true;

    const renderMap = async () => {
      const leaflet = await import("leaflet");
      if (!active || !mapRef.current) return;

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

      visibleShops.forEach((shop) => {
        const sourceStyle = SOURCE_STYLES[shop.source];
        const popup = `<strong>${escapeHtml(shop.name)}</strong><br/>${escapeHtml(
          sourceStyle.label,
        )}<br/>${escapeHtml(shop.address)}<br/>${shop.distanceKm.toFixed(2)} km away`;
        leaflet
          .circleMarker([shop.location.lat, shop.location.lng], {
            radius: 6,
            color: sourceStyle.marker,
            fillColor: sourceStyle.marker,
            fillOpacity: 0.9,
            weight: 1.5,
          })
          .bindPopup(popup)
          .addTo(markerLayer);
      });
    };

    void renderMap();
    return () => {
      active = false;
    };
  }, [center, visibleShops]);

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

  const toggleSource = (source: ShopSource) => {
    setSourceVisibility((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#0c4148]">Nearby {modeConfig.title}</h3>
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => toggleSource("pawcare")}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            sourceVisibility.pawcare
              ? SOURCE_STYLES.pawcare.chip
              : "border-gray-200 bg-gray-100 text-gray-500"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          PawCare Verified ({pawcareShops.length})
        </button>
        <button
          type="button"
          onClick={() => toggleSource("osm")}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            sourceVisibility.osm
              ? SOURCE_STYLES.osm.chip
              : "border-gray-200 bg-gray-100 text-gray-500"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
          Near You OSM ({osmShops.length})
        </button>
      </div>

      {locationError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {locationError}
        </p>
      )}
      {pawcareError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {pawcareError}
        </p>
      )}
      {osmError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {osmError}
        </p>
      )}

      <div
        ref={mapRef}
        style={{ height: 340, width: "100%" }}
        className="overflow-hidden rounded-xl border border-gray-200"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Nearby Results
        </p>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LocateFixed className="h-4 w-4 animate-pulse text-[#0f4f57]" />
            {modeConfig.loadingText}
          </div>
        ) : !sourceVisibility.pawcare && !sourceVisibility.osm ? (
          <p className="text-sm text-gray-500">Enable at least one source to see results.</p>
        ) : (
          <div className="space-y-3">
            {sourceVisibility.pawcare && (
              <div>
                <p className="mb-2 text-xs font-semibold text-emerald-700">
                  {modeConfig.pawcareSectionTitle}
                </p>
                {pawcareShops.length === 0 ? (
                  <p className="text-sm text-gray-500">{modeConfig.pawcareEmptyText}</p>
                ) : (
                  <ul className="space-y-2">
                    {pawcareShops.slice(0, 5).map((shop) => (
                      <li
                        key={shop.id}
                        className={`rounded-lg border p-2.5 ${listItemClass("pawcare")}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#0c4148]">{shop.name}</p>
                            <p className="text-xs text-gray-500">{shop.address}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#0f4f57]">
                            {shop.distanceKm.toFixed(2)} km
                          </span>
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
            )}

            {sourceVisibility.osm && (
              <div>
                <p className="mb-2 text-xs font-semibold text-orange-700">
                  {modeConfig.osmSectionTitle}
                </p>
                {osmShops.length === 0 ? (
                  <p className="text-sm text-gray-500">{modeConfig.osmEmptyText}</p>
                ) : (
                  <ul className="space-y-2">
                    {osmShops.slice(0, 5).map((shop) => (
                      <li key={shop.id} className={`rounded-lg border p-2.5 ${listItemClass("osm")}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#0c4148]">{shop.name}</p>
                            <p className="text-xs text-gray-500">{shop.address}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#0f4f57]">
                            {shop.distanceKm.toFixed(2)} km
                          </span>
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
            )}
          </div>
        )}
      </div>

      <p className="inline-flex items-center gap-1 text-[11px] text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Data source: PawCare verified providers + OpenStreetMap/Overpass
      </p>
      <p className="inline-flex items-center gap-1 text-[11px] text-gray-400">
        <Store className="h-3.5 w-3.5" />
        Marker colors: green = PawCare verified, orange = OSM nearby
      </p>
    </div>
  );
}
