"use client";

import { useEffect, useRef, useState } from "react";

type PlaceResult = {
  name: string;
  address: string;
  location: { lat: number; lng: number };
};

export default function ProviderNearbyShopsMap({ address }: { address?: string }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [places, setPlaces] = useState<PlaceResult[]>([]);

  useEffect(() => {
    if (!address) return;

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.body.appendChild(s);
      });

    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;

    let map: any;

    loadScript(src)
      .then(() => {
        const googleAny = (window as any).google;
        if (!googleAny) return;
        const geocoder = new googleAny.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status !== "OK" || !results[0]) return;
          const loc = results[0].geometry.location;
          const center = { lat: loc.lat(), lng: loc.lng() };
          if (mapRef.current) {
            map = new googleAny.maps.Map(mapRef.current, { center, zoom: 14 });
          }

          const service = new googleAny.maps.places.PlacesService(map);
          const request = { location: center, radius: 5000, keyword: "pet shop" };
          service.nearbySearch(request, (results: any[], status2: string) => {
            if (status2 !== googleAny.maps.places.PlacesServiceStatus.OK) return;
            const found: PlaceResult[] = results.map((r) => ({
              name: r.name,
              address: r.vicinity || r.formatted_address || "",
              location: { lat: r.geometry.location.lat(), lng: r.geometry.location.lng() },
            }));
            setPlaces(found);
            // add markers
            found.forEach((p) => {
              new googleAny.maps.Marker({ position: p.location, map, title: p.name });
            });
          });
        });
      })
      .catch(() => {});
  }, [address]);

  if (!address) return <div className="text-sm text-gray-400">No location provided</div>;

  return (
    <div className="space-y-3">
      <div ref={mapRef} style={{ height: 300, width: "100%" }} className="rounded-md overflow-hidden" />
      <div>
        <h3 className="text-sm font-semibold">Nearby Pet Shops</h3>
        <ul className="text-sm list-disc ml-5">
          {places.length === 0 && <li>No pet shops found nearby</li>}
          {places.map((p, i) => (
            <li key={i} className="mt-1">
              <strong>{p.name}</strong> — {p.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
