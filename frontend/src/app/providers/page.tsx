"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, SlidersHorizontal, Search, Filter,
  Hammer, Paintbrush, Droplets, Lightbulb, Check, ShieldCheck, Star
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCMS } from "@/contexts/CMSContext";
import { ProviderCard, type ProviderCardData } from "@/components/marketplace";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import {
  MarketingListingBody,
  MarketingFilterCard,
  MarketingViewToggle,
  MarketingListingToolbar,
} from "@/components/marketing";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import {
  FilterField,
  FilterSelect,
  FilterCheckbox,
  FilterRatingGroup,
} from "@/components/shared/ui";
import { AppButton } from "@/components/shared/ui/AppButton";
import { marketingUi } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";
import { providerHref } from "@/lib/provider-urls";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[600px] rounded-2xl" />
});

interface Provider {
  id: number;
  user_id: number;
  business_name: string;
  bio: string;
  logo: string | null;
  banner?: string | null;
  is_verified: boolean;
  latitude: number | string | null;
  longitude: number | string | null;
  service_radius: number | null;
  location_name: string;
  rating: number | null;
  review_count: number;
  user: {
    name: string;
    profile_photo_path: string | null;
  };
  services?: any[];
  starting_price?: number;
}

function CircleSelector<T>({
  value,
  onChange,
  options
}: {
  value: T | null;
  onChange: (val: T | null) => void;
  options: { label: string; value: T | null }[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        const isAny = opt.value === null;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center font-bold text-xs transition-all cursor-pointer",
              isAny ? "px-4 h-9 rounded-full" : "w-9 h-9 rounded-full",
              active
                ? "bg-foreground text-background font-black border border-foreground"
                : "bg-card text-foreground border border-border hover:border-muted-foreground/60"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-label={`Toggle ${label}`}
        className={cn(
          "w-10 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none relative flex items-center",
          checked ? "bg-indigo-600" : "bg-muted dark:bg-zinc-800"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

import { MarketingFilterSidebar } from "@/components/marketing/MarketingFilterSidebar";

function ProvidersContent() {
  const { getS } = useCMS();
  const searchParams = useSearchParams();
  
  // Parse all query states from URL to keep in sync dynamically
  const categoryId = searchParams.get('category_id') || searchParams.get('category');
  const serviceId = searchParams.get('service');
  const searchQuery = searchParams.get('search');
  const minRating = searchParams.get('min_rating') ? Number(searchParams.get('min_rating')) : null;
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : 50000;
  const onlyVerified = searchParams.get('is_verified') === '1';
  const radius = searchParams.get('radius') ? Number(searchParams.get('radius')) : 50;
  const instantBook = searchParams.get('instant_book') === '1';
  const eqIncluded = searchParams.get('equipment_included') === '1';
  const sortOrder = searchParams.get('sort_by_price') || null;
  const selectedServiceIds = searchParams.getAll('service_ids[]').map(Number);
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleNearMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      setIsPageLoading(true);
      try {
        let url = '/api/search?page=1';
        if (categoryId) url += `&category_id=${categoryId}`;
        if (serviceId) url += `&service_id=${serviceId}`;
        if (searchQuery) url += `&search=${searchQuery}`;
        if (minRating) url += `&min_rating=${minRating}`;
        if (maxPrice < 50000) url += `&max_price=${maxPrice}`;
        if (onlyVerified) url += `&is_verified=1`;
        if (location) {
          url += `&latitude=${location.lat}&longitude=${location.lng}`;
        }
        url += `&radius=${radius}`;
        if (sortOrder) url += `&sort_by_price=${sortOrder}`;
        if (selectedServiceIds.length > 0) {
          selectedServiceIds.forEach(id => {
            url += `&service_ids[]=${id}`;
          });
        }
        if (instantBook) url += `&instant_book=1`;
        if (eqIncluded) url += `&equipment_included=1`;

        const response = await axiosInstance.get(url);
        setProviders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProviders();
  }, [categoryId, serviceId, searchQuery, minRating, maxPrice, onlyVerified, radius, location, sortOrder, JSON.stringify(selectedServiceIds), instantBook, eqIncluded]);

  return (
      <MarketingListingBody>
          <div className={marketingUi.listing.inner}>
            <aside className={cn(marketingUi.listing.sidebarWide, !filterOpen && "hidden lg:block")}>
              <div className={marketingUi.listing.sidebarSticky}>
                <MarketingFilterSidebar />
              </div>
            </aside>

            <div className={marketingUi.listing.main}>
              <MarketingListingToolbar count={providers.length} countLabel="professionals">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="lg:hidden text-muted-foreground dark:text-gray-400"
                      aria-label="Toggle filters"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </Button>
                    <button
                      onClick={handleNearMe}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isLocating ? "Locating..." : location ? "Near Me Active" : "Find Near Me"}</span>
                    </button>
                  </div>
                  
                  <MarketingViewToggle
                    view={view}
                    onViewChange={setView}
                    modes={["grid", "list", "map"]}
                  />
              </MarketingListingToolbar>


               {/* Cards Grid/List/Map */}
              {isPageLoading ? (
                <div className={view === "grid" ? marketingUi.listing.grid : marketingUi.listing.list}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-4/3 w-full rounded-2xl" />
                  ))}
                </div>
              ) : providers.length === 0 ? (
                <EmptyState
                  variant="marketing"
                  title="No Professionals Found"
                  description="Try adjusting your filters or search terms to explore more possibilities."
                  actionLabel="Clear All Filters"
                  actionHref="/providers"
                />
              ) : view === "map" ? (
                <div className="h-[700px] w-full mt-4 rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                  <MapView 
                    providers={providers.map(p => ({
                      ...p,
                      id: String(p.id),
                      latitude: typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude,
                      longitude: typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude,
                      user: {
                        ...p.user,
                        avatar_url: p.user?.profile_photo_path
                      }
                    }))}
                    showRadius={true}
                    onMarkerClick={(p) => {}}
                  />
                </div>
              ) : (
                <div className={view === "grid" ? marketingUi.listing.grid : marketingUi.listing.list}>
                  {providers.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ProviderCard
                        layout={view === "list" ? "list" : "grid"}
                        provider={
                          { ...provider, id: String(provider.id) } as unknown as ProviderCardData
                        }
                        href={providerHref(provider)}
                        fallbackBio={getS(
                          "providers",
                          "fallback_bio",
                          "Institutional grade professional provider verified for specialized logistical and structural service requirements."
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </MarketingListingBody>
  );
}

function ProvidersPageShell() {
  const searchParams = useSearchParams();
  const baseHero = useMarketingHero("providers");
  const searchQuery = searchParams.get("search");
  const hero = {
    ...baseHero,
    title: searchQuery ? `Professionals for "${searchQuery}"` : baseHero.title,
    badge: searchQuery ? "Search Results" : baseHero.badge,
  };

  return (
    <FavoritesProvider>
      <MarketingPage hero={hero} contained={false} shellClassName="min-h-screen flex flex-col">
        <ProvidersContent />
      </MarketingPage>
    </FavoritesProvider>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 text-center text-muted-foreground">Loading providers...</div>
      }
    >
      <ProvidersPageShell />
    </Suspense>
  );
}
