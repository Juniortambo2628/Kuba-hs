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
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"service" | "location">("service");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const bgImage = getImg('hero_media', 'hero_bg_image', "https://images.unsplash.com/photo-1600585154340-be6199f7a099?q=80&w=2070&auto=format&fit=crop");

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={bgImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Theme-aware Overlay - darker in light mode now */}
        <div className="absolute inset-0 bg-black/75 dark:bg-black/85 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-black/80 via-transparent to-black/20 dark:to-transparent z-[1]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto text-center max-w-5xl space-y-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-tight text-white bg-white/10 border border-white/20 rounded-full"
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Trusted professionals
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight text-white"
          dangerouslySetInnerHTML={{ __html: getS('home_hero', 'hero_title', 'Expert Services for your <br /> Home, <span class="text-white drop-shadow-lg">Simply Delivered</span>') }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl text-white/90 mb-10 leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: getS('home_hero', 'hero_subtitle', 'Find help for cleaning, repairs, and more. <br class="hidden md:block" /> Good work guaranteed every time.') }}
        />
        
        {/* Removed redundant overlay div */}

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
              className="flex-1 flex items-center gap-4 p-6 border-r border-white/10 text-left cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors text-white">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/70 tracking-tight">What do you need?</p>
                <p className="text-sm font-bold text-white">e.g. Fixing a light</p>
              </div>
            </div>

            {/* Where */}
            <div 
              onClick={() => { setSearchMode("location"); setIsSearchOpen(true); }}
              className="flex-1 flex items-center gap-4 p-6 text-left cursor-pointer hover:bg-white/10 transition-colors group/where"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover/where:bg-blue-500 group-hover/where:text-white transition-colors text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/70 tracking-tight">Where?</p>
                <p className="text-sm font-bold text-white">Search Location</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={() => { setSearchMode("service"); setIsSearchOpen(true); }}
              className="h-16 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm tracking-wide gap-2 group-hover:scale-[1.02] transition-transform"
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
        <Sparkles className="w-12 h-12 text-blue-400" />
      </div>

      <HeroSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        initialTab={searchMode}
      />
    </section>
  );
}
