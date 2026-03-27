"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ServiceDetailsModal } from "./ServiceDetailsModal";
import { getMediaUrl } from "@/lib/utils";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import Image from "next/image";


interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  image_urls: { url: string }[];
  service_thumbnail_url?: string;
  provider: {
    id: string;
    business_name: string;
    rating: number;
    review_count: number;
    is_verified: boolean;
    logo: string;
    user?: {
      avatar_url?: string;
    };
  };
}

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axiosInstance.get('/api/featured-services');
        setServices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCardClick = (id: string) => {
    setSelectedServiceId(id);
    setIsModalOpen(true);
  };

  if (!isLoading && services.length === 0) return null;

  return (
    <section className="py-24 bg-muted/50 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <LandingSectionHeader 
            badge="New Services"
            title={<>Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Added</span></>}
            subtitle="Check out these new services from our top-rated pros."
            align="left"
            className="mb-0"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/providers"
              className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white hover:border-sky-500/50 transition-all shadow-sm hover:shadow-xl"
            >
              See All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-sky-500" />
            </Link>
          </motion.div>
        </div>

        {services.length > 0 && (
          <Tabs defaultValue="All" className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-4 hide-scrollbar">
              <TabsList className="bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl h-auto p-1.5 inline-flex">
                {["All", ...Array.from(new Set(services.map(s => s.category)))].map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-sky-500 data-[state=active]:text-sky-600 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {["All", ...Array.from(new Set(services.map(s => s.category)))].map(category => {
              const catServices = category === "All" ? services : services.filter(s => s.category === category);
              
              return (
                <TabsContent key={category} value={category} className="mt-0 outline-none focus-visible:outline-none">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4 md:-ml-6">
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <CarouselItem key={i} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div className="space-y-4">
                              <Skeleton className="h-64 w-full rounded-[32px]" />
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                        catServices.map((service, i) => (
                          <CarouselItem key={service.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              onClick={() => handleCardClick(service.id)}
                            >
                              <Card className="group relative h-[450px] bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 cursor-pointer">
                                {/* Image Header */}
                                <div className="relative h-56 overflow-hidden">
                                   <Image 
                                     src={getMediaUrl(service.image_urls?.[0]?.url || service.service_thumbnail_url, 'service') || "/placeholders/service-light.png"} 
                                     alt={service.name}
                                     fill
                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                     className="object-cover group-hover:scale-110 transition-transform duration-700"
                                   />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                  <div className="absolute top-4 right-4">
                                     <Badge className="bg-white/20 backdrop-blur-md border-0 text-white font-bold">{service.category}</Badge>
                                  </div>
                                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                     <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-bold text-white tracking-tight">{service.provider.rating || 'NEW'}</span>
                                     </div>
                                  </div>
                                </div>
          
                                {/* Content */}
                                <CardContent className="p-8">
                                   <div className="flex items-center gap-2 mb-3">
                                      <Avatar className="h-6 w-6 border border-sky-500/20">
                                         <AvatarImage src={getMediaUrl(service.provider.logo || service.provider.user?.avatar_url, 'avatar') || ""} />
                                         <AvatarFallback>{service.provider.business_name[0]}</AvatarFallback>
                                      </Avatar>
                                     <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-tight">{service.provider.business_name}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-sky-500 transition-colors line-clamp-1">
                                    {service.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                                    {service.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10">
                                     <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin className="w-4 h-4 text-sky-500" />
                                        <span className="text-xs font-bold tracking-tight">Available Now</span>
                                     </div>
                                     <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        <span className="text-xs font-medium text-gray-400 mr-1">from</span>
                                        KES {service.base_price}
                                     </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </CarouselItem>
                        ))
                      )}
                    </CarouselContent>
                    <div className="flex justify-center mt-12 gap-4">
                      <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-sky-500 hover:text-white transition-all shadow-lg" />
                      <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-sky-500 hover:text-white transition-all shadow-lg" />
                    </div>
                  </Carousel>
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </div>

      <ServiceDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceId={selectedServiceId} 
      />
    </section>
  );
}
