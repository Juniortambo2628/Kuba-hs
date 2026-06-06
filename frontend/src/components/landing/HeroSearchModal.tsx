"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  Navigation,
  Loader2,
  SlidersHorizontal,
  Shield,
  Star,
  Calendar,
  User,
  Map,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { providerHref } from "@/lib/provider-urls";
import {
  ProviderHotelSearchCard,
  type ProviderSearchRowData,
} from "@/components/marketplace";
import { cn } from "@/lib/utils";
import { useCMS } from "@/contexts/CMSContext";
import { MarketingViewToggle } from "@/components/marketing/MarketingViewToggle";
import { NativeSelectField } from "@/components/shared/NativeSelectField";
import { dialogBelowNavClass } from "@/lib/footer-ui";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[320px] w-full rounded-2xl bg-muted animate-pulse" />
  ),
});

interface Category {
  id: string | number;
  name: string;
}

type SearchProvider = ProviderSearchRowData & {
  review_count?: number;
  is_verified?: boolean;
  starting_price?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  service_radius?: number | null;
};

const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

interface HeroSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "service" | "location";
  initialView?: "list" | "map";
}

function formatDateOption(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function HeroSearchModal({ isOpen, onClose, initialTab, initialView = "list" }: HeroSearchModalProps) {
  const { getS } = useCMS();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<SearchProvider[]>([]);
  const [resultView, setResultView] = useState<"list" | "map">("list");
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [bookingDate, setBookingDate] = useState(formatDateOption(1));
  const [bookingEndDate, setBookingEndDate] = useState(formatDateOption(7));
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [proCount, setProCount] = useState(1);
  const [mapSelectedId, setMapSelectedId] = useState<string | number | null>(null);

  const modalTitle = getS("home_hero", "search_modal_title", "Find Professionals");
  const modalDescription = getS(
    "home_hero",
    "search_modal_description",
    "Search verified experts and book the right pro for your home."
  );

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (locationTerm && locationTerm !== "Current Location") {
        params.append("location", locationTerm);
      }
      if (selectedCategory) params.append("category_id", String(selectedCategory));
      if (minRating) params.append("min_rating", minRating.toString());
      if (onlyVerified) params.append("is_verified", "true");
      if (maxPrice < 50000) params.append("max_price", maxPrice.toString());
      if (coords) {
        params.append("latitude", coords.lat.toString());
        params.append("longitude", coords.lng.toString());
      }
      const { data } = await axiosInstance.get(`/api/search?${params.toString()}`);
      const rows = (data.data || []) as SearchProvider[];
      setResults(
        rows.map((item) => ({
          id: item.id,
          business_name: item.business_name,
          location_name: item.location_name,
          rating: item.rating,
          review_count: item.review_count,
          is_verified: item.is_verified,
          starting_price: item.starting_price,
          latitude: item.latitude != null ? Number(item.latitude) : null,
          longitude: item.longitude != null ? Number(item.longitude) : null,
          service_radius: item.service_radius != null ? Number(item.service_radius) : null,
          logo: item.logo,
          services: item.services,
          user: item.user,
        }))
      );
      setTotalResults(data.meta?.total ?? rows.length);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, locationTerm, selectedCategory, coords, minRating, onlyVerified, maxPrice]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/api/categories");
        setCategories(data.data ?? []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    setSearchTerm("");
    setLocationTerm("");
    setCoords(null);
    setSelectedCategory(null);
    setMinRating(null);
    setMaxPrice(50000);
    setOnlyVerified(false);
    setResultView(initialView);
    setMapSelectedId(null);
  }, [isOpen, initialTab, initialView]);

  const mapProviders = useMemo(
    () => results.filter((p) => p.latitude != null && p.longitude != null),
    [results]
  );

  const mapCenter = useMemo((): [number, number] => {
    if (coords) return [coords.lat, coords.lng];
    if (mapProviders.length > 0) {
      return [Number(mapProviders[0].latitude), Number(mapProviders[0].longitude)];
    }
    return NAIROBI_CENTER;
  }, [coords, mapProviders]);

  const userMapLocation = coords ? ([coords.lat, coords.lng] as [number, number]) : undefined;

  const selectedMapProvider = useMemo(
    () =>
      mapSelectedId != null
        ? results.find((p) => String(p.id) === String(mapSelectedId)) ?? null
        : null,
    [results, mapSelectedId]
  );

  useEffect(() => {
    if (!isOpen) return;
    const delayDebounceFn = setTimeout(() => {
      void performSearch();
    }, 350);
    return () => clearTimeout(delayDebounceFn);
  }, [
    isOpen,
    searchTerm,
    locationTerm,
    selectedCategory,
    coords,
    minRating,
    onlyVerified,
    maxPrice,
    performSearch,
  ]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationTerm("Current Location");
        setIsLocating(false);
        void performSearch();
      },
      () => setIsLocating(false)
    );
  };

  const activeFilterCount = [
    minRating ? 1 : 0,
    onlyVerified ? 1 : 0,
    maxPrice < 50000 ? 1 : 0,
    selectedCategory ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const resultsLabel = locationTerm
    ? `Professionals${locationTerm ? ` in ${locationTerm}` : ""}`
    : "Professionals near you";

  const buildProviderHref = (provider: SearchProvider) =>
    `${providerHref(provider)}?date=${encodeURIComponent(bookingDate)}&time=${encodeURIComponent(bookingTime)}&guests=${proCount}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "w-[calc(100%-1.5rem)] sm:max-w-[920px] p-0 gap-0 overflow-hidden",
          "bg-background border border-border/60 rounded-[1.75rem] shadow-2xl",
          dialogBelowNavClass.maxHeight,
          "flex flex-col",
          dialogBelowNavClass.centerTop,
          "translate-x-[-50%] translate-y-[-50%]",
          "duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-in-100 data-[state=open]:zoom-in-100",
          "data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-0"
        )}
      >
        <DialogTitle className="sr-only">{modalTitle}</DialogTitle>
        <DialogDescription className="sr-only">{modalDescription}</DialogDescription>

        <div className="shrink-0 p-5 sm:p-6 border-b border-border/50 space-y-4">
          <div className="flex items-center gap-3 pr-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus={initialTab !== "location"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={getS("home_hero", "search_modal_query_placeholder", "What service do you need?")}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-muted/30 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 rounded-xl border border-border/60 bg-muted/20 p-1.5">
            <div className="flex items-center gap-2 px-3 py-2.5 min-w-0 sm:col-span-1">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus={initialTab === "location"}
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                placeholder={getS("home_hero", "hero_search_location_label", "Location")}
                className="bg-transparent border-none text-xs font-bold text-foreground w-full focus:outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={isLocating}
                className="shrink-0 text-primary hover:text-primary/80"
                aria-label="Use current location"
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="px-3 py-2.5 border-t sm:border-t-0 sm:border-l border-border/50 min-w-0">
              <NativeSelectField
                icon={Calendar}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                aria-label="Start date"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                  const val = formatDateOption(offset);
                  return (
                    <option key={offset} value={val}>
                      {offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : val}
                    </option>
                  );
                })}
              </NativeSelectField>
            </div>

            <div className="px-3 py-2.5 border-t sm:border-t-0 sm:border-l border-border/50 min-w-0">
              <NativeSelectField
                icon={Calendar}
                value={bookingEndDate}
                onChange={(e) => setBookingEndDate(e.target.value)}
                aria-label="End date"
              >
                {[7, 14, 21, 30].map((offset) => {
                  const val = formatDateOption(offset);
                  return (
                    <option key={offset} value={val}>
                      {val}
                    </option>
                  );
                })}
              </NativeSelectField>
            </div>

            <div className="px-3 py-2.5 border-t sm:border-t-0 sm:border-l border-border/50 min-w-0">
              <NativeSelectField
                icon={User}
                value={String(proCount)}
                onChange={(e) => setProCount(Number(e.target.value))}
                aria-label="Number of professionals"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Pro" : "Pros"}
                  </option>
                ))}
              </NativeSelectField>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMinRating(null);
                setOnlyVerified(false);
                setMaxPrice(50000);
                setSelectedCategory(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-700 dark:text-violet-300 px-3.5 py-2 text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              All Filters ({activeFilterCount})
            </button>
            <button
              type="button"
              onClick={() => setMinRating(minRating === 4 ? null : 4)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold",
                minRating === 4
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-background text-muted-foreground border-border/60"
              )}
            >
              <Star className={cn("w-3.5 h-3.5", minRating === 4 ? "fill-white" : "fill-amber-400 text-amber-400")} />
              4+ Rating
            </button>
            <button
              type="button"
              onClick={() => setMaxPrice(maxPrice === 5000 ? 50000 : 5000)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold",
                maxPrice <= 5000
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-background text-muted-foreground border-border/60"
              )}
            >
              KES {maxPrice <= 5000 ? "Under 5k" : "Any price"}
            </button>
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold",
                onlyVerified
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-background text-muted-foreground border-border/60"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Verified only
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === String(cat.id) ? null : String(cat.id)
                  )
                }
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                  selectedCategory === String(cat.id)
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-background text-muted-foreground border-border/60 hover:border-primary/30"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-b border-border/40 shrink-0">
          <p className="text-sm font-bold text-foreground min-w-0 truncate">
            {resultsLabel}
            {totalResults > 0 && (
              <span className="text-muted-foreground font-semibold">
                , {totalResults} results
              </span>
            )}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {isSearching && (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching…
              </span>
            )}
            <MarketingViewToggle
              view={resultView}
              onViewChange={setResultView as any}
              modes={["list", "map"]}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {resultView === "map" ? (
            <div className="p-4 sm:p-6 flex flex-col gap-3 shrink-0">
              <p className="text-xs text-muted-foreground font-medium">
                {mapProviders.length > 0 ? (
                  <>
                    {mapProviders.length} professionals on map
                    {mapProviders.length < results.length &&
                      ` (${results.length - mapProviders.length} without map location)`}
                  </>
                ) : (
                  <>Showing Nairobi — use search or GPS to find pins</>
                )}
              </p>
              <div className="relative h-[min(52vh,360px)] min-h-[280px] w-full rounded-2xl border border-border/60 shadow-inner overflow-visible">
                <MapView
                  center={mapCenter}
                  zoom={coords ? 13 : mapProviders.length > 0 ? 12 : 11}
                  providers={mapProviders}
                  userLocation={userMapLocation}
                  showRadius={mapProviders.length > 0}
                  minHeight={280}
                  selectedProviderId={mapSelectedId}
                  onMarkerClick={(provider) => setMapSelectedId(provider.id)}
                />
              </div>
              {selectedMapProvider && (
                <ProviderHotelSearchCard
                  provider={selectedMapProvider}
                  href={buildProviderHref(selectedMapProvider)}
                  className="ring-2 ring-primary/25"
                />
              )}
              {mapProviders.length === 0 && (
                <div className="flex flex-col items-center text-center py-2 px-4">
                  <p className="text-xs text-muted-foreground max-w-sm">
                    No professionals with map coordinates yet. Try a broader search or use your location.
                  </p>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    className="mt-2 text-sm font-bold text-primary hover:underline"
                  >
                    Use my location
                  </button>
                </div>
              )}
              <Link
                href="/providers"
                onClick={onClose}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
              >
                <Map className="h-3.5 w-3.5" />
                Open full map on providers page
              </Link>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-4 kuba-scroll">
              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map((result) => (
                    <ProviderHotelSearchCard
                      key={result.id}
                      provider={result}
                      href={buildProviderHref(result)}
                      onClick={onClose}
                    />
                  ))
                ) : !isSearching ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center opacity-60">
                    <Sparkles className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-muted-foreground">
                      {searchTerm.length >= 2
                        ? "No professionals match your search"
                        : "Start typing to find professionals"}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 sm:px-6 border-t border-border/50 flex items-center justify-between bg-muted/20">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">ESC</kbd> to close
          </p>
          <Link
            href="/providers"
            onClick={onClose}
            className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-2 hover:underline"
          >
            View full directory
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
