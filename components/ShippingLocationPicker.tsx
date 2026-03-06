"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

const DEFAULT_CENTER: [number, number] = [27.7172, 85.324];

type Props = {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
};

export default function ShippingLocationPicker({ onLocationSelect }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pinned, setPinned] = useState<{ lat: number; lng: number } | null>(null);
  const [reversing, setReversing] = useState(false);

  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setReversing(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      onLocationSelectRef.current(address, lat, lng);
    } catch {
      onLocationSelectRef.current(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
    } finally {
      setReversing(false);
    }
  }, []);

  const placeMarker = useCallback(
    (lat: number, lng: number, centerMap: boolean) => {
      const map = mapRef.current;
      const leaflet = leafletRef.current;
      if (!map || !leaflet) return;

      const latLng: [number, number] = [lat, lng];
      if (!markerRef.current) {
        markerRef.current = leaflet.marker(latLng).addTo(map);
      } else {
        markerRef.current.setLatLng(latLng);
      }

      if (centerMap) {
        map.setView(latLng, Math.max(map.getZoom(), 16));
      }

      setPinned({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  useEffect(() => {
    let active = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      if (!active || !mapContainerRef.current) return;

      leafletRef.current = leaflet;
      type IconProto = typeof leaflet.Icon.Default.prototype & { _getIconUrl?: string };
      delete (leaflet.Icon.Default.prototype as IconProto)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = leaflet
        .map(mapContainerRef.current, { zoomControl: true, scrollWheelZoom: true })
        .setView(DEFAULT_CENTER, 12);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })
        .addTo(map);

      map.on("click", (event) => {
        placeMarker(event.latlng.lat, event.latlng.lng, false);
      });

      mapRef.current = map;
    };

    void initMap();
    return () => {
      active = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      leafletRef.current = null;
    };
  }, [placeMarker]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not available in this browser.");
      return;
    }
    setLocationError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        placeMarker(position.coords.latitude, position.coords.longitude, true);
        setIsLocating(false);
      },
      () => {
        setLocationError("Location permission denied or unavailable.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Click on the map or use your current location.</p>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--pc-teal)]/20 bg-[var(--pc-teal)]/5 px-3 py-1.5 text-xs font-semibold text-[var(--pc-teal)] hover:bg-[var(--pc-teal)]/10 disabled:opacity-70"
        >
          <LocateFixed className={`h-3.5 w-3.5 ${isLocating ? "animate-pulse" : ""}`} />
          {isLocating ? "Locating..." : "Use My Location"}
        </button>
      </div>

      {locationError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {locationError}
        </p>
      )}

      <div
        ref={mapContainerRef}
        style={{ height: 280, width: "100%" }}
        className="overflow-hidden rounded-xl border border-border"
      />

      {reversing && (
        <p className="text-xs text-muted-foreground animate-pulse">Fetching address...</p>
      )}

      {pinned && !reversing && (
        <p className="inline-flex items-center gap-1 text-xs font-medium text-[var(--pc-teal-dark)]">
          <MapPin className="h-3.5 w-3.5" />
          Pinned at {pinned.lat.toFixed(6)}, {pinned.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
