"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { cn, getMediaUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronRight, Wrench, Sparkles, Droplet, Zap,
  LayoutGrid, List, SlidersHorizontal, Star, ArrowRight,
  Home, Briefcase, Building2, Heart, Car, CheckCircle2, Search, Map as MapIcon
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCMS } from "@/hooks/useCMS";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[600px] rounded-2xl" />
});

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  dynamic_icon_url: string | null;
  services_count: number;
  slug: string;
  services: { id: number; name: string }[];
}

const iconMap: Record<string, React.ReactNode> = {
  wrench: <Wrench className="w-6 h-6 text-blue-500" />,
  sparkles: <Sparkles className="w-6 h-6 text-purple-500" />,
  droplet: <Droplet className="w-6 h-6 text-cyan-500" />,
  bolt: <Zap className="w-6 h-6 text-yellow-500" />,
  car: <Car className="w-6 h-6 text-rose-500" />,
  home: <Home className="w-6 h-6 text-blue-500" />,
  heart: <Heart className="w-6 h-6 text-pink-500" />,
  briefcase: <Briefcase className="w-6 h-6 text-indigo-500" />,
  building: <Building2 className="w-6 h-6 text-emerald-500" />,
};

type SortOption = "name" | "services" | "default";

export default function ServicesPage() {
  const { getS, getImg } = useCMS();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterOpen, setFilterOpen] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const sorted = [...categories].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "services") return (b.services_count || 0) - (a.services_count || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={getS('hero_media', 'services_hero_title', "Our Services")}
        subtitle={getS('hero_media', 'services_hero_subtitle', "Find the best help for your home and business from our trusted service categories.")}
        badge={getS('hero_media', 'services_hero_badge', "Our Marketplace")}
        cmsKey="services_hero_image"
        cmsGroup="hero_media"
      />

      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className={`lg:w-80 shrink-0 ${filterOpen ? "" : "hidden lg:block"}`}>
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-border/40 space-y-6">
                 <h3 className="text-sm font-bold tracking-widest capitalize text-muted-foreground flex items-center gap-2">
                   <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Ecosystem
                 </h3>

                 <div className="space-y-4">
                    <label className="text-[10px] font-bold capitalize tracking-widest text-muted-foreground/60 ml-1">Sort Consistency</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full bg-white dark:bg-black border border-border/40 rounded-xl px-4 py-3 text-xs font-bold tracking-tight text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="default">Default Relevance</option>
                      <option value="name">Numerical Name (A-Z)</option>
                      <option value="services">Service Density</option>
                    </select>
                 </div>

                 <div className="pt-4 border-t border-border/10">
                    <label className="text-[10px] font-bold capitalize tracking-widest text-muted-foreground/60 ml-1 block mb-4">Quick Navigation</label>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map((cat) => (
                        <a
                          key={cat.id}
                          href={`#cat-${cat.id}`}
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-tight text-gray-500 hover:bg-white dark:hover:bg-black hover:text-primary border border-transparent hover:border-border/40 transition-all"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-lg text-[10px]">{cat.services_count || 0}</span>
                        </a>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Grid Content */}
          <div className="flex-1 space-y-12">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold tracking-tight">
                 {categories.length} <span className="text-muted-foreground font-medium">Industry Categories Found</span>
               </h2>
               <div className="flex bg-slate-50 dark:bg-zinc-900 p-1.5 rounded-2xl border border-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("grid")}
                    className={`rounded-xl px-4 h-9 font-bold text-[10px] tracking-widest transition-all ${view === "grid" ? "bg-white dark:bg-black shadow-sm text-primary" : "text-muted-foreground"}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Grid
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("list")}
                    className={`rounded-xl px-4 h-9 font-bold text-[10px] tracking-widest transition-all ${view === "list" ? "bg-white dark:bg-black shadow-sm text-primary" : "text-muted-foreground"}`}
                  >
                    <List className="w-3.5 h-3.5 mr-2" /> List
                  </Button>
               </div>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {[1,2,3,4].map(i => <Skeleton key={i} className="h-72 rounded-[2.5rem]" />)}
               </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-10" : "flex flex-col gap-6"}>
                {sorted.map((category, idx) => {
                  const getIcon = () => {
                    const dynamicUrl = category.dynamic_icon_url;
                    const isMedia = dynamicUrl && (dynamicUrl.includes('/') || dynamicUrl.includes('.') || dynamicUrl.startsWith('http'));

                    if (isMedia) {
                      return (
                        <img 
                          src={getMediaUrl(dynamicUrl)} 
                          alt="" 
                          className="w-6 h-6 object-contain" 
                        />
                      );
                    }

                    // Fallback to name-based icon map (handles slug-like strings from DB)
                    const iconName = (dynamicUrl || category.icon || "Wrench").toLowerCase();
                    if (iconMap[iconName]) return iconMap[iconName];
                    return <Wrench className="w-6 h-6" />;
                  };
                  const IconComponent = getIcon();
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        href={`/services/${category.id}`}
                        className={`group block bg-white dark:bg-black border border-border/40 rounded-[2.5rem] hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${view === 'grid' ? 'p-8' : 'p-6 flex flex-row items-center gap-8'}`}
                      >
                         <div className={`shrink-0 bg-primary/5 rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 ${view === 'grid' ? 'w-16 h-16 mb-8' : 'w-20 h-20'}`}>
                           {IconComponent}
                         </div>
                         
                         <div className="flex-1 space-y-3">
                           <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
                           <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic font-medium">
                             {category.description || `Specialized infrastructure for ${category.name.toLowerCase()} requirements.`}
                           </p>
                           
                           <div className="pt-6 border-t border-border/10 flex items-center justify-between">
                              <span className="text-[10px] font-black capitalize tracking-widest text-primary">
                                {category.services?.length || 0} Specializations
                              </span>
                              <ChevronRight className="w-4 h-4 text-primary opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                           </div>
                         </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
