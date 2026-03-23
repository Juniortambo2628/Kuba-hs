"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Shield, ChevronRight, LayoutGrid, List,
  SlidersHorizontal, CheckCircle2, ArrowRight, Search, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getMediaUrl } from "@/lib/utils";

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
  provider_services: any[];
}

import { useCMS } from "@/hooks/useCMS";

function ProvidersContent() {
  const { getS, getImg } = useCMS();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const serviceId = searchParams.get('service');
  const searchQuery = searchParams.get('search');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const heroTitle = getS('hero', 'providers_hero_title', "Find Trusted Pros Near You");
  const heroSubtitle = getS('hero', 'providers_hero_subtitle', "Find the right pro for your home or office from our verified community.");
  const heroImage = getImg('hero', 'providers_hero_image', "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop");

  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [radius, setRadius] = useState(50);
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

        const response = await axiosInstance.get(url);
        setProviders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProviders();
  }, [categoryId, serviceId, searchQuery, minRating, maxPrice, onlyVerified, radius, location]);

  return (
    <>
      <HighImpactHero
        title={searchQuery ? `Professionals for "${searchQuery}"` : getS('hero_text', 'providers_hero_title', "Our Verified Professionals")}
        subtitle={getS('hero_text', 'providers_hero_subtitle', "Connect with top-rated local experts specialized in your selected industry verticals.")}
        badge={searchQuery ? "Search Results" : getS('hero_text', 'providers_hero_badge', "Verified Professionals")}
        cmsKey="providers"
      />

      <div className="flex-1 py-10 md:py-16 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className={`lg:w-72 shrink-0 ${filterOpen ? "" : "hidden lg:block"}`}>
              <div className="sticky top-24 space-y-6">
                <Card className="bg-muted dark:bg-white/5 border-border dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                  <CardContent className="p-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm tracking-wider">
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                        </h3>
                        {(minRating || onlyVerified || location) && (
                            <button 
                                onClick={() => { setMinRating(null); setOnlyVerified(false); setLocation(null); }}
                                className="text-[10px] font-bold text-blue-600 capitalize tracking-widest hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Proximity */}
                    <div>
                        <Button 
                            onClick={handleNearMe}
                            variant="outline"
                            className={`w-full h-11 rounded-xl border-dashed ${location ? 'border-blue-500 bg-blue-50/50 text-blue-600' : 'border-border'} flex items-center justify-center gap-2 text-xs font-bold transition-all`}
                            disabled={isLocating}
                        >
                            <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce' : ''}`} />
                            {isLocating ? "Locating..." : location ? "Near You (Active)" : "Search Near Me"}
                        </Button>
                    </div>

                    {/* Price Range */}
                    <div>
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground tracking-wider">
                            <span>Max Price</span>
                            <span className="text-blue-600 font-bold">KES {maxPrice.toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" 
                            min="500" 
                            max="50000" 
                            step="500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Verification Status */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground tracking-wider mb-3 block">Security</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={onlyVerified}
                            onChange={(e) => setOnlyVerified(e.target.checked)}
                          />
                          <div className={`w-5 h-5 rounded border ${onlyVerified ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-white/20'} flex items-center justify-center transition-all`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 text-white ${onlyVerified ? 'scale-100' : 'scale-0'} transition-transform`} />
                          </div>
                          <span className={`text-sm ${onlyVerified ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-muted-foreground'} group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}>Verified Pros</span>
                        </label>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground tracking-wider mb-3 block">Minimum Rating</label>
                      <div className="space-y-2">
                        {[4.5, 4.0, 3.5].map((r) => (
                          <label key={r} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="rating" 
                                className="hidden" 
                                checked={minRating === r}
                                onChange={() => setMinRating(r)}
                            />
                            <div className={`w-5 h-5 rounded-full border ${minRating === r ? 'border-blue-500' : 'border-gray-300 dark:border-white/20'} flex items-center justify-center transition-all`}>
                              <div className={`w-2.5 h-2.5 rounded-full bg-blue-500 ${minRating === r ? 'scale-100' : 'scale-0'} transition-transform`} />
                            </div>
                            <span className={`text-sm ${minRating === r ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-muted-foreground'} flex items-center gap-1.5`}>
                              {r}+ <Star className={`w-3.5 h-3.5 ${minRating === r ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Radius */}
                    <div className="pt-4 border-t border-border dark:border-white/10">
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground tracking-wider">
                            <span>Search Radius</span>
                            <span className="text-blue-600 font-bold">{radius}km</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="200" 
                            step="5"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-body-pro text-sm text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{providers.length}</span> professionals
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="lg:hidden text-muted-foreground dark:text-gray-400"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button>
                  <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-border dark:border-white/10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setView("grid")}
                      className={`h-8 w-8 rounded-md ${view === "grid" ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setView("list")}
                      className={`h-8 w-8 rounded-md ${view === "list" ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setView("map")}
                      className={`h-8 w-8 rounded-md ${view === "map" ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
                    >
                      <Map className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

               {/* Cards Grid/List/Map */}
              {isPageLoading ? (
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-10" : "flex flex-col gap-8"}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-[2.5rem]" />
                  ))}
                </div>
              ) : providers.length === 0 ? (
                <motion.div
                  className="text-center py-24 bg-slate-50 dark:bg-zinc-900 border border-border/40 rounded-[3rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-black flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Search className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-3">No Professionals Found</h3>
                  <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto italic">Try adjusting your filters or search terms to explore more possibilities.</p>
                  <Button asChild variant="outline" className="border-border/60 hover:bg-muted font-bold rounded-xl h-12 px-8">
                    <Link href="/providers">Clear All Filters</Link>
                  </Button>
                </motion.div>
              ) : view === "map" ? (
                <div className="h-[700px] w-full mt-4 rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                  <MapView 
                    providers={providers} 
                    showRadius={true}
                    onMarkerClick={(p) => console.log("Clicked pro:", p.business_name)}
                  />
                </div>
              ) : (
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-10" : "flex flex-col gap-8"}>
                  {providers.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link href={`/providers/${provider.id}`}>
                        <Card className={`bg-white dark:bg-black border border-border/40 hover:border-primary/40 transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex ${view === "grid" ? "flex-col h-full rounded-[2.5rem]" : "flex-col md:flex-row rounded-[2rem]"} overflow-hidden`}>
                          
                          {/* Banner Area */}
                          <div className={`${view === "grid" ? "h-40" : "md:w-72 h-48 md:h-auto"} bg-slate-50 dark:bg-zinc-900 relative overflow-hidden shrink-0 border-b border-border/10`}>
                            {provider.is_verified && (
                              <div className="absolute top-5 right-5 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-border/40 text-primary px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest capitalize flex items-center gap-2 z-10 shadow-lg">
                                <Shield className="w-3.5 h-3.5" /> Verified
                              </div>
                            )}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                               <img src="/logo-light.png" className="w-full h-full object-cover scale-150 rotate-12" alt="" />
                            </div>
                          </div>
                          
                          <CardContent className="p-8 relative flex-1 flex flex-col">
                            {/* Institutional Avatar (only in grid) */}
                            {view === "grid" && (
                              <div className="absolute -top-12 left-8">
                                <div className="w-24 h-24 rounded-3xl border-8 border-white dark:border-black bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                                  {provider.logo ? (
                                     <img src={getMediaUrl(provider.logo, 'avatar')} alt={provider.business_name} className="w-full h-full object-cover" />
                                  ) : (
                                     <div className="w-full h-full bg-primary/5 flex items-center justify-center font-black text-3xl text-primary/20 italic">
                                        {provider.business_name.charAt(0)}
                                     </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className={`${view === "grid" ? "mt-12" : "flex-1"}`}>
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors italic leading-none">
                                    {provider.business_name}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-muted-foreground transition-all group-hover:text-foreground">
                                      <MapPin className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" /> 
                                      <span className="text-[11px] font-bold tracking-tight">{provider.location_name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-500/10 transition-all">
                                      <Star className="w-3.5 h-3.5 fill-amber-500" /> 
                                      <span className="text-[11px] font-black">{provider.rating || 'NEW'}</span>
                                    </div>
                                  </div>
                                </div>
                                {view === "list" && (
                                  <div className="w-20 h-20 rounded-2xl border border-border/40 bg-slate-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center font-bold text-xl text-muted-foreground shrink-0 shadow-sm transition-all group-hover:scale-105">
                                    {provider.logo ? (
                                      <img src={getMediaUrl(provider.logo, 'avatar')} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-primary/5 flex items-center justify-center font-black text-2xl text-primary/20 italic">
                                        {provider.business_name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm font-medium leading-relaxed line-clamp-2 italic mb-6">
                                {provider.bio || getS('providers', 'fallback_bio', "Institutional grade professional provider verified for specialized logistical and structural service requirements.")}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mb-8">
                                {["Rapid Deployment", "Verified Liability", "Consolidated Billing"].map(badge => (
                                  <span key={badge} className="text-[9px] font-bold tracking-widest capitalize px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 text-muted-foreground/60 border border-border/20 transition-all group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-6 border-t border-border/10 flex items-center justify-between mt-auto">
                               <div className="flex flex-col">
                                 <span className="text-[9px] text-muted-foreground font-black tracking-widest capitalize leading-none mb-1.5">Baseline Pricing</span>
                                 {provider.provider_services && provider.provider_services.length > 0 ? (
                                   (() => {
                                     const minService = provider.provider_services.reduce((min, s) => 
                                       Number(s.base_price) < Number(min.base_price) ? s : min, 
                                       provider.provider_services[0]
                                     );
                                     return (
                                       <div className="flex items-baseline gap-1">
                                         <span className="text-foreground text-2xl font-black tracking-tighter">
                                           KES {Number(minService.base_price).toLocaleString()}
                                         </span>
                                         {minService.pricing_type === 'hourly' && <span className="text-[10px] font-bold text-muted-foreground tracking-tight capitalize">/ Session</span>}
                                       </div>
                                     );
                                   })()
                                 ) : (
                                   <span className="text-foreground text-xl font-black tracking-tighter italic">POA</span>
                                 )}
                               </div>
                               <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-primary tracking-widest capitalize opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                   View Architecture
                                 </span>
                                 <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 text-primary border border-border/40 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm">
                                   <ArrowRight className="w-5 h-5" />
                                 </div>
                               </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProvidersPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />
      <Suspense fallback={<div className="flex-1 pt-32 pb-24 text-center text-muted-foreground dark:text-white">Loading providers...</div>}>
        <ProvidersContent />
      </Suspense>
      <Footer />
    </main>
  );
}
