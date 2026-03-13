"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, MapPin, Grid, ArrowRight, 
  Sparkles, ShieldCheck, Star, Users, 
  CheckCircle2, Zap, Palette, Wrench
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useCMS } from "@/hooks/useCMS";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
}

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export function Hero() {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("Cleaning");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const tabs = [
    { id: "Cleaning", icon: <Palette className="w-4 h-4" /> },
    { id: "Repair", icon: <Wrench className="w-4 h-4" /> },
    { id: "Personal", icon: <Users className="w-4 h-4" /> },
    { id: "Wellness", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Full Viewport */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImg('hero', 'hero_bg', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')}
          alt={getS('hero', 'hero_title', 'Modern Home Interior')}
          className="w-full h-full object-cover"
        />
        {/* Modern dark gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[1]" />
        <div className="absolute inset-0 bg-black/20 z-[1]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Verified Excellence
          </span>
        </motion.div>

        {/* Main Headlines */}
        <div className="space-y-6 max-w-5xl mx-auto mb-16">
          <motion.h1
            className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9] uppercase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {cmsLoading || !mounted ? (
              <div className="space-y-2">
                <Skeleton className="h-16 md:h-20 w-3/4 bg-white/10 rounded-2xl mx-auto" />
                <Skeleton className="h-16 md:h-20 w-1/2 bg-white/10 rounded-2xl mx-auto" />
              </div>
            ) : (
              <>
                {getS('hero', 'hero_title', 'Professional Home Services, Simply Delivered').split(',')[0]}, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                  {getS('hero', 'hero_title', 'Professional Home Services, Simply Delivered').split(',')[1] || 'Simply Delivered'}
                </span>
              </>
            )}
          </motion.h1>

          <motion.div
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {cmsLoading || !mounted ? (
              <Skeleton className="h-6 w-full bg-white/10 rounded-lg mt-4" />
            ) : (
              getS('hero', 'hero_subtitle', 'Connect with verified experts for residential, commercial, and large-scale projects. Quality, reliability, and trust in every booking.')
            )}
          </motion.div>
        </div>

        {/* Floating Category Chips */}
        {mounted && (
          <motion.div 
             className="flex flex-wrap justify-center gap-3 mb-8"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
          >
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-sky-600 text-white shadow-xl shadow-sky-500/20" : "bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white border border-white/10"}`}
                >
                  {tab.icon}
                  {tab.id}
                </button>
             ))}
          </motion.div>
        )}

        {/* Glassmorphic Search Container */}
        <motion.div
          className="w-full max-w-5xl bg-white/10 backdrop-blur-[24px] rounded-[40px] p-3 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <form className="flex flex-col lg:flex-row items-center gap-2" action="/providers">
            
            {/* Search Input */}
            <div className="flex-[1.5] w-full group">
              <div className="flex items-center bg-white/5 group-hover:bg-white/10 rounded-[32px] px-6 h-20 border border-white/5 focus-within:border-white/20 transition-all">
                <Search className="text-sky-400 w-6 h-6 mr-4" />
                <div className="flex flex-col items-start w-full">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40">What service?</label>
                   <Input 
                    name="search"
                    placeholder="e.g. Electrical Repair"
                    className="bg-transparent border-none text-white placeholder:text-white/30 focus-visible:ring-0 px-0 h-8 font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-[1px] h-12 bg-white/10" />

            {/* Location Input */}
            <div className="flex-1 w-full group">
              <div className="flex items-center bg-white/5 group-hover:bg-white/10 rounded-[32px] px-6 h-20 border border-white/5 focus-within:border-white/20 transition-all">
                <MapPin className="text-sky-400 w-6 h-6 mr-4" />
                <div className="flex flex-col items-start w-full">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Where?</label>
                   <Input 
                    placeholder="Search Location"
                    className="bg-transparent border-none text-white placeholder:text-white/30 focus-visible:ring-0 px-0 h-8 font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full lg:w-auto bg-sky-600 hover:bg-sky-500 text-white rounded-[32px] h-20 px-12 font-black text-lg shadow-xl shadow-sky-500/30 border-0 flex items-center justify-center group transition-all duration-300 active:scale-95">
              {getS('hero', 'hero_button_text', 'SEARCH')}
              <div className="ml-3 p-2 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                 <ArrowRight className="w-5 h-5" />
              </div>
            </Button>
          </form>
        </motion.div>



      </div>

      {/* Seasonal Overlay/Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
