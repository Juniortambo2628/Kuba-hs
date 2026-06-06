"use client";

import { MapPin, Star } from "lucide-react";

export interface ProviderSearchMetaData {
  rating?: number | null;
  location_name?: string | null;
}

interface ProviderSearchMetaProps {
  provider: ProviderSearchMetaData;
  locationFallback?: string;
  className?: string;
}

export function ProviderSearchMeta({
  provider,
  locationFallback = "Nairobi, KE",
  className,
}: ProviderSearchMetaProps) {
  return (
    <div className={className ?? "flex items-center gap-3 mt-0.5"}>
      <span className="text-label-caps flex items-center gap-1 text-amber-500">
        <Star className="w-3 h-3 fill-current" /> {provider.rating ?? "New"}
      </span>
      <span className="w-1 h-1 rounded-full bg-border" />
      <span className="text-label-caps flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {provider.location_name || locationFallback}
      </span>
    </div>
  );
}
