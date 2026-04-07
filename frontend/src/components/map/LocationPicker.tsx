"use client";

import { useState, useRef, useEffect, useMemo, FormEvent } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

function LocationMarker({ position, onChange, onClearAccuracy }: { position: L.LatLng | null, onChange: (lat: number, lng: number) => void, onClearAccuracy: () => void }) {
    useMapEvents({
        click(e) {
            onClearAccuracy();
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
            map.flyTo(position, 16);
        }
    }, [position, map]);
    return null;
}

export default function LocationPicker({ position, onChange, radius }: LocationPickerProps) {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLocating, setIsLocating] = useState(false);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const mapRef = useRef<L.Map>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                onChange(latitude, longitude);
                setAccuracy(accuracy);
                setIsLocating(false);
                
                if (accuracy > 200) {
                    toast.info("Location detected, but accuracy is low. Please adjust the pin manually.");
                } else {
                    toast.success("Location pinpointed!");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Could not determine your location. Please check your permissions.");
                setIsLocating(false);
            },
            { 
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSearch = async (e?: any) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ke&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (result: any) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setAccuracy(null); // Reset accuracy on search
        onChange(lat, lon);
        setSearchResults([]);
        setSearchQuery(result.display_name);
    };
    const kenyaBounds: L.LatLngBoundsExpression = [
        [5.5, 33.9], // North West
        [-4.7, 41.9]  // South East
    ];
    const initialCenter = position ? new L.LatLng(position[0], position[1]) : new L.LatLng(-1.2921, 36.8219); // Default to Nairobi

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 relative group shadow-sm">
             {/* Search Overlay */}
             <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2">
                <div className="relative group/search">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-blue-600 transition-colors" />
                    <Input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch(e as any);
                            }
                        }}
                        placeholder="Search for a location, street, or building..."
                        className="pl-10 pr-10 h-11 bg-white/95 dark:bg-black/95 backdrop-blur-md border-none shadow-xl rounded-xl text-xs font-bold"
                    />
                    {isSearching ? (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button 
                                type="button"
                                onClick={handleGetCurrentLocation}
                                disabled={isLocating}
                                className={`p-1.5 rounded-lg transition-all ${isLocating ? 'bg-blue-50 text-blue-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                title="Use my current location"
                            >
                                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                            </button>
                            <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
                            <button 
                                type="button"
                                onClick={(e) => handleSearch(e as any)} 
                                className="text-[10px] font-black text-blue-600 uppercase hover:scale-105 transition-transform"
                            >
                                Find
                            </button>
                        </div>
                    )}
                </div>

                {searchResults.length > 0 && (
                    <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        {searchResults.map((result, i) => (
                            <button
                                key={i}
                                onClick={() => selectLocation(result)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-600/10 flex items-start gap-3 transition-colors border-b border-gray-50 dark:border-white/5 last:border-none"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate uppercase tracking-tight">
                                        {result.display_name.split(',')[0]}
                                    </p>
                                    <p className="text-[10px] text-gray-500 truncate">
                                        {result.display_name.split(',').slice(1).join(',')}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
             </div>

             {!mounted ? (
                <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
             ) : (
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
                        onClearAccuracy={() => setAccuracy(null)}
                    />
                    {position && accuracy && accuracy > 0 && (
                        <Circle 
                            center={new L.LatLng(position[0], position[1])}
                            radius={accuracy}
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                        />
                    )}
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
             )}
        </div>
    );
}
