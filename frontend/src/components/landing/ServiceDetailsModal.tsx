"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Clock, ShieldCheck, 
  CheckCircle2, Users, ArrowRight, MessageSquare, ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "@/components/booking/BookingModal";

interface Provider {
  id: string;
  business_name: string;
  bio: string;
  rating: number;
  review_count: number;
  is_verified: boolean;
  logo: string;
  user?: {
     name: string;
     profile_photo_path: string | null;
  };
}

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  image_urls: { url: string }[];
  provider: Provider;
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

export function ServiceDetailsModal({ isOpen, onClose, serviceId }: ServiceDetailsModalProps) {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [similarProviders, setSimilarProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchServiceDetails();
    }
  }, [isOpen, serviceId]);

  const fetchServiceDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch main service details
      const response = await axiosInstance.get(`/api/featured-services`);
      const details = response.data.data.find((s: any) => s.id === serviceId);
      setService(details);
      
      // Fetch similar providers
      if (details) {
          try {
            const similarRes = await axiosInstance.get(`/api/featured-services/${details.id}/similar`);
            setSimilarProviders(similarRes.data.data);
          } catch (err) {
            console.error("Failed to fetch similar providers", err);
          }
      }
    } catch (error) {
      console.error("Failed to fetch service details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-[#0B0F19] border-gray-200 dark:border-white/10 rounded-[32px] shadow-2xl">
        <DialogTitle className="sr-only">
          {service ? service.name : "Service Details"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {service ? `Details and booking options for ${service.name}` : "Loading service details..."}
        </DialogDescription>
        
        {isLoading ? (
          <div className="p-12 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : service ? (
          <div className="flex flex-col lg:flex-row h-[80vh] lg:h-auto overflow-y-auto lg:overflow-visible">
            {/* Left Side - Image & Hero */}
            <div className="lg:w-2/5 relative h-64 lg:h-auto">
              <img 
                src={service.image_urls?.[0]?.url || 'https://images.unsplash.com/photo-1581578731522-74548b360k44?q=80&w=1000&auto=format&fit=crop'} 
                className="w-full h-full object-cover"
                alt={service.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="mb-3 bg-sky-500 text-white border-0">{service.category}</Badge>
                <h2 className="text-2xl font-black text-white leading-tight">{service.name}</h2>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col h-full bg-white dark:bg-[#0B0F19]">
              <DialogHeader className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-sky-500/20">
                      <AvatarImage src={service.provider.logo} />
                      <AvatarFallback className="bg-sky-500/10 text-sky-500">{service.provider.business_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {service.provider.business_name}
                        {service.provider.is_verified && <ShieldCheck className="w-4 h-4 text-sky-500" />}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 font-bold">{service.provider.rating || 4.9}</span>
                        </div>
                        <span>({service.provider.review_count || 120} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${service.base_price}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{service.pricing_type}</p>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                  <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-sky-600 transition-all">Details</TabsTrigger>
                  <TabsTrigger value="timings" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-sky-600 transition-all">Availability</TabsTrigger>
                  <TabsTrigger value="similar" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-sky-600 transition-all">Similar</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-0 space-y-6">
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <Clock className="w-5 h-5 text-sky-500 mb-2" />
                      <p className="text-xs font-bold text-gray-400 uppercase">Estimated Time</p>
                      <p className="font-bold dark:text-white">2 - 4 Hours</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 mb-2" />
                      <p className="text-xs font-bold text-gray-400 uppercase">Satisfaction</p>
                      <p className="font-bold dark:text-white">100% Guaranteed</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timings" className="mt-0">
                  <div className="space-y-3">
                    {["Monday - Friday", "Saturday", "Sunday"].map((day, i) => (
                      <div key={day} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <span className="font-medium dark:text-white">{day}</span>
                        <span className="text-sm font-bold text-sky-500">
                          {i === 2 ? "Closed" : "08:00 AM - 06:00 PM"}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="similar" className="mt-0">
                  <div className="space-y-4">
                    {similarProviders.length > 0 ? (
                      similarProviders.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-sky-500/50 transition-all group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={p.provider?.logo} />
                              <AvatarFallback>{p.provider?.business_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold dark:text-white text-sm">{p.provider?.business_name}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span className="flex items-center gap-1 text-yellow-500">
                                   <Star className="w-3 h-3 fill-current" /> {p.provider?.rating || 4.8}
                                </span>
                                <span>•</span>
                                <span>From ${p.base_price}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-gray-500 text-sm italic">
                        No similar providers found in this area.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-auto pt-8 flex gap-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5">
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Message
                </Button>
                <Button 
                   onClick={() => setIsBookingModalOpen(true)}
                   className="flex-[2] h-14 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-lg shadow-xl shadow-sky-500/20 overflow-hidden group relative"
                >
                   <span className="relative z-10">BOOK NOW</span>
                   <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">Service not found.</div>
        )}
      </DialogContent>

      {service && (
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          provider={service.provider as any}
          service={service as any}
        />
      )}
    </Dialog>
  );

  function onOpenChange(open: boolean) {
    if (!open) onClose();
  }
}
