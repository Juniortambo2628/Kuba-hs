"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Provider } from "@/types";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingButton } from "@/components/shared/LandingButton";
import { LandingSection } from "@/components/landing/LandingSection";
import { ProviderCard } from "@/components/marketplace";
import { uiPrimitives } from "@/lib/ui-primitives";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { providerHref } from "@/lib/provider-urls";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { useLandingFetch } from "@/hooks/useLandingFetch";
import { LandingSectionFooter } from "@/components/shared/LandingSectionFooter";

const PREVIEW_LIMIT = 3;

export function FeaturedProviders() {
  const { getS } = useCMS();
  const { data: allProviders, isLoading } = useLandingFetch<Provider>("/api/search");
  const providers = allProviders
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, PREVIEW_LIMIT);

  const providersTitle = getS(
    "landing_sections",
    "providers_title",
    "Featured Professionals"
  );
  const { part1: provTitle1, part2: provTitle2 } = landingTitleParts(
    providersTitle,
    "Professionals"
  );

  return (
    <FavoritesProvider>
    <LandingSection variant="muted">
        <LandingSectionHeader
          badge={getS("landing_sections", "providers_badge", "Top Rated Pros")}
          title={<LandingGradientTitle part1={provTitle1} part2={provTitle2} />}
          subtitle={getS(
            "landing_sections",
            "providers_subtitle",
            "Book trusted, verified and highly-rated professionals for your home service needs."
          )}
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className={uiPrimitives.layout.grid3}>
            {isLoading
              ? Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full min-h-[16rem] rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    href={providerHref(provider)}
                    className="h-full"
                  />
                ))}
          </div>
        </motion.div>

        <LandingSectionFooter href="/providers" label="View all professionals" />
    </LandingSection>
    </FavoritesProvider>
  );
}
