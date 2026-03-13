"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon not loading in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
    position: [number, number] | null;
    onChange: (lat: number, lng: number) => void;
    radius?: number; // Service radius in km
}

function LocationMarker({ position, onChange }: { position: L.LatLng | null, onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

// Separate component to handle centering without causing continuous re-renders
function MapCenterer({ position }: { position: L.LatLng | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    return null;
}

export default function LocationPicker({ position, onChange, radius }: LocationPickerProps) {
    const kenyaBounds: L.LatLngBoundsExpression = [
        [5.5, 33.9], // North West
        [-4.7, 41.9]  // South East
    ];
    const initialCenter = position ? new L.LatLng(position[0], position[1]) : new L.LatLng(-1.2921, 36.8219); // Default to Nairobi

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-white/10 relative z-0">
             <MapContainer
                center={initialCenter}
                zoom={12}
                minZoom={6}
                maxBounds={kenyaBounds}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
             >
                 <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 />
                 <LocationMarker 
                    position={position ? new L.LatLng(position[0], position[1]) : null} 
                    onChange={onChange} 
                 />
                 {position && radius && radius > 0 && (
                     <Circle 
                        center={new L.LatLng(position[0], position[1])}
                        radius={radius * 1000} // Leaflet's radius is in meters
                        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 }}
                     />
                 )}
                 <MapCenterer position={position ? new L.LatLng(position[0], position[1]) : null} />
                 
                 {/* Floating instructions */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/90 backdrop-blur shadow-sm px-4 py-2 rounded-full border border-gray-100 dark:border-white/10 z-[1000] pointer-events-none text-xs font-bold text-gray-600 dark:text-gray-300">
                     Click anywhere on the map to drop your pin
                 </div>
             </MapContainer>
        </div>
    );
}
