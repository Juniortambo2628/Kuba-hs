"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { designSystem } from "@/lib/design-system";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { AboutStoryContent } from "@/components/shared/AboutStoryContent";
import { Shield } from "lucide-react";

export default function AboutPage() {
  const { features: values } = usePageFeatures("about");
  const hero = useMarketingHero("about");

  return (
    <MarketingPage hero={hero}>
      <MarketingSection>
        <AboutStoryContent
          renderTitle={(headline) => (
            <>
              <span className={designSystem.typography.section.badge}>Our Story</span>
              <h2 className={designSystem.typography.section.title}>{headline}</h2>
            </>
          )}
        />
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
