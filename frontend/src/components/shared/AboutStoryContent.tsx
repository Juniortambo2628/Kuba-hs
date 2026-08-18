"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCMS } from "@/contexts/CMSContext";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

interface AboutStoryContentProps {
  renderTitle: (headline: string) => React.ReactNode;
}

export function AboutStoryContent({ renderTitle }: AboutStoryContentProps) {
  const { getS, getImg } = useCMS();

  const headline = getS(
    "about_page",
    "about_headline",
    "Redefining Home Services Excellence"
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

  return (
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
            src={getImg("about_page", "about_story_image_1", FALLBACK_IMAGES.cleaning)}
            alt="Professional at work"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="flex-[2] flex flex-col gap-4">
          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
            <Image
              src={getImg("about_page", "about_story_image_2", FALLBACK_IMAGES.team)}
              alt="Team collaboration"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
            <Image
              src={getImg("about_page", "about_story_image_3", FALLBACK_IMAGES.support)}
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
        {renderTitle(headline)}
        <p className="text-blue-600 dark:text-blue-400 text-lg italic mb-8 border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-2">
          {tagline}
        </p>
        <div className="space-y-6 text-gray-600 dark:text-muted-foreground leading-relaxed text-lg">
          <p>{paragraph1}</p>
          <p>{paragraph2}</p>
        </div>
      </motion.div>
    </div>
  );
}
