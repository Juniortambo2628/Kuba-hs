"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";

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
  actions?: React.ReactNode;
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
  actions,
  fullScreen = false,
  children,
  className = ""
}: HighImpactHeroProps) {
  const { getS, getImg } = useCMS();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {(mounted && heroBackground) ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full h-full relative"
          >
            <Image 
              src={heroBackground} 
              alt="Hero Background" 
              fill
              priority
              className="object-cover transition-opacity duration-700" 
            />
          </motion.div>
          {/* Theme-aware Overlay */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/75 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent z-[1]" />
        </div>
      ) : (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 dark:from-blue-500/20 via-transparent to-transparent -z-10" />
      )}

      <div className={designSystem.layouts.container + " relative z-10 flex flex-col items-center justify-center mx-auto"}>
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i === 0 && <Home className="w-3 h-3" />}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-primary transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 dark:text-white">{crumb.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 opacity-30" />}
                  </div>
                ))}
              </nav>
            )}

            <div className="flex flex-col items-center gap-6 mb-8 relative w-full">
                {displayBadge && (
                <span className={designSystem.typography.hero.badge}>
                    {displayBadge.charAt(0).toUpperCase() + displayBadge.slice(1).toLowerCase()}
                </span>
                )}

                {actions && (
                    <div className="absolute right-0 top-0 hidden md:block">
                        {actions}
                    </div>
                )}
            </div>
            
            <h1 className={`${designSystem.typography.hero.title} text-gray-900 dark:text-white mb-8`}>
              {displayTitle}
            </h1>
            
            <p className={`${designSystem.typography.hero.subtitle} text-gray-600 dark:text-muted-foreground mb-4`}>
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
