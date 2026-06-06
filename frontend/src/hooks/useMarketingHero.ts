"use client";

import { useCMS } from "@/contexts/CMSContext";
import { buildMarketingHeroProps, type MarketingPageId } from "@/config/marketing-pages";
import type { HighImpactHeroProps } from "@/components/shared/HighImpactHero";

/** Resolves CMS-backed hero props for a public marketing page from SSOT config. */
export function useMarketingHero(pageId: MarketingPageId): HighImpactHeroProps {
  const { getS, getImg } = useCMS();
  return buildMarketingHeroProps(pageId, getS, getImg);
}
