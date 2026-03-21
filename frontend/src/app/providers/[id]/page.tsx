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
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { BookingModal } from "@/components/booking/BookingModal";
import axiosInstance from "@/lib/axios";
import { getMediaUrl } from "@/lib/utils";

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
    image_urls?: Array<{ id: string; url: string }>;
  }>;
}

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axiosInstance.get(`/api/providers/${unwrappedParams.id}`);
        setProvider(response.data.data);
      } catch (error) {
        console.error("Failed to fetch provider:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProvider();
  }, [unwrappedParams.id]);

  const handleBooking = (service: any = null) => {
    setSelectedService(service || provider?.services[0]);
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={provider?.business_name || "Professional Profile"}
        subtitle={provider?.bio || "Institutional grade professional provider verified for specialized logistical and structural service requirements."}
        breadcrumbs={[
            { label: "Providers", href: "/providers" },
            { label: provider?.business_name || "Profile" }
        ]}
        cmsKey="provider_profile_hero"
      >
        <div className="flex flex-wrap gap-4 items-center">
            {provider?.is_verified && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest capitalize flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Institutional Verified
                </div>
            )}
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/20 backdrop-blur-md">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-[11px] font-black tracking-widest">{provider?.rating || 'NEW'} RANKING</span>
            </div>
        </div>
      </HighImpactHero>

      <div className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isPageLoading ? (
             <div className="space-y-8 animate-pulse">
                 <div className="flex items-end gap-6 pb-8 border-b border-gray-200 dark:border-white/10">
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-zinc-800" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-10 w-1/3 bg-gray-200 dark:bg-white/10" />
                        <Skeleton className="h-6 w-1/4 bg-gray-200 dark:bg-white/10" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                     <div className="lg:col-span-2 space-y-6">
                         <Skeleton className="h-8 w-1/4 bg-gray-200 dark:bg-white/10" />
                         <Skeleton className="h-24 w-full bg-gray-200 dark:bg-white/10" />
                         <Skeleton className="h-48 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                     </div>
                     <div className="space-y-6">
                         <Skeleton className="h-64 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                     </div>
                 </div>
             </div>
          ) : !provider ? (
            <div className="text-center py-32 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Professional not found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">The service provider you are looking for does not exist.</p>
                <Button asChild variant="outline" className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white">
                  <Link href="/providers">Back to Providers</Link>
                </Button>
            </div>
          ) : (
            <>
                {/* Institutional Header */}
                <motion.div
                  className="flex flex-col md:flex-row md:items-center gap-10 pb-12 border-b border-border/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                    <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white dark:border-black bg-slate-50 dark:bg-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center group relative shrink-0">
                        {provider.logo ? (
                            <img src={getMediaUrl(provider.logo, 'avatar')} alt={provider.business_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-primary/5 flex items-center justify-center font-black text-5xl text-primary/10 italic">
                                {provider.business_name.charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <h2 className="text-4xl font-black tracking-tighter text-foreground italic leading-none">
                                {provider.business_name}
                            </h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/10 text-[10px] font-black tracking-widest capitalize">
                                <CheckCircle2 className="w-3.5 h-3.5" /> High Reliability
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium text-sm">
                            <span className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-border/40 italic"><MapPin className="w-4 h-4 text-primary" /> Multi-Regional Operative</span>
                            <span className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-border/40 italic"><Clock className="w-4 h-4 text-primary" /> &lt; 45m Response Protocol</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Button 
                          size="lg" 
                          variant="outline"
                          asChild
                          className="border-border/60 text-foreground hover:bg-muted font-bold px-8 h-14 rounded-2xl transition-all hover:shadow-lg"
                        >
                            <Link href={`/dashboard/chat?provider=${provider.id}`}>
                                Message Architecture
                            </Link>
                        </Button>
                        <Button 
                          size="lg" 
                          onClick={() => handleBooking()}
                          className="bg-primary text-white font-bold px-10 h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            <CalendarCheck className="w-4 h-4 mr-2" /> Initiate Booking
                        </Button>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        
                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-border/40"
                        >
                            <h2 className="text-xl font-black tracking-widest text-muted-foreground/60 capitalize mb-8 flex items-center gap-3">
                                <div className="w-6 h-1 bg-primary rounded-full" /> Operational Profile
                            </h2>
                            <div className="prose dark:prose-invert prose-slate max-w-none text-foreground font-medium text-base leading-relaxed italic mb-10">
                                {provider.bio || "This institutional partner has successfully completed the Kuba verification protocol and is available for specialized regional service deployments."}
                            </div>

                            {provider.specialized_skills && provider.specialized_skills.length > 0 && (
                                <div className="space-y-6 pt-8 border-t border-border/10">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Industry Technical Clusters</h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {provider.specialized_skills.map((skill, index) => (
                                            <div key={index} className="bg-white dark:bg-black text-foreground border border-border/40 px-4 py-2 rounded-xl text-xs font-bold tracking-tight shadow-sm">
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-black tracking-tighter text-foreground italic mb-10 flex items-center gap-4">
                               <div className="w-10 h-1 bg-primary rounded-full" /> Service Architecture <span className="text-muted-foreground font-medium NOT-italic text-sm">Deployment Matrix</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {provider.services?.map((ps) => (
                                    <Card 
                                      key={ps.id} 
                                      className="bg-white dark:bg-black border border-border/40 hover:border-primary/40 transition-all duration-500 group rounded-[2.5rem] overflow-hidden cursor-default shadow-sm hover:shadow-2xl hover:shadow-primary/5 h-full flex flex-col"
                                    >
                                        <CardContent className="p-0 flex flex-col h-full">
                                            <div className="aspect-[4/3] w-full bg-slate-50 dark:bg-zinc-900 overflow-hidden relative group/img border-b border-border/10">
                                                <img 
                                                  src={getMediaUrl(ps.service_thumbnail_url, 'service')} 
                                                  alt={ps.name} 
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex items-end">
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                                         <CheckCircle2 className="w-5 h-5 text-white" />
                                                      </div>
                                                      <h4 className="font-bold text-white text-lg tracking-tight italic">{ps.name}</h4>
                                                   </div>
                                                </div>
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <p className="text-muted-foreground text-sm font-medium leading-relaxed italic line-clamp-2 mb-8">{ps.description}</p>
                                                
                                                <div className="space-y-6 mt-auto">
                                                   <div className="flex flex-wrap gap-4 pb-6 border-b border-border/10">
                                                      <div className="flex flex-col">
                                                         <span className="text-[9px] font-black text-muted-foreground/60 capitalize tracking-widest mb-1.5">Project Rate</span>
                                                         <span className="text-foreground text-xl font-black tracking-tighter italic">KES {Number(ps.base_price).toLocaleString()}</span>
                                                      </div>
                                                      <div className="h-10 w-px bg-border/20 self-center" />
                                                      <div className="flex flex-col">
                                                         <span className="text-[9px] font-black text-muted-foreground/60 tracking-widest mb-1.5">Logistical Fee</span>
                                                         <span className="text-foreground text-sm font-bold tracking-tight">{Number(ps.travel_fee) > 0 ? `KES ${ps.travel_fee}` : 'WAVED'}</span>
                                                      </div>
                                                   </div>

                                                   <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                         <span className="text-[10px] font-black text-emerald-600/80 capitalize tracking-widest">Active Operative</span>
                                                      </div>
                                                      <Button 
                                                        className="rounded-2xl font-bold text-[10px] capitalize tracking-widest h-12 px-8 bg-slate-50 dark:bg-zinc-900 border border-border/40 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                                        onClick={() => handleBooking(ps)}
                                                      >
                                                          Book Domain
                                                      </Button>
                                                   </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.section>

                    </div>

                    {/* Sidebar */}
                    <motion.div
                      className="space-y-10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="bg-slate-50 dark:bg-zinc-900 border border-border/40 rounded-[2.5rem] sticky top-32 overflow-hidden shadow-2xl shadow-primary/5">
                            <CardContent className="p-10 space-y-10">
                                <h3 className="font-black text-foreground italic text-xl tracking-tight flex items-center gap-3">
                                   <div className="w-1.5 h-6 bg-primary rounded-full" /> Partner Logistics
                                </h3>
                                
                                <ul className="space-y-8">
                                    <li className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                                           <Shield className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight text-foreground capitalize">Compliance Checked</p>
                                            <p className="text-xs font-bold text-muted-foreground/60 mt-1 italic">Institutional grade vetting completed</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                                           <Star className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight text-foreground uppercase">Platinum Standard</p>
                                            <p className="text-xs font-bold text-muted-foreground/60 mt-1 italic">Consistently top performing partner</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                                           <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight text-foreground uppercase">Response Protocol</p>
                                            <p className="text-xs font-bold text-muted-foreground/60 mt-1 italic">Active monitoring for rapid interaction</p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-10 pt-10 border-t border-border/10 space-y-6">
                                    <p className="text-xs font-medium text-muted-foreground text-center italic leading-relaxed">Require strategic coordination or support architecture clarification?</p>
                                    <Button asChild variant="outline" className="w-full border-border/60 text-foreground hover:bg-muted font-bold h-12 rounded-xl">
                                        <Link href="/contact">Inquiry Framework</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </>
          )}
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
    </main>
  );
}
