"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { type MarketingPageId } from "@/config/marketing-pages";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { CTABanner } from "@/components/shared/CTABanner";
import Image from "next/image";

export interface VerticalValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface VerticalSalesPageProps {
  /** CMS page id, used for both the hero and the category features. */
  pageId: MarketingPageId;
  /** Drives the value-prop icon colour, the category grid accent and the CTA background. */
  accent: "primary" | "indigo";
  valueProps: VerticalValueProp[];
  fallbackIcon: LucideIcon;
  thesis: {
    title: string;
    body: string;
    image: {
      src: string;
      alt: string;
      badge: string;
      badgeClassName: string;
      heading: string;
    };
  };
  categories: { title: string; subtitle: string };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonHref: string;
    footerText: string;
  };
}

const ACCENTS = {
  primary: { iconText: "text-primary", grid: "primary", cta: "bg-primary" },
  indigo: { iconText: "text-indigo-600", grid: "indigo", cta: "bg-indigo-600" },
} as const;

/** Sales landing page shared by every vertical (commercial, cooperatives, ...): thesis + categories + CTA. */
export function VerticalSalesPage({
  pageId,
  accent,
  valueProps,
  fallbackIcon,
  thesis,
  categories,
  cta,
}: VerticalSalesPageProps) {
  const { features } = usePageFeatures(pageId);
  const hero = useMarketingHero(pageId);
  const colors = ACCENTS[accent];

  return (
    <MarketingPage hero={hero}>
      <MarketingSection>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">{thesis.title}</h2>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium text-lg">
                {thesis.body}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {valueProps.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40"
                >
                  <item.icon className={`w-5 h-5 ${colors.iconText} shrink-0`} />
                  <div>
                    <h4 className="font-bold text-sm tracking-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted shadow-2xl relative">
              <Image
                src={thesis.image.src}
                fill
                className="object-cover"
                alt={thesis.image.alt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                <div className="text-white space-y-2">
                  <span
                    className={`text-[10px] font-bold tracking-widest capitalize ${thesis.image.badgeClassName}`}
                  >
                    {thesis.image.badge}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight">{thesis.image.heading}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </MarketingSection>

      <MarketingSection className="bg-slate-50 dark:bg-zinc-950/40">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{categories.title}</h2>
          <p className="text-muted-foreground font-medium">{categories.subtitle}</p>
        </div>

        <FeatureCardGrid
          features={features}
          columns={3}
          accentColor={colors.grid}
          fallbackIcon={fallbackIcon}
          showChecklist={true}
        />
      </MarketingSection>

      <CTABanner
        title={cta.title}
        subtitle={cta.subtitle}
        buttonText={cta.buttonText}
        buttonHref={cta.buttonHref}
        footerText={cta.footerText}
        bgColor={colors.cta}
      />
    </MarketingPage>
  );
}
