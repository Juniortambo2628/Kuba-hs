"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, Shield, Clock, 
  CalendarCheck, ChevronRight, Home,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { BookingModal } from "@/components/booking/BookingModal";
import axiosInstance from "@/lib/axios";
import { getMediaUrl } from "@/lib/utils";
import Image from "next/image";
import { useData } from "@/hooks/useData";
import { HeroSkeleton, CardSkeleton } from "@/components/shared/AdvancedSkeleton";

interface ProviderProfile {
  id: string;
  business_name: string;
  logo: string | null;
  bio: string | null;
  rating: number | null;
  review_count: number;
  is_verified: boolean;
  specialized_skills: string[] | null;
  services: Array<{
    id: string;
    service_id: string;
    base_price: number;
    pricing_type: string;
    min_hours: number;
    travel_fee: number;
    equipment_included: boolean;
    name: string;
    description: string | null;
    category: string | null;
    service_thumbnail_url?: string;
  }>;
}

export default function ProviderProfileClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: provider, isLoading } = useData<ProviderProfile>(id ? `/api/providers/${id}` : null);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const handleBooking = (service: any = null) => {
    setSelectedService(service || provider?.services[0]);
    setIsBookingOpen(true);
  };

  if (isLoading) {
      return (
          <div className="min-h-screen">
            <Navbar />
            <HeroSkeleton />
            <div className="max-w-7xl mx-auto px-4 py-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <Footer />
          </div>
      );
  }

  if (!provider) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <HighImpactHero
        title={provider.business_name}
        subtitle={provider.bio || "Institutional grade professional provider verified for specialized logistical and structural service requirements."}
        breadcrumbs={[
            { label: "Providers", href: "/providers" },
            { label: provider.business_name }
        ]}
        cmsKey="provider_profile_hero"
      >
        <div className="flex flex-wrap gap-4 items-center">
            {provider.is_verified && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest capitalize flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Institutional Verified
                </div>
            )}
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/20 backdrop-blur-md">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-[11px] font-black tracking-widest">{provider.rating || 'NEW'} RANKING</span>
            </div>
        </div>
      </HighImpactHero>

      <div className="flex-1 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                    <section className="bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-border/40">
                        <h2 className="text-xl font-black mb-8 italic tracking-tight uppercase">Operational Profile</h2>
                        <div className="text-foreground leading-relaxed italic mb-10 text-lg">
                            {provider.bio}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black italic mb-10 uppercase tracking-tighter">Service Architecture</h2>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {provider.services?.map((ps) => (
                                <Card key={ps.id} className="rounded-[2.5rem] overflow-hidden border-border/50 hover:shadow-2xl transition-all group">
                                    <CardContent className="p-0">
                                        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                            <Image 
                                              src={getMediaUrl(ps.service_thumbnail_url, 'service')} 
                                              alt={ps.name} 
                                              fill 
                                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <h4 className="font-bold text-lg">{ps.name}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ps.description}</p>
                                            <div className="pt-6 flex justify-between items-center border-t border-border/40">
                                                <span className="font-black text-xl tracking-tighter">KES {Number(ps.base_price).toLocaleString()}</span>
                                                <Button onClick={() => handleBooking(ps)} className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-foreground text-background">Order Promptly</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isBookingOpen && provider && (
          <BookingModal 
            isOpen={isBookingOpen} 
            onClose={() => setIsBookingOpen(false)} 
            provider={provider}
            service={selectedService}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
