"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCMS } from "@/contexts/CMSContext";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

export function LandingAboutStory() {
  const { getS, getImg } = useCMS();

  const badge = getS("about_page", "about_badge", "Our Story");
  const headline = getS(
    "about_page",
    "about_headline",
    "Redefining Home Services Excellence"
  );
  const { part1: titlePart1, part2: titlePart2 } = landingTitleParts(
    headline,
    "Excellence"
  );

  const tagline = getS(
    "about_page",
    "about_tagline",
    "Born from a simple frustration: finding quality home help shouldn't be this hard."
  );

  const paragraph1 = getS(
    "about_page",
    "about_paragraph_1",
    "KUBA was founded with a mission to connect homeowners with the best local service professionals. We believe everyone deserves access to reliable, transparent, and affordable home services."
  );

  const paragraph2 = getS(
    "about_page",
    "about_paragraph_2",
    "Our platform rigorously vets every professional, provides upfront pricing, and ensures secure payments — so you can focus on what matters most while we handle the rest."
  );

  const statProviders = getS("about_page", "about_stat_providers", "5k+");
  const statSatisfaction = getS("about_page", "about_stat_satisfaction", "98%");

  return (
    <LandingSection variant="muted" className="bg-muted/50 dark:bg-muted/30">
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
          <LandingSectionHeader
            badge={badge}
            title={<LandingGradientTitle part1={titlePart1} part2={titlePart2} />}
            align="left"
            className="mb-0"
          />
          <p className="text-blue-600 dark:text-blue-400 text-lg italic mb-8 border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-2">
            {tagline}
          </p>
          <div className="space-y-6 text-gray-600 dark:text-muted-foreground leading-relaxed mb-10 text-lg">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 py-8 border-y border-border dark:border-white/10">
            <div>
              <h4 className="text-4xl font-semibold text-gray-900 dark:text-white mb-1">
                {statProviders}
              </h4>
              <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                Active Providers
              </p>
            </div>
            <div>
              <h4 className="text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {statSatisfaction}
              </h4>
              <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </LandingSection>
  );
}
