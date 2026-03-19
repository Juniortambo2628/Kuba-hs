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
import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ServiceDetailsModal } from "./ServiceDetailsModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // If it starts with / (e.g. /placeholders/...) use it directly with backend base
  if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
  // Otherwise assume it's a storage-relative path
  return `${BACKEND_URL}/storage/${path.replace('storage/', '')}`;
};

const SERVICE_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop';

const getServiceImage = (service: Service) => {
  return getAvatarUrl(service.image_urls?.[0]?.url)
    || getAvatarUrl(service.service_thumbnail_url)
    || SERVICE_FALLBACK_IMAGE;
};

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
    <section className="py-24 bg-gray-50 dark:bg-[#080B14] overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-sky-500/10 text-sky-500 border-sky-500/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider">
              Latest Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Recently <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Posted</span>
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-xl font-medium leading-relaxed">
              Discover recently added services from top-rated professionals.
            </p>
          </motion.div>

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
              Explore All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-sky-500" />
            </Link>
          </motion.div>
        </div>

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
              services.map((service, i) => (
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
                        <img 
                          src={getServiceImage(service)} 
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => { (e.target as HTMLImageElement).src = SERVICE_FALLBACK_IMAGE; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 right-4">
                           <Badge className="bg-white/20 backdrop-blur-md border-0 text-white font-bold">{service.category}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                           <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-[10px] font-bold text-white tracking-wider">{service.provider.rating || 4.9}</span>
                           </div>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-8">
                         <div className="flex items-center gap-2 mb-3">
                           <Avatar className="h-6 w-6 border border-sky-500/20">
                              <AvatarImage src={getAvatarUrl(service.provider.logo || service.provider.user?.avatar_url) || ""} />
                              <AvatarFallback>{service.provider.business_name[0]}</AvatarFallback>
                           </Avatar>
                           <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest">{service.provider.business_name}</span>
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
                              <span className="text-xs font-bold tracking-widest">Available Now</span>
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
      </div>

      <ServiceDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceId={selectedServiceId} 
      />
    </section>
  );
}
