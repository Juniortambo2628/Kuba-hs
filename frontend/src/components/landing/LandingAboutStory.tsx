"use client";

import { useCMS } from "@/contexts/CMSContext";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { AboutStoryContent } from "@/components/shared/AboutStoryContent";

export function LandingAboutStory() {
  const { getS } = useCMS();

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

  return (
    <LandingSection variant="muted" className="bg-muted/50 dark:bg-muted/30">
      <AboutStoryContent
        renderTitle={() => (
          <LandingSectionHeader
            badge={badge}
            title={<LandingGradientTitle part1={titlePart1} part2={titlePart2} />}
            align="left"
            className="mb-0"
          />
        )}
      />
    </LandingSection>
  );
}
