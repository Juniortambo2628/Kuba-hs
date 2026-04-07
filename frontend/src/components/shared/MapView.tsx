"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Star, MapPin, ChevronRight } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  providers?: any[];
  onMarkerClick?: (provider: any) => void;
  showRadius?: boolean;
  userLocation?: [number, number];
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  center = [-1.2921, 36.8219], // Default to Nairobi, Kenya
  zoom = 11,
  providers = [],
  onMarkerClick,
  showRadius = false,
  userLocation
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-gray-100 animate-pulse rounded-3xl" />;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner relative z-10">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full"
        maxBounds={[[-5.0, 33.0], [5.5, 42.0]]} // Kenya bounding box
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
            <Marker position={userLocation}>
                <Popup>Your Location</Popup>
            </Marker>
        )}

        {providers.map((provider) => {
          if (!provider.latitude || !provider.longitude) return null;
          
          return (
            <div key={provider.id}>
                <Marker 
                    position={[Number(provider.latitude), Number(provider.longitude)]}
                    eventHandlers={{
                        click: () => onMarkerClick?.(provider),
                    }}
                >
                    <Popup className="provider-map-popup">
                        <div className="p-3 min-w-[200px] space-y-3">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-gray-900 leading-tight">{provider.business_name}</h4>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {provider.location_name}
                                </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                                    <span>{provider.rating || 'NEW'}</span>
                                </div>
                                <a 
                                    href={`/providers/${provider.id}`}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                >
                                    View Profile <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </Popup>
                </Marker>
                {showRadius && provider.service_radius && (
                    <Circle 
                        center={[Number(provider.latitude), Number(provider.longitude)]}
                        radius={provider.service_radius * 1000} // radius in meters
                        pathOptions={{ color: 'skyBlue', fillColor: 'skyBlue', fillOpacity: 0.1 }}
                    />
                )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
