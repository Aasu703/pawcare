"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Trash2 } from "lucide-react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

const DEFAULT_CENTER = { latitude: 27.7172, longitude: 85.324 };

export type ProviderPinnedLocation = {
  latitude: number | null;
  longitude: number | null;
  address?: string;
};

type Props = {
  value: ProviderPinnedLocation;
  onChange: (value: ProviderPinnedLocation) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
};

function isValidCoordinate(latitude: number | null, longitude: number | null) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export default function ProviderLocationPicker({
  value,
  onChange,
  label = "Pin Your Shop/Clinic Location",
  helperText = "Click on the map to drop the exact pin.",
  required = false,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const setMarker = useCallback((latitude: number, longitude: number, centerMap: boolean) => {
    const map = mapRef.current;
    const leaflet = leafletRef.current;
    if (!map || !leaflet) return;

    const latLng: [number, number] = [latitude, longitude];
    if (!markerRef.current) {
      markerRef.current = leaflet.marker(latLng).addTo(map);
    } else {
      markerRef.current.setLatLng(latLng);
    }

    if (centerMap) {
      map.setView(latLng, Math.max(map.getZoom(), 15));
    }
  }, []);

  useEffect(() => {
    let active = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      if (!active || !mapContainerRef.current) return;

      leafletRef.current = leaflet;
      type IconPrototypeWithInternalGetter = typeof leaflet.Icon.Default.prototype & {
        _getIconUrl?: string;
      };
      delete (leaflet.Icon.Default.prototype as IconPrototypeWithInternalGetter)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const hasPin = isValidCoordinate(valueRef.current.latitude, valueRef.current.longitude);
      const initialCenter: [number, number] = hasPin
        ? [valueRef.current.latitude as number, valueRef.current.longitude as number]
        : [DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude];

      const map = leaflet.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(initialCenter, hasPin ? 15 : 12);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })
        .addTo(map);

      map.on("click", (event) => {
        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;
        setMarker(latitude, longitude, false);
        onChangeRef.current({
          ...valueRef.current,
          latitude,
          longitude,
        });
      });

      mapRef.current = map;
      if (hasPin) {
        setMarker(valueRef.current.latitude as number, valueRef.current.longitude as number, false);
      }
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
  }, [setMarker]);

  useEffect(() => {
    const hasPin = isValidCoordinate(value.latitude, value.longitude);
    if (!mapRef.current || !leafletRef.current) return;

    if (hasPin) {
      setMarker(value.latitude as number, value.longitude as number, false);
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [setMarker, value.latitude, value.longitude]);

  const setCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not available in this browser.");
      return;
    }

    setLocationError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setMarker(latitude, longitude, true);
        onChangeRef.current({
          ...valueRef.current,
          latitude,
          longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError("Location permission denied or unavailable.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );
  };

  const clearPin = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    onChange({
      ...value,
      latitude: null,
      longitude: null,
    });
  };

  const hasPin = isValidCoordinate(value.latitude, value.longitude);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            {label} {required ? <span className="text-red-500">*</span> : null}
          </label>
          <p className="text-xs text-gray-500">{helperText}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={setCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1 rounded-lg border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-3 py-1.5 text-xs font-semibold text-[#0f4f57] hover:bg-[#0f4f57]/10 disabled:opacity-70"
          >
            <LocateFixed className={`h-3.5 w-3.5 ${isLocating ? "animate-pulse" : ""}`} />
            {isLocating ? "Locating..." : "Use My Location"}
          </button>
          <button
            type="button"
            onClick={clearPin}
            disabled={!hasPin}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {locationError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {locationError}
        </p>
      )}

      <div
        ref={mapContainerRef}
        style={{ height: 320, width: "100%" }}
        className="overflow-hidden rounded-xl border border-gray-200"
      />

      {hasPin ? (
        <p className="inline-flex items-center gap-1 text-xs font-medium text-[#0c4148]">
          <MapPin className="h-3.5 w-3.5" />
          Pin saved at {value.latitude?.toFixed(6)}, {value.longitude?.toFixed(6)}
        </p>
      ) : (
        <p className="text-xs text-gray-500">No location pinned yet.</p>
      )}
    </div>
  );
}
