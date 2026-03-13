"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
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
  rating_avg: number | null;
  user: {
    name: string;
    profile_photo_path: string | null;
  };
  provider_services: any[];
}

function ProvidersContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const serviceId = searchParams.get('service');
  const searchQuery = searchParams.get('search');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [filterOpen, setFilterOpen] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsPageLoading(true);
      try {
        let url = '/api/search?page=1';
        if (categoryId) url += `&category_id=${categoryId}`;
        if (serviceId) url += `&service_id=${serviceId}`;
        if (searchQuery) url += `&search=${searchQuery}`;

        const response = await axiosInstance.get(url);
        setProviders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProviders();
  }, [categoryId, serviceId, searchQuery]);

  return (
    <>
      <PageHero
        title={searchQuery ? `Results for "${searchQuery}"` : "Our Professionals"}
        subtitle="Find the best local service professionals for your project. All verified and ready to help."
        breadcrumbs={[{ label: "Providers" }]}
        bgImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
        gradientFrom="from-indigo-600"
        gradientTo="to-blue-700"
        searchAction="/providers"
        searchPlaceholder="Search professionals..."
        defaultSearch={searchQuery || ""}
      />

      <div className="flex-1 py-10 md:py-16 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className={`lg:w-72 shrink-0 ${filterOpen ? "" : "hidden lg:block"}`}>
              <div className="sticky top-24 space-y-6">
                <Card className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                  <CardContent className="p-5 space-y-6">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                      <SlidersHorizontal className="w-4 h-4" /> Filters
                    </h3>

                    {/* Verification Status */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Status</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-5 h-5 rounded border border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Verified Pros</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-5 h-5 rounded border border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Available Now</span>
                        </label>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Minimum Rating</label>
                      <div className="space-y-2">
                        {[4.5, 4.0, 3.5].map((rating) => (
                          <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                              {rating}+ <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-bold text-gray-900 dark:text-white">{providers.length}</span> professionals
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="lg:hidden text-gray-500 dark:text-gray-400"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button>
                  <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-gray-200 dark:border-white/10">
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
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                      <div className="h-40 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                      <CardContent className="p-6 pt-14 space-y-3">
                        <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-white/10" />
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : providers.length === 0 ? (
                <motion.div
                  className="text-center py-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No professionals found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">Try adjusting your filters or search terms.</p>
                  <Button asChild variant="outline" className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white">
                    <Link href="/providers">Clear Filters</Link>
                  </Button>
                </motion.div>
              ) : view === "map" ? (
                <div className="h-[600px] w-full mt-2">
                  <MapView 
                    providers={providers} 
                    showRadius={true}
                    onMarkerClick={(p) => console.log("Clicked pro:", p.business_name)}
                  />
                </div>
              ) : (
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
                  {providers.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/providers/${provider.id}`}>
                        <Card className={`bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-white/20 transition-all cursor-pointer group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl flex ${view === "grid" ? "flex-col h-full" : "flex-col md:flex-row"}`}>
                          
                          {/* Banner/Image */}
                          <div className={`${view === "grid" ? "h-36" : "md:w-64 h-48 md:h-auto"} bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-purple-900/40 relative overflow-hidden shrink-0`}>
                            {provider.is_verified && (
                              <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-green-200 dark:border-green-500/20 z-10">
                                <Shield className="w-3 h-3" /> Verified
                              </div>
                            )}
                            {view === "list" && (
                              <img 
                                src={provider.logo || "/placeholders/kuba-placeholder.png"} 
                                alt="" 
                                className={`w-full h-full object-cover ${provider.logo ? "opacity-50 dark:opacity-30" : "opacity-20"} group-hover:scale-105 transition-transform duration-500`} 
                              />
                            )}
                          </div>
                          
                          <CardContent className="p-6 relative flex-1 flex flex-col">
                            {/* Avatar (only in grid) */}
                            {view === "grid" && (
                              <div className="absolute -top-10 left-6">
                                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#0B0F19] bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-2xl text-gray-400 shadow-lg transition-transform group-hover:scale-105">
                                  {provider.logo ? (
                                     <img src={provider.logo} alt={provider.business_name} className="w-full h-full object-cover" />
                                 ) : (
                                     <img src="/placeholders/kuba-placeholder.png" alt={provider.business_name} className="w-full h-full object-cover opacity-50" />
                                 )}
                                </div>
                              </div>
                            )}

                            <div className={`${view === "grid" ? "mt-10" : ""} flex-1`}>
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {provider.business_name}
                                  </h3>
                                  <div className="flex items-center gap-4 mt-1.5">
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5">
                                      <MapPin className="w-4 h-4 text-blue-500" /> Local Pro
                                    </span>
                                    <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-500 gap-1.5 font-bold">
                                      <Star className="w-4 h-4 fill-yellow-500" /> 4.9
                                    </span>
                                  </div>
                                </div>
                                {view === "list" && (
                                  <div className="w-16 h-16 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 overflow-hidden flex items-center justify-center font-bold text-xl text-gray-400 shrink-0">
                                    {provider.logo ? (
                                      <img src={provider.logo} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <img src="/placeholders/kuba-placeholder.png" alt="" className="w-full h-full object-cover opacity-50" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2">
                                {provider.bio || "Professional home service provider ready to help with your next project. Highly rated and dependable."}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mt-4">
                                {["Fast Response", "Background Checked", "Insured"].map(badge => (
                                  <span key={badge} className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-5 mt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">Starting from</span>
                                <span className="text-gray-900 dark:text-white text-lg font-extrabold">$50<span className="text-sm font-normal text-gray-400 ml-0.5">/hr</span></span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                  <ChevronRight className="w-5 h-5" />
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
      <Suspense fallback={<div className="flex-1 pt-32 pb-24 text-center text-gray-500 dark:text-white">Loading providers...</div>}>
        <ProvidersContent />
      </Suspense>
      <Footer />
    </main>
  );
}
