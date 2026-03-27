"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, Sparkles, Wrench, 
  User, Heart, ArrowRight 
} from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSearchModal } from "./HeroSearchModal";
import { getMediaUrl } from "@/lib/utils";

interface HeroProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    bgImage?: string;
  } | null;
}

export function Hero({ initialData }: HeroProps) {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"service" | "location">("service");

  // Determine final values: priority to CMS context if hydrated, otherwise initialData from server
  const title = !cmsLoading ? getS('home_hero', 'hero_title', initialData?.title || 'Expert Services for your <br /> Home, <span class="text-white drop-shadow-lg">Simply Delivered</span>') : initialData?.title || 'Expert Services';
  const subtitle = !cmsLoading ? getS('home_hero', 'hero_subtitle', initialData?.subtitle || 'Find help for cleaning, repairs, and more. Good work guaranteed हर time.') : initialData?.subtitle || 'Find help for your home.';
  const bgImage = !cmsLoading ? getImg('hero_backgrounds', 'hero_bg_image', initialData?.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070") : getMediaUrl(initialData?.bgImage) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image - Persistent Container (No hydration hide) */}
      <div className="absolute inset-0 z-0 bg-zinc-900">
        <motion.div
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            sizes="100vw"
            priority
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" // Dark blue/grey placeholder
            className="object-cover transition-opacity duration-300"
          />
        </motion.div>
        {/* Theme-aware Overlay */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/85 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-[1]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto text-center max-w-5xl space-y-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-tight text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 inline mr-2 text-blue-400" />
          Trusted professionals verified by Kuba
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${designSystem.typography.hero.title} text-white`}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${designSystem.typography.hero.subtitle} text-white/90`}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        
        {/* Glassmorphism Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8"
        >
          <div 
             className="max-w-4xl mx-auto flex flex-col md:flex-row items-center p-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl transition-all group"
          >
            {/* What Service */}
            <div 
              onClick={() => { setSearchMode("service"); setIsSearchOpen(true); }}
              className="flex-1 flex items-center gap-4 p-6 border-r border-white/10 text-left cursor-pointer hover:bg-white/10 transition-colors rounded-l-[2rem]"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors text-white">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/70 tracking-tight">What do you need?</p>
                <p className="text-sm font-bold text-white uppercase tracking-tighter">Connect with pros</p>
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
                <p className="text-sm font-bold text-white uppercase tracking-tighter">Near You</p>
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

      <HeroSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        initialTab={searchMode}
      />
    </section>
  );
}
