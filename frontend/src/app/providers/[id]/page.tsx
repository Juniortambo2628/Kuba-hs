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
import { BookingModal } from "@/components/booking/BookingModal";
import axiosInstance from "@/lib/axios";

interface ProviderProfile {
  id: string;
  business_name: string;
  logo: string | null;
  bio: string | null;
  is_verified: boolean;
  services: Array<{
    id: string;
    service_id: string;
    base_price: number;
    pricing_type: string;
    name: string;
    description: string | null;
    category: string | null;
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

      {/* Hero Breadcrumb Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                {isPageLoading ? "Loading..." : provider?.business_name || "Provider Not Found"}
              </h1>
              <div className="flex items-center gap-2 text-white/60 font-medium text-sm">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/providers" className="hover:text-white transition-colors">Providers</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{provider?.business_name || "Profile"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                {/* Header */}
                <motion.div
                  className="flex flex-col md:flex-row md:items-end gap-6 pb-8 border-b border-gray-200 dark:border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#0B0F19] bg-gray-100 dark:bg-zinc-800 shadow-xl overflow-hidden flex items-center justify-center font-bold text-4xl text-gray-400">
                        {provider.logo ? (
                            <img src={provider.logo} alt={provider.business_name} className="w-full h-full object-cover" />
                        ) : (
                            <img src="/placeholders/kuba-placeholder.png" alt={provider.business_name} className="w-full h-full object-cover opacity-50" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {provider.business_name}
                            </h2>
                            {provider.is_verified && (
                                <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 border border-green-200 dark:border-green-500/30 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Verified Pro
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Local Area</span>
                            <span className="flex items-center gap-1.5 text-yellow-500"><Star className="w-4 h-4 fill-yellow-500" /> 4.9 (120+ reviews)</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Usually responds in 1 hr</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 md:mt-0 flex gap-4">
                        <Button 
                          size="lg" 
                          onClick={() => handleBooking()}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 md:flex-none"
                        >
                            <CalendarCheck className="w-4 h-4 mr-2" /> Request Booking
                        </Button>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the Professional</h2>
                            <div className="prose dark:prose-invert prose-blue max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p>{provider.bio || "This professional has not provided a bio yet. They are verified and ready to handle your home service needs."}</p>
                            </div>
                        </motion.section>

                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Services Offered</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {provider.services?.map((ps) => (
                                    <Card 
                                      key={ps.id} 
                                      onClick={() => handleBooking(ps)}
                                      className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-white/20 transition-all group rounded-xl cursor-pointer"
                                    >
                                        <CardContent className="p-5 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mt-1 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ps.name}</h4>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]"><Clock className="w-3 h-3 inline mr-1" />{ps.pricing_type}</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">${ps.base_price}</span>
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
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-white/10 rounded-2xl sticky top-24">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Business Details</h3>
                                
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Background Checked</p>
                                            <p className="text-xs text-gray-500">Identity and history verified</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Star className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Top Rated</p>
                                            <p className="text-xs text-gray-500">Maintains a 4.5+ average rating</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Flexible Hours</p>
                                            <p className="text-xs text-gray-500">Available evenings and weekends</p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Have questions before booking?</p>
                                    <Button asChild variant="outline" className="w-full border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                                        <Link href="/contact">Contact Support</Link>
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
