"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Fix for default Leaflet icon not loading in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Provider {
  id: number;
  business_name: string;
  bio: string;
  logo: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface InteractiveMapProps {
  providers: Provider[];
  center?: [number, number];
  zoom?: number;
}

// Sub-component to automatically adjust map bounds when providers change
function MapUpdater({ providers, center }: { providers: Provider[], center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (providers.length > 0) {
      const validProviders = providers.filter(p => p.latitude && p.longitude);
      if (validProviders.length > 0) {
        const bounds = L.latLngBounds(validProviders.map(p => [Number(p.latitude), Number(p.longitude)]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else {
         map.setView(center, 10);
      }
    } else {
        map.setView(center, 10);
    }
  }, [providers, map, center]);

  return null;
}

export default function InteractiveMap({ providers, center = [51.505, -0.09], zoom = 10 }: InteractiveMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-white/10 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater providers={providers} center={center} />

        {providers.map((provider) => {
          if (!provider.latitude || !provider.longitude) return null;

          return (
            <Marker key={provider.id} position={[Number(provider.latitude), Number(provider.longitude)]}>
              <Popup className="kuba-popup rounded-2xl">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                         {provider.logo ? (
                             <img src={provider.logo} alt={provider.business_name} className="w-full h-full object-cover" />
                         ) : (
                             <Users className="w-5 h-5 text-gray-400" />
                         )}
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 leading-tight">{provider.business_name}</h4>
                         <span className="flex items-center text-xs text-yellow-600 font-bold gap-1 mt-0.5">
                             <Star className="w-3 h-3 fill-yellow-500" /> 4.9
                         </span>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {provider.bio || "Professional home services."}
                  </p>
                  <Button asChild size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <Link href={`/providers/${provider.id}`}>
                          View Profile <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
