"use client";

import { motion } from "framer-motion";
import { Users, MapPin, Clock, Heart } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingSection } from "@/components/landing/LandingSection";
import { uiPrimitives } from "@/lib/ui-primitives";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { cn } from "@/lib/utils";

export function Stats() {
  const { getS } = useCMS();

  const statsTitle = getS("site_stats", "stats_title", "Why Thousands Trust KUBA");
  const { part1: statsTitle1, part2: statsTitle2 } = landingTitleParts(statsTitle, "KUBA");

  const stats = [
    {
      id: 1,
      name: getS("site_stats", "stat_1_label", "Verified Providers"),
      value: getS("site_stats", "stat_1_value", "500+"),
      icon: Users,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      id: 2,
      name: getS("site_stats", "stat_2_label", "Cities Covered"),
      value: getS("site_stats", "stat_2_value", "10+"),
      icon: MapPin,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      id: 3,
      name: getS("site_stats", "stat_3_label", "Support Available"),
      value: getS("site_stats", "stat_3_value", "24/7"),
      icon: Clock,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      id: 4,
      name: getS("site_stats", "stat_4_label", "Happy Customers"),
      value: getS("site_stats", "stat_4_value", "10k+"),
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <LandingSection variant="default">
      <LandingSectionHeader
        badge={getS("site_stats", "stats_badge", "Trust & Scale")}
        title={<LandingGradientTitle part1={statsTitle1} part2={statsTitle2} />}
        subtitle={getS(
          "site_stats",
          "stats_subtitle",
          "We are building the largest network of trusted home service providers."
        )}
        align="center"
      />

      <dl className={cn(uiPrimitives.layout.grid3, "lg:max-w-5xl lg:mx-auto")}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            className="flex flex-col items-center text-center rounded-2xl border border-border/40 bg-card p-6 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                stat.bg,
                stat.color
              )}
            >
              <stat.icon className="w-7 h-7" />
            </div>
            <dd className="text-3xl font-bold tracking-tight text-foreground mb-1">{stat.value}</dd>
            <dt className="text-sm font-medium text-muted-foreground">{stat.name}</dt>
          </motion.div>
        ))}
      </dl>
    </LandingSection>
  );
}
