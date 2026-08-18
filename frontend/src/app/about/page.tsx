"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCMS } from "@/contexts/CMSContext";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { Shield } from "lucide-react";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

export default function AboutPage() {
  const { getS, getImg } = useCMS();
  const { features: values } = usePageFeatures("about");
  const hero = useMarketingHero("about");

  return (
    <MarketingPage hero={hero}>
      <MarketingSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="flex gap-4 h-[600px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex-[3] relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={getImg(
                  "about_page",
                  "about_story_image_1",
                  FALLBACK_IMAGES.cleaning
                )}
                alt="Professional at work"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex-[2] flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src={getImg(
                    "about_page",
                    "about_story_image_2",
                    FALLBACK_IMAGES.team
                  )}
                  alt="Team collaboration"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src={getImg(
                    "about_page",
                    "about_story_image_3",
                    FALLBACK_IMAGES.support
                  )}
                  alt="Customer service"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={designSystem.typography.section.badge}>Our Story</span>
            <h2 className={designSystem.typography.section.title}>
              {getS("about_page", "about_headline", "Redefining Home Services Excellence")}
            </h2>
            <p className="text-blue-600 dark:text-blue-400 text-lg italic mb-8 border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-2">
              {getS(
                "about_page",
                "about_tagline",
                "Born from a simple frustration: finding quality home help shouldn't be this hard."
              )}
            </p>
            <div className="space-y-6 text-gray-600 dark:text-muted-foreground leading-relaxed mb-10 text-lg">
              <p>
                {getS(
                  "about_page",
                  "about_paragraph_1",
                  "KUBA was founded with a mission to connect homeowners with the best local service professionals. We believe everyone deserves access to reliable, transparent, and affordable home services."
                )}
              </p>
              <p>
                {getS(
                  "about_page",
                  "about_paragraph_2",
                  "Our platform rigorously vets every professional, provides upfront pricing, and ensures secure payments — so you can focus on what matters most while we handle the rest."
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </MarketingSection>

      <MarketingSection className="bg-muted dark:bg-zinc-900/50 transition-colors duration-300">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className={designSystem.typography.section.badge}>Our Values</span>
          <h2 className={designSystem.typography.section.title}>The Principles That Drive Us</h2>
        </motion.div>
        <FeatureCardGrid
          features={values}
          columns={3}
          accentColor="blue"
          fallbackIcon={Shield}
          variant="centered"
        />
      </MarketingSection>

      <MarketingSection>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={designSystem.typography.section.title}>Ready to get started?</h2>
          <p className={designSystem.typography.section.subtitle}>
            Whether you need a quick repair or a full renovation, KUBA connects you with trusted local
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-full"
            >
              <Link href="/services">Browse Services</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold h-14 px-8 rounded-full"
            >
              <Link href="/providers">Find Professionals</Link>
            </Button>
          </div>
        </motion.div>
      </MarketingSection>
    </MarketingPage>
  );
}
