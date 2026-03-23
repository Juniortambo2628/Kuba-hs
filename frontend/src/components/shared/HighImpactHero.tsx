"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useCMS } from "@/hooks/useCMS";
import { designSystem } from "@/lib/design-system";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HighImpactHeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  bgImage?: string;
  cmsKey?: string;
  cmsGroup?: string;
  breadcrumbs?: Breadcrumb[];
  fullScreen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function HighImpactHero({
  title,
  subtitle,
  badge,
  bgImage: propBgImage,
  cmsKey,
  cmsGroup = 'hero_text',
  breadcrumbs,
  fullScreen = false,
  children,
  className = ""
}: HighImpactHeroProps) {
  const { getS, getImg } = useCMS();

  // Resolution order: Prop > CMS > Radial Gradient Fallback
  // If we are using the default hero_text group, images should come from hero_backgrounds
  const imgGroup = cmsGroup === 'hero_text' ? 'hero_backgrounds' : cmsGroup;
  
  const heroBackground = propBgImage || (cmsKey ? getImg(imgGroup, `${cmsKey}_hero_image`, "") : "");
  const displayTitle = title || (cmsKey ? getS(cmsGroup, `${cmsKey}_hero_title`, "") : "");
  const displaySubtitle = subtitle || (cmsKey ? getS(cmsGroup, `${cmsKey}_hero_subtitle`, "") : "");
  const displayBadge = badge || (cmsKey ? getS(cmsGroup, `${cmsKey}_hero_badge`, "") : "");

  return (
    <section className={`relative overflow-hidden flex items-center text-center ${fullScreen ? 'min-h-screen pt-20' : 'pt-32 pb-20 md:pb-32'} ${className}`}>
      {/* Background with Theme-aware Overlay & Fallback Gradient */}
      {heroBackground ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={heroBackground} 
            className="w-full h-full object-cover transition-opacity duration-700" 
            alt="Hero Background" 
          />
          {/* Theme-aware Overlay */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/75 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent z-[1]" />
        </div>
      ) : (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 dark:from-indigo-500/20 via-transparent to-transparent -z-10" />
      )}

      <div className={designSystem.layouts.container + " relative z-10 flex flex-col items-center justify-center mx-auto"}>
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {displayBadge && (
              <span className="inline-block px-5 py-2 mb-8 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md">
                {displayBadge.charAt(0).toUpperCase() + displayBadge.slice(1).toLowerCase()}
              </span>
            )}
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] text-gray-900 dark:text-white drop-shadow-sm">
              {displayTitle}
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-muted-foreground mb-4 leading-relaxed font-medium">
              {displaySubtitle}
            </p>

            {/* Content below subtitle is only rendered if explicitly provided and not on standardized portal pages which strictly end at subtitle */}
            {children && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-12 w-full">
                {children}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
