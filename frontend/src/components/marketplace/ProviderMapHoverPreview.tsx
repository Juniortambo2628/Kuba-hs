"use client";

import { MapPin, Star, Shield, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProviderSearchRowData } from "@/components/marketplace/ProviderSearchRow";

type ProviderService = {
  name?: string;
  service?: { name?: string } | null;
};

interface ProviderMapHoverPreviewProps {
  provider: ProviderSearchRowData & {
    rating?: number | null;
    review_count?: number;
    is_verified?: boolean;
    starting_price?: number | string | null;
    location_name?: string | null;
    services?: ProviderService[] | null;
  };
  className?: string;
}

function serviceNames(services?: ProviderService[] | null): string[] {
  return (services ?? [])
    .map((s) => s.name || s.service?.name)
    .filter((name): name is string => Boolean(name));
}

/** Compact card shown when hovering a map pin */
export function ProviderMapHoverPreview({ provider, className }: ProviderMapHoverPreviewProps) {
  const rating =
    provider.rating != null ? Number(provider.rating).toFixed(1) : null;
  const price =
    provider.starting_price != null
      ? `KES ${Number(provider.starting_price).toLocaleString()}`
      : null;
  const offered = serviceNames(provider.services);
  const shown = offered.slice(0, 4);
  const extra = offered.length - shown.length;

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border/60 bg-card p-3 shadow-xl pointer-events-none",
        className
      )}
    >
      <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">
        {provider.business_name}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {provider.location_name && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground max-w-full">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{provider.location_name}</span>
          </span>
        )}
        {rating && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {rating}
          </span>
        )}
        {provider.is_verified && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            <Shield className="h-3 w-3" />
            Verified
          </span>
        )}
      </div>

      {shown.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            Services offered
          </p>
          <ul className="space-y-1">
            {shown.map((name) => (
              <li
                key={name}
                className="text-[11px] font-medium text-foreground leading-snug line-clamp-1"
              >
                {name}
              </li>
            ))}
          </ul>
          {extra > 0 && (
            <p className="text-[10px] font-semibold text-muted-foreground mt-1">
              +{extra} more
            </p>
          )}
        </div>
      )}

      {price && (
        <p className="text-xs font-bold text-foreground mt-2 tabular-nums">
          From {price}
        </p>
      )}
    </div>
  );
}
