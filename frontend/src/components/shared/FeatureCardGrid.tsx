"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import { MarketplaceCardMediaFallback } from "@/components/marketplace/MarketplaceCardMediaFallback";

interface Feature {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  image_url?: string | null;
  metadata?: {
    bg?: string;
    color?: string;
    features?: string[];
    [key: string]: any;
  };
}

interface FeatureCardGridProps {
  features: Feature[];
  /** Number of grid columns on large screens */
  columns?: 2 | 3 | 4;
  /** Accent color class prefix, e.g. "blue", "indigo", "primary" */
  accentColor?: string;
  /** Fallback Lucide icon component if feature.icon is not mapped */
  fallbackIcon?: LucideIcon;
  /** Show metadata.features checklist inside cards */
  showChecklist?: boolean;
  /** Card variant: "centered" for About-style, "left" for Commercial/Cooperatives-style */
  variant?: "centered" | "left";
}

const colsMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export function FeatureCardGrid({
  features,
  columns = 3,
  accentColor = "primary",
  fallbackIcon: _fallbackIcon,
  showChecklist = false,
  variant = "left",
}: FeatureCardGridProps) {
  return (
    <div className={`grid ${colsMap[columns]} gap-10`}>
      {features.map((feature, i) => {
        const featuresList = feature.metadata?.features || [];
        const imageSrc = feature.image_url ? getMediaUrl(feature.image_url, "service") : null;

        return (
          <motion.div
            key={feature.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`group ${
              variant === "centered"
                ? "bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-lg dark:shadow-none border border-border dark:border-white/10 text-center hover:-translate-y-2 transition-transform duration-300"
                : `p-8 bg-white dark:bg-black border border-border/40 rounded-[2.5rem] space-y-6 hover:shadow-2xl hover:shadow-${accentColor}-500/5 transition-all duration-500`
            }`}
          >
            {imageSrc ? (
              <div
                className={
                  variant === "centered"
                    ? "relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 mx-auto max-w-sm"
                    : "relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4"
                }
              >
                <Image src={imageSrc} alt={feature.title} fill className="object-cover" sizes="400px" />
              </div>
            ) : (
              <div
                className={
                  variant === "centered"
                    ? "relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 mx-auto max-w-sm"
                    : "relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4"
                }
              >
                <MarketplaceCardMediaFallback />
              </div>
            )}

            <div className={variant === "centered" ? "" : "space-y-2"}>
              <h3
                className={`font-bold tracking-tight ${
                  variant === "centered"
                    ? "text-xl text-gray-900 dark:text-white mb-4"
                    : "text-xl"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-muted-foreground leading-relaxed ${
                  variant === "centered" ? "text-sm" : "text-sm font-medium italic"
                }`}
              >
                {feature.description || feature.subtitle}
              </p>
            </div>

            {showChecklist && featuresList.length > 0 && (
              <ul className="space-y-3 pt-4 border-t border-border/10">
                {featuresList.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-3 text-xs font-bold tracking-tight">
                    <CheckCircle2 className={`w-4 h-4 text-${accentColor}-600 opacity-40`} />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
