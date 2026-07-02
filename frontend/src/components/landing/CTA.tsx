"use client";

import { motion } from "framer-motion";
import { LandingButton } from "@/components/shared/LandingButton";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { uiPrimitives } from "@/lib/ui-primitives";
import Image from "next/image";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

export function CTA() {
  const { getS } = useCMS();

  const ctaTitle = getS(
    "cta",
    "cta_title",
    getS("home_hero", "cta_title", "Ready to find a professional?")
  );
  const { part1: ctaTitle1, part2: ctaTitle2 } = landingTitleParts(ctaTitle, "professional?");

  return (
    <LandingSection variant="default" className="relative transition-colors duration-300">
      <div className={uiPrimitives.layout.page + " w-full"}>
        <motion.div
          className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 dark:bg-[#0f1523] border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {/* Aesthetic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10 z-0" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] z-0 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] z-0 translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
            
            {/* Left Content Area */}
            <div className="p-10 md:p-16 lg:p-24 flex flex-col justify-center text-left">
              <LandingSectionHeader
                badge={getS("cta", "cta_badge", "Get Started Today")}
                title={<LandingGradientTitle part1={ctaTitle1} part2={ctaTitle2} />}
                subtitle={getS(
                  "cta",
                  "cta_description",
                  getS(
                    "home_hero",
                    "cta_description",
                    "Join thousands of happy customers who have already found reliable help through KUBA."
                  )
                )}
                align="left"
                className="!mb-8 text-left [&_h2]:text-left [&_p]:mx-0"
              />

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                  <LandingButton asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/services">
                        {getS("cta", "cta_primary_label", "Browse Services")}
                      </Link>
                  </LandingButton>
                  <LandingButton asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Link href="/register?role=provider">
                        {getS("cta", "cta_secondary_label", "Join as a Pro")}
                      </Link>
                  </LandingButton>
              </div>
            </div>

            {/* Right Rich Media Collage */}
            <div className="max-lg:hidden relative h-full w-full min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50 dark:to-[#0f1523] z-10 w-24" />
                <Image
                    src={FALLBACK_IMAGES.cleaning}
                    alt="Professionals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-left rounded-r-[3rem]"
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                {/* Floating Stats */}
                <motion.div 
                    className="absolute top-1/4 -left-12 bg-background p-6 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 z-20"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center font-black text-2xl">
                            ✓
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{getS('site_stats', 'stat_4_value', '10k+')}</p>
                            <p className="text-sm font-bold tracking-tight text-gray-500 dark:text-gray-400">{getS('site_stats', 'stat_4_label', 'Jobs Done')}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="absolute bottom-1/4 right-12 bg-background p-6 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 z-20"
                    initial={{ y: 0 }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center font-black text-2xl">
                            ★
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{getS('about_page', 'about_stat_satisfaction', '4.9')}</p>
                            <p className="text-sm font-bold tracking-tight text-gray-500 dark:text-gray-400">{getS('site_stats', 'stat_3_label', 'Avg Rating')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </LandingSection>
  );
}
