"use client";

import { Fragment, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { ProviderMapPopup } from "@/components/marketplace";
import { MapHoverPreviewOverlay } from "@/components/shared/MapHoverPreviewOverlay";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ProviderSearchRowData } from "@/components/marketplace/ProviderSearchRow";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapViewProvider = ProviderSearchRowData & {
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | null;
  review_count?: number;
  is_verified?: boolean;
  starting_price?: number | string | null;
  location_name?: string | null;
  service_radius?: number | null;
  services?: Array<{ name?: string; service?: { name?: string } | null }> | null;
};

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  providers?: MapViewProvider[];
  onMarkerClick?: (provider: MapViewProvider) => void;
  showRadius?: boolean;
  userLocation?: [number, number];
  className?: string;
  minHeight?: number;
  selectedProviderId?: string | number | null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapResize() {
  const map = useMap();
  useEffect(() => {
    const run = () => map.invalidateSize();
    run();
    const t1 = window.setTimeout(run, 100);
    const t2 = window.setTimeout(run, 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [map]);
  return null;
}

export default function MapView({
  center = [-1.2921, 36.8219],
  zoom = 11,
  providers = [],
  onMarkerClick,
  showRadius = false,
  userLocation,
  className,
  minHeight = 280,
  selectedProviderId = null,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState<MapViewProvider | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="w-full bg-muted animate-pulse rounded-3xl"
        style={{ minHeight }}
        aria-hidden
      />
    );
  }

  const mapClipClass =
    className?.includes("rounded") === false
      ? "absolute inset-0 overflow-hidden rounded-3xl"
      : "absolute inset-0 overflow-hidden";

  return (
    <div
      className="kuba-map-view relative w-full overflow-visible"
      style={{ minHeight }}
    >
      <div className={mapClipClass}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          className="z-0 h-full w-full"
          style={{ height: "100%", width: "100%", minHeight }}
          maxBounds={[
            [-5.0, 33.0],
            [5.5, 42.0],
          ]}
        >
          <ChangeView center={center} zoom={zoom} />
          <MapResize />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker position={userLocation} zIndexOffset={900}>
              <Popup>Your location</Popup>
            </Marker>
          )}

          {providers.map((provider) => {
            if (provider.latitude == null || provider.longitude == null) return null;

            const position: [number, number] = [
              Number(provider.latitude),
              Number(provider.longitude),
            ];
            const isSelected =
              selectedProviderId != null &&
              String(provider.id) === String(selectedProviderId);

            return (
              <Fragment key={String(provider.id)}>
                {showRadius && provider.service_radius ? (
                  <Circle
                    center={position}
                    radius={provider.service_radius * 1000}
                    pathOptions={{
                      color: "#0ea5e9",
                      fillColor: "#0ea5e9",
                      fillOpacity: 0.1,
                      interactive: false,
                    }}
                  />
                ) : null}
                <Marker
                  position={position}
                  zIndexOffset={isSelected ? 1200 : 1000}
                  eventHandlers={{
                    mouseover: () => setHoveredProvider(provider),
                    mouseout: () =>
                      setHoveredProvider((current) =>
                        current?.id === provider.id ? null : current
                      ),
                    click: (e) => {
                      const marker = e.target as L.Marker;
                      marker.openPopup();
                      onMarkerClick?.(provider);
                    },
                  }}
                >
                  <Popup className="provider-map-popup" minWidth={240}>
                    <ProviderMapPopup provider={provider} />
                  </Popup>
                </Marker>
              </Fragment>
            );
          })}

          {hoveredProvider &&
            hoveredProvider.latitude != null &&
            hoveredProvider.longitude != null && (
              <MapHoverPreviewOverlay
                provider={hoveredProvider}
                latitude={Number(hoveredProvider.latitude)}
                longitude={Number(hoveredProvider.longitude)}
              />
            )}
        </MapContainer>
      </div>
    </div>
  );
}
