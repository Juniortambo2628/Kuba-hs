"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";

const MapView = dynamic(() => import("./ProviderLocationMapView"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full min-h-[220px] rounded-2xl" />,
});

const emptySubscribe = () => () => {};

interface ProviderLocationMapProps {
  latitude?: number | string | null;
  longitude?: number | string | null;
  locationName?: string | null;
  serviceRadius?: number | null;
  businessName?: string;
  className?: string;
  /** Narrow sidebar layout on provider profile */
  compact?: boolean;
}

function parseCoord(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

interface GeocodeOutcome {
  key: string;
  position: { lat: number; lng: number } | null;
  failed: boolean;
}

export function ProviderLocationMap({
  latitude,
  longitude,
  locationName,
  serviceRadius,
  businessName,
  className,
  compact = false,
}: ProviderLocationMapProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [geocode, setGeocode] = useState<GeocodeOutcome | null>(null);

  const directLat = parseCoord(latitude);
  const directLng = parseCoord(longitude);

  const directPosition = useMemo(() => {
    if (directLat != null && directLng != null) {
      return { lat: directLat, lng: directLng };
    }
    return null;
  }, [directLat, directLng]);

  const outcome = geocode && geocode.key === locationName ? geocode : null;
  const resolved = outcome?.position ?? null;
  const geocodeFailed = outcome?.failed ?? false;
  const position = directPosition ?? resolved;
  const isGeocoding =
    mounted &&
    !directPosition &&
    Boolean(locationName?.trim()) &&
    !position &&
    !geocodeFailed;

  useEffect(() => {
    if (directPosition) return;
    if (!locationName?.trim()) return;

    let cancelled = false;

    axiosInstance
      .get("/api/geocode/search", { params: { q: locationName, limit: 1 } })
      .then((res) => {
        if (cancelled) return;
        const hit = res.data?.results?.[0];
        if (hit?.lat && hit?.lon) {
          setGeocode({
            key: locationName,
            position: { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) },
            failed: false,
          });
        } else {
          setGeocode({ key: locationName, position: null, failed: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeocode({ key: locationName, position: null, failed: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [directPosition, locationName]);

  if (!locationName && !position) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-[1.75rem] border border-border/50 bg-card overflow-hidden shadow-sm",
        className
      )}
      aria-label="Provider location"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40 bg-muted/20">
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">Service area</p>
          {locationName && (
            <p className="text-xs text-muted-foreground truncate">{locationName}</p>
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative bg-muted/30",
          compact ? "h-[200px] lg:h-[220px]" : "h-[220px] sm:h-[260px]"
        )}
      >
        {isGeocoding && !position ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading map…
          </div>
        ) : position ? (
          <MapView
            position={[position.lat, position.lng]}
            label={businessName || locationName || "Provider"}
            radiusKm={serviceRadius ?? undefined}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
            <MapPin className="h-8 w-8 text-muted-foreground/40" />
            <p>
              {geocodeFailed
                ? "Map unavailable for this address."
                : "Location coordinates not set yet."}
            </p>
            {locationName && (
              <p className="font-semibold text-foreground">{locationName}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
