"use client";

import { ReactNode } from "react";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { HighImpactHero, type HighImpactHeroProps } from "@/components/shared/HighImpactHero";
import { PageContainer } from "@/components/shared/ui/PageContainer";
import { cn } from "@/lib/utils";

interface MarketingPageProps {
  children: ReactNode;
  hero?: HighImpactHeroProps;
  shellClassName?: string;
  /** Skip hero when page renders its own */
  showHero?: boolean;
  /** When false, children are not wrapped in the marketing page container (full-bleed listing band). */
  contained?: boolean;
}

/**
 * Public marketing page template: shell + optional CMS hero + container sections.
 * Keeps hero CMS keys and layout in one pattern.
 */
export function MarketingPage({
  children,
  hero,
  shellClassName = "min-h-screen",
  showHero = true,
  contained = true,
}: MarketingPageProps) {
  return (
    <MarketingShell className={shellClassName}>
      {showHero && hero && <HighImpactHero {...hero} />}
      {contained ? (
        <PageContainer className="pb-24">{children}</PageContainer>
      ) : (
        <div className="pb-24">{children}</div>
      )}
    </MarketingShell>
  );
}
