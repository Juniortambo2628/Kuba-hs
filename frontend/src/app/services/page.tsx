"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
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

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[600px] rounded-2xl" />
});

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
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

const categoryImages = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=600&auto=format&fit=crop",
];

type SortOption = "name" | "services" | "default";

export default function ServicesPage() {
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
    if (sortBy === "services") return (b.services?.length || 0) - (a.services?.length || 0);
    return 0;
  });

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />

      <PageHero
        title="Our Services"
        subtitle="Browse our comprehensive list of home service categories and find exactly what you need."
        breadcrumbs={[{ label: "Services" }]}
        bgImage="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
        searchAction="/services"
        searchPlaceholder="Search services..."
      />

      <div className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className={`lg:w-72 shrink-0 ${filterOpen ? "" : "hidden lg:block"}`}>
              <div className="sticky top-24 space-y-6">
                <Card className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-5 space-y-5">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                      <SlidersHorizontal className="w-4 h-4" /> Filters & Sort
                    </h3>

                    {/* Sort */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="default">Default</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="services">Most Services</option>
                      </select>
                    </div>

                    {/* Quick links to categories */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Categories</label>
                      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                        {categories.map((cat) => (
                          <a
                            key={cat.id}
                            href={`#cat-${cat.id}`}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span>{cat.name}</span>
                            <span className="text-xs bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{cat.services?.length || 0}</span>
                          </a>
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
                  Showing <span className="font-bold text-gray-900 dark:text-white">{categories.length}</span> categories
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView(view === "map" ? "grid" : "map")}
                    className="hidden sm:flex items-center gap-2 text-sky-600 bg-sky-50 dark:bg-sky-500/10 rounded-xl px-4"
                  >
                    <MapIcon className="w-4 h-4" />
                    <span className="font-black text-[10px] uppercase tracking-widest">{view === "map" ? "Close Map" : "Map View"}</span>
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
                  </div>
                </div>
              </div>

              {/* Cards */}
              {isLoading ? (
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : view === "map" ? "w-full" : "flex flex-col gap-6"}>
                  {view === "map" ? (
                    <div className="h-[600px] w-full">
                       <MapView 
                        providers={[]} // We don't have providers here, maybe categories? 
                        // Actually let's just show a general map or markers for categories if they have coordinates.
                        // For now, it's a placeholder map for "Service Coverage"
                        center={[25.2048, 55.2708]}
                       />
                    </div>
                  ) : (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden">
                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        <CardContent className="p-6 space-y-3">
                          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-white/10" />
                          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10" />
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : view === "grid" ? (
                /* ───── GRID VIEW ───── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sorted.map((category, index) => {
                    const Icon = category.icon && iconMap[category.icon] ? iconMap[category.icon] : <Wrench className="w-6 h-6 text-blue-500" />;
                    return (
                      <motion.div
                        key={category.id}
                        id={`cat-${category.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                      >
                        <Card className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-xl flex flex-col h-full">
                          {/* Image header */}
                          <div className="h-44 relative overflow-hidden">
                            <img
                              src={categoryImages[index % categoryImages.length]}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                                  {Icon}
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight">{category.name}</h3>
                              </div>
                              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold border border-white/20">
                                {category.services?.length || 0} services
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <CardContent className="p-5 flex-1 flex flex-col">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                              {category.description || `Top-rated ${category.name.toLowerCase()} professionals in your area.`}
                            </p>
                            <ul className="space-y-2 mb-5 flex-1">
                              {category.services?.slice(0, 4).map((service) => (
                                <li key={service.id}>
                                  <Link
                                    href={`/providers?service=${service.id}`}
                                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors group/link"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span className="flex-1">{service.name}</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-500" />
                                  </Link>
                                </li>
                              ))}
                              {(category.services?.length || 0) > 4 && (
                                <li className="text-xs text-gray-400 pl-4">+{category.services.length - 4} more</li>
                              )}
                            </ul>
                            <Link
                              href={`/services/${category.id}`}
                              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors border border-blue-200 dark:border-blue-500/20"
                            >
                              View Category <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* ───── LIST VIEW ───── */
                <div className="flex flex-col gap-4">
                  {sorted.map((category, index) => {
                    const Icon = category.icon && iconMap[category.icon] ? iconMap[category.icon] : <Wrench className="w-6 h-6 text-blue-500" />;
                    return (
                      <motion.div
                        key={category.id}
                        id={`cat-${category.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                      >
                        <Card className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-lg">
                          <CardContent className="p-0 flex flex-col md:flex-row">
                            {/* Thumb */}
                            <div className="md:w-56 h-44 md:h-auto relative overflow-hidden shrink-0">
                              <img
                                src={categoryImages[index % categoryImages.length]}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            {/* Details */}
                            <div className="flex-1 p-5 flex flex-col">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0">
                                    {Icon}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{category.name}</h3>
                                    <p className="text-xs text-gray-400">{category.services?.length || 0} services available</p>
                                  </div>
                                </div>
                                <Link
                                  href={`/services/${category.id}`}
                                  className="hidden md:inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors border border-blue-200 dark:border-blue-500/20 shrink-0"
                                >
                                  View Category <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                {category.description || `Top-rated ${category.name.toLowerCase()} professionals in your area.`}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-auto">
                                {category.services?.slice(0, 5).map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/providers?service=${service.id}`}
                                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-white/10 transition-colors"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href={`/services/${category.id}`}
                                className="md:hidden inline-flex items-center justify-center mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2.5 rounded-xl transition-colors border border-blue-200 dark:border-blue-500/20"
                              >
                                View Category <ChevronRight className="ml-1 w-4 h-4" />
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
