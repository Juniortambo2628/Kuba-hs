"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapCenterer({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface ProviderLocationMapViewProps {
  position: [number, number];
  label?: string;
  radiusKm?: number;
}

export default function ProviderLocationMapView({
  position,
  label,
  radiusKm,
}: ProviderLocationMapViewProps) {
  const radiusMeters =
    radiusKm != null && radiusKm > 0 ? radiusKm * 1000 : undefined;

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full z-0"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterer center={position} zoom={radiusMeters ? 12 : 14} />
      {radiusMeters != null && (
        <Circle
          center={position}
          radius={radiusMeters}
          pathOptions={{
            color: "#0d9488",
            fillColor: "#14b8a6",
            fillOpacity: 0.15,
            weight: 2,
          }}
        />
      )}
      <Marker position={position}>
        {label ? undefined : null}
      </Marker>
    </MapContainer>
  );
}
