"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, ChevronRight } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Provider } from "@/types";
import { getMediaUrl } from "@/lib/utils";
import Image from "next/image";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";


export function FeaturedProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get('/api/search');
        setProviders(response.data.data.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch featured providers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const displayProviders = [...providers]
    .filter(p => filter === "verified" ? p.is_verified : true)
    .sort((a, b) => {
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <section className="py-24 bg-background relative pb-32 transition-colors duration-300">
       <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LandingSectionHeader 
          badge="Top Rated Pros"
          title="Featured Professionals"
          subtitle="Book trusted, verified and highly-rated professionals for your home service needs."
        >
          {/* Filters & Sorting */}
          {!isLoading && providers.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <Filter className="w-4 h-4 mr-2 text-sky-500" />
                    {filter === "all" ? "All Providers" : "Verified Only"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem onClick={() => setFilter("all")} className="rounded-xl cursor-pointer">All Providers</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("verified")} className="rounded-xl cursor-pointer">Verified Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-sky-500" />
                    {sort === "rating" ? "Highest Rated" : "Default Sort"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem onClick={() => setSort("rating")} className="rounded-xl cursor-pointer">Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("default")} className="rounded-xl cursor-pointer">Default Sort</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </LandingSectionHeader>

        <motion.div
  key={`${filter}-${sort}`}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                      <div className="h-32 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                      <CardContent className="p-6 pt-14">
                        <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 mb-3" />
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : displayProviders.length === 0 ? (
                <div className="w-full text-center py-12 text-gray-500">
                   No providers match your filters.
                </div>
              ) : (
                displayProviders.map((provider) => (
                  <CarouselItem key={provider.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/providers/${provider.id}`}>
                      <Card className="group relative h-[420px] rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-0 bg-black cursor-pointer flex flex-col">
                        {/* Cover Background */}
                        <div className="absolute inset-0 z-0">
                          <Image 
                            src={getMediaUrl(provider.logo || provider.user?.avatar_url) || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"} 
                            alt={`${provider.business_name} cover`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
                        </div>
                        
                        {/* Top Badges */}
                        <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
                            {provider.is_verified && (
                                <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight flex items-center gap-1.5 border border-white/20 shadow-xl">
                                    <Shield className="w-3.5 h-3.5 text-blue-400" /> Verified
                                </div>
                            )}
                            <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 border border-white/20 shadow-xl">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {provider.rating || 'NEW'}
                            </div>
                        </div>

                        {/* Content */}
                        <CardContent className="relative z-10 p-8 pt-10 mt-auto flex flex-col">
                          <div className="flex items-end gap-5 mb-5">
                              <div className="w-20 h-20 rounded-2xl border-2 border-white/20 bg-gray-900 overflow-hidden shrink-0 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 relative">
                                 {provider.logo || provider.user?.avatar_url ? (
                                     <Image 
                                      src={getMediaUrl(provider.logo || provider.user?.avatar_url, 'avatar') || "/placeholders/kuba-placeholder.png"} 
                                      alt={provider.business_name} 
                                      fill
                                      sizes="80px"
                                      className="object-cover" 
                                     />
                                 ) : (
                                     <Image 
                                      src="/placeholders/kuba-placeholder.png" 
                                      alt={provider.business_name} 
                                      fill
                                      sizes="80px"
                                      className="object-cover opacity-50" 
                                     />
                                 )}
                              </div>
                              <div className="flex-1 pb-1">
                                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                                      {provider.business_name}
                                  </h3>
                                  <div className="flex items-center text-xs font-semibold tracking-tight text-gray-400 gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {provider.location_name || "Anywhere"}
                                  </div>
                              </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                              {provider.bio || "Professional home service provider ready to help."}
                          </p>
                          
                          <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-gray-500 tracking-tight mb-0.5">Starting At</span>
                                  <span className="text-white text-lg font-black tracking-tight">
                                    {provider.starting_price ? `KES ${Number(provider.starting_price).toLocaleString()}` : 'N/A'}
                                    <span className="text-sm font-medium text-gray-400 ml-1">{provider.starting_price ? '/hr' : ''}</span>
                                  </span>
                              </div>
                              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                                  <ChevronRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
                              </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800" />
            <CarouselNext className="hidden md:flex -right-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800" />
          </Carousel>
        </motion.div>
        
        <div className="mt-16 text-center">
            <Link 
              href="/providers" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all border border-gray-200 dark:border-white/10"
            >
              View All Professionals
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
        </div>
      </div>
    </section>
  );
}
