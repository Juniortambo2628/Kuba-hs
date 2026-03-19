"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, Sparkles, Wrench, 
  User, Heart, ArrowRight 
} from "lucide-react";
import { useCMS } from "@/hooks/useCMS";
import { designSystem } from "@/lib/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSearchModal } from "./HeroSearchModal";

export function Hero() {
  const { getS, isLoading: cmsLoading } = useCMS();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"service" | "location">("service");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1600585154340-be6199f7a099?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto text-center max-w-5xl space-y-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={designSystem.typography.hero.badge}
        >
          <Sparkles className="w-3.5 h-3.5 inline mr-2" />
          VERIFIED EXCELLENCE
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={designSystem.typography.hero.title}
        >
          Expert Services for your <br />
          Home, <span className="text-cyan-400">Simply Delivered</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={designSystem.typography.hero.subtitle}
        >
          Find trusted professionals for cleaning, repair, and more. <br className="hidden md:block" />
          Quality guaranteed on every project.
        </motion.p>

        {/* Quick Access Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { label: "Cleaning", icon: Sparkles, active: true },
            { label: "Repair", icon: Wrench },
            { label: "Personal", icon: User },
            { label: "Wellness", icon: Heart },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 ${
                item.active 
                  ? "bg-[#0096FF] border-transparent text-white shadow-xl shadow-blue-500/20" 
                  : "bg-white/5 backdrop-blur-md border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <item.icon className={`w-4 h-4 ${item.active ? "text-white" : "text-white/40"}`} />
              <span className="text-[10px] font-semibold tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Glassmorphism Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8"
        >
          <div 
             className="max-w-4xl mx-auto flex flex-col md:flex-row items-center p-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl transition-all group"
          >
            {/* What Service */}
            <div 
              onClick={() => { setSearchMode("service"); setIsSearchOpen(true); }}
              className="flex-1 flex items-center gap-4 p-6 border-r border-white/10 text-left cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">What Service?</p>
                <p className="text-sm font-bold text-white/60">e.g. Electrical Repair</p>
              </div>
            </div>

            {/* Where */}
            <div 
              onClick={() => { setSearchMode("location"); setIsSearchOpen(true); }}
              className="flex-1 flex items-center gap-4 p-6 text-left cursor-pointer hover:bg-white/5 transition-colors group/where"
            >
              <div className="p-3 bg-white/10 rounded-2xl group-hover/where:bg-indigo-400 group-hover/where:text-black transition-colors">
                <MapPin className="w-5 h-5 text-white/60 group-hover/where:text-inherit" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Where?</p>
                <p className="text-sm font-bold text-white/60">Search Location</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={() => { setSearchMode("service"); setIsSearchOpen(true); }}
              className="h-16 px-12 rounded-[2rem] bg-[#0096FF] hover:bg-[#0085E6] text-white font-bold text-sm tracking-wide gap-2 group-hover:scale-[1.02] transition-transform"
            >
              Get Started
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Sparkle Decoration */}
      <div className="absolute top-[30%] right-[10%] opacity-20 animate-pulse pointer-events-none">
        <Sparkles className="w-12 h-12 text-cyan-400" />
      </div>

      <HeroSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        initialTab={searchMode}
      />
    </section>
  );
}
