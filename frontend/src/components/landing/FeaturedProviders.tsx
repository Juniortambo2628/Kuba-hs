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
import Link from "next/link";

import { Provider } from "@/types";

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

export function FeaturedProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get('/api/search');
        setProviders(response.data.data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch featured providers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F19] relative pb-32 transition-colors duration-300">
       <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className={designSystem.typography.section.badge}>
            Top Rated Pros
          </Badge>
          <h2 className={designSystem.typography.section.title}>
            Featured Professionals
          </h2>
          <p className={designSystem.typography.section.subtitle}>
            Book trusted, verified and highly-rated professionals for your home service needs.
          </p>
        </motion.div>

        <motion.div
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
              ) : (
                providers.map((provider) => (
                  <CarouselItem key={provider.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/providers/${provider.id}`}>
                      <Card className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-white/20 transition-all cursor-pointer group h-full rounded-2xl overflow-hidden flex flex-col">
                        <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 relative">
                            {provider.is_verified && (
                                <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-green-200 dark:border-green-500/20">
                                    <Shield className="w-3 h-3" /> Verified
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6 relative flex-1 flex flex-col pb-8">
                          <div className="absolute -top-10 left-6">
                              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#0B0F19] bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-2xl text-gray-400 shadow-lg">
                                 {provider.logo || provider.user?.avatar_url ? (
                                     <img src={getAvatarUrl(provider.logo || provider.user?.avatar_url) || ""} alt={provider.business_name} className="w-full h-full object-cover" />
                                 ) : (
                                     <img src="/placeholders/kuba-placeholder.png" alt={provider.business_name} className="w-full h-full object-cover opacity-50" />
                                 )}
                              </div>
                          </div>
                          <div className="mt-10 mb-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {provider.business_name}
                              </h3>
                               <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-3">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {provider.location_name || "Local"}</span>
                                  <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" /> {provider.rating || 4.9}</span>
                              </div>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                              {provider.bio || "Professional home service provider ready to help."}
                          </p>
                          <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between mt-auto">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                                  Starting from <span className="text-gray-900 dark:text-white text-base font-bold ml-1">KES 5,000/hr</span>
                              </span>
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                  <ChevronRight className="w-4 h-4 text-gray-500 dark:text-white group-hover:text-white" />
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
