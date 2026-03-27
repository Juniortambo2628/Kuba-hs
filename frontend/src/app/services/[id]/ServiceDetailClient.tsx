"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { useData } from "@/hooks/useData";
import { HeroSkeleton, CardSkeleton } from "@/components/shared/AdvancedSkeleton";
import { 
  Star, MapPin, Clock, ShieldCheck, 
  CheckCircle2, Users, ArrowRight, MessageSquare,
  Sparkles, Shield, Zap, Heart, Search
} from "lucide-react";
import { PremiumEmptyState } from "@/components/shared/PremiumEmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking/BookingModal";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { ProviderService, Provider } from "@/types";
import { motion } from "framer-motion";

export default function ServiceDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const isGeneral = searchParams.get('type') === 'general';

    const { data: resData, isLoading } = useData<any>(id ? (isGeneral ? `/api/services/${id}` : `/api/featured-services/${id}`) : null);
    
    // Normalize data based on endpoint
    const service = isGeneral ? resData?.service : resData;
    const providerServices = isGeneral ? resData?.provider_services : null;

    const { data: similarRes } = useData<any>(id && !isGeneral ? `/api/featured-services/${id}/similar` : null);
    
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    const similarRecords = isGeneral ? (providerServices || []) : (similarRes?.data || []);
    const primaryProvider = service?.provider || (isGeneral && similarRecords.length > 0 ? similarRecords[0].provider : null);
    const featuredService = isGeneral && similarRecords.length > 0 ? similarRecords[0] : service;

    const [isFavorite, setIsFavorite] = useState(false);
    
    const handleToggleFavorite = async () => {
        const nextState = !isFavorite;
        setIsFavorite(nextState);
        
        // Simulating API call with elite feedback
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            toast.success(nextState ? "Added to your collection" : "Removed from collection", {
                description: nextState ? "This service will be easier to find next time." : "The service was removed from your favorites.",
                icon: nextState ? <Heart className="w-4 h-4 fill-primary text-primary" /> : <Heart className="w-4 h-4" />
            });
        } catch (error) {
            setIsFavorite(!nextState); // Rollback
            toast.error("Cloud sync failed", { description: "We couldn't update your favorites right now." });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <HeroSkeleton />
                <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-6">
                         <CardSkeleton />
                      </div>
                      <CardSkeleton />
                   </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!service) return (
        <div className="min-h-screen">
            <Navbar />
            <div className="py-32">
                <PremiumEmptyState 
                    icon={Search}
                    title="Service Experience Not Found"
                    description="The professional infrastructure you're looking for might have been relocated or updated. Continue browsing our verified marketplace for alternatives."
                    actionLabel="Return to Marketplace"
                    actionHref="/services"
                />
            </div>
            <Footer />
        </div>
    );

    // The primaryProvider is already derived above for both general and featured views
    // const primaryProvider = service.provider; (removed duplicate)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
            <Navbar />
            
            <HighImpactHero
                title={service?.name || service?.service?.name || "Service Detail"}
                subtitle={(service?.category?.name || service?.category) || service?.service?.category?.name || "Professional Home Services"}
                bgImage={getMediaUrl(service?.image_urls?.[0]?.url || service?.thumbnail_url || service?.service?.icon_url, 'service')}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: service?.name || "Detail" }
                ]}
                actions={
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleToggleFavorite}
                        className={`rounded-full h-12 w-12 border border-white/20 backdrop-blur-md transition-all ${isFavorite ? 'bg-white text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                }
            />

            <main className="container mx-auto px-6 py-16 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm backdrop-blur-sm">
                            <h2 className="text-3xl font-bold mb-6 dark:text-white">About this Service</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic mb-8">
                                {service.description || service.service?.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex gap-4 p-6 rounded-3xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20">
                                    <div className="h-12 w-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Flexible Timing</p>
                                        <p className="font-bold text-gray-900 dark:text-white">Scheduled at your convenience</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Quality Safe</p>
                                        <p className="font-bold text-gray-900 dark:text-white">100% Satisfaction Guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Process / Steps */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-bold dark:text-white px-4">How it Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               {[
                                 { icon: Sparkles, title: "Choose & Book", text: "Select your preferred time and provider" },
                                 { icon: Shield, title: "Secure Payment", text: "Safe transactions via Paystack or M-Pesa" },
                                 { icon: Zap, title: "Service Day", text: "Pro arrives and completes the job" }
                               ].map((step, i) => (
                                 <div key={i} className="relative p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 group hover:border-sky-500/50 transition-all">
                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/10 flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                                       <step.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 dark:text-white">{step.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.text}</p>
                                    <div className="absolute top-8 right-8 text-6xl font-black text-gray-50 dark:text-white/5 pointer-events-none">{i+1}</div>
                                 </div>
                               ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Pricing & Booking Card */}
                    <div className="space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden sticky top-32">
                            <div className="bg-sky-600 p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                   <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-sky-100 opacity-80">Estimated Price</p>
                                   <div className="flex items-baseline gap-2">
                                      <span className="text-4xl font-black">KES {Number(featuredService?.base_price || 0).toLocaleString()}</span>
                                      <span className="text-sky-200 text-sm font-bold">/ {featuredService?.pricing_type || 'service'}</span>
                                   </div>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-10">
                                   <Zap className="w-32 h-32 rotate-12" />
                                </div>
                            </div>
                            <CardContent className="p-8 bg-white dark:bg-slate-900 space-y-8">
                                <div className="space-y-4">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Featured Professional</p>
                                   <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                      <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-xl">
                                         <AvatarImage src={getMediaUrl(primaryProvider?.logo || primaryProvider?.user?.avatar_url, 'avatar')} />
                                         <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">{primaryProvider?.business_name?.[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                         <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                            {primaryProvider?.business_name}
                                            {primaryProvider?.is_verified && <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />}
                                         </h4>
                                         <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <div className="flex items-center gap-0.5 text-yellow-500">
                                               <Star className="w-3 h-3 fill-current" />
                                               <span className="font-bold">{primaryProvider?.rating || 4.9}</span>
                                            </div>
                                            <span>({primaryProvider?.review_count || 50}+ reviews)</span>
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="space-y-3">
                                   <Button 
                                      onClick={() => { setSelectedProvider(primaryProvider as any); setIsBookingModalOpen(true); }}
                                      className="w-full h-16 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg shadow-xl shadow-sky-600/20 group"
                                   >
                                      Book This Pro
                                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                   </Button>
                                   <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 group transition-all">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Chat with Pro
                                   </Button>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                   <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      <Shield className="w-3 h-3 text-sky-500" />
                                      Secure Marketplace Protection
                                   </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Similar Providers Section */}
                {similarRecords.length > 0 && (
                   <section className="mt-24 space-y-12">
                      <div className="flex items-end justify-between px-4">
                         <div>
                            <Badge className="bg-sky-500/10 text-sky-500 border-none mb-4">{isGeneral ? "Available Professionals" : "Marketplace Options"}</Badge>
                            <h2 className="text-4xl font-bold dark:text-white">{isGeneral ? "Who provides this service?" : "Other Professionals for this Service"}</h2>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {similarRecords.map((item: any, i: number) => {
                            const p = item.provider;
                            return (
                               <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: i * 0.1 }}
                               >
                                  <Card className="rounded-[2.5rem] bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all group">
                                     <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                           <Avatar className="h-14 w-14 border border-slate-100 dark:border-white/10 shadow-sm">
                                              <AvatarImage src={getMediaUrl(p?.logo || p?.user?.avatar_url, 'avatar')} />
                                              <AvatarFallback>{p?.business_name?.[0]}</AvatarFallback>
                                           </Avatar>
                                           <div>
                                              <h4 className="font-bold dark:text-white group-hover:text-sky-500 transition-colors">{p?.business_name}</h4>
                                              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                                                 <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                 {p?.rating || 4.8} Review score
                                              </div>
                                           </div>
                                        </div>
                                        <div className="space-y-2">
                                           <div className="flex justify-between text-xs font-bold text-slate-500">
                                              <span>Price Estimate</span>
                                              <span className="text-slate-900 dark:text-white">KES {item.base_price.toLocaleString()}</span>
                                           </div>
                                        </div>
                                        <Button 
                                           onClick={() => { setSelectedProvider(p); setIsBookingModalOpen(true); }}
                                           variant="ghost" 
                                           className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-sky-500 hover:text-white font-bold group/btn"
                                        >
                                           View Pro Profile
                                           <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                        </Button>
                                     </CardContent>
                                  </Card>
                               </motion.div>
                            );
                         })}
                      </div>
                   </section>
                )}
            </main>

            {(featuredService || service) && selectedProvider && (
              <BookingModal 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                provider={selectedProvider as any}
                service={(featuredService || service) as any}
              />
            )}

            <Footer />
        </div>
    );
}
