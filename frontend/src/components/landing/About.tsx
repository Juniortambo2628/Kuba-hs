"use client";

import Link from "next/link";
import { Search, CalendarCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingButton } from "@/components/shared/LandingButton";
import { LandingGradientTitle, landingTitleParts } from "@/lib/landing-section-header-copy";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = [Search, CalendarCheck, ShieldCheck];

function stepDesc(
  getS: (g: string, k: string, f?: string) => string,
  n: 1 | 2 | 3,
  fallback: string
) {
  return getS(
    "about_page",
    `step_${n}_desc`,
    getS("about_page", `step_${n}_description`, fallback)
  );
}

export function About() {
  const { getS } = useCMS();

  const badge = getS("about_page", "how_eyebrow", getS("about_page", "about_badge", "How it works"));
  const howHeadline = getS(
    "about_page",
    "how_headline",
    `${getS("about_page", "about_title_1", "Experience that grows")} ${getS("about_page", "about_title_2", "with your scale")}`.trim()
  );
  const { part1: titlePart1, part2: titlePart2 } = landingTitleParts(
    howHeadline,
    getS("about_page", "about_title_2", "scale")
  );

  const intro = getS(
    "about_page",
    "how_intro",
    getS(
      "about_page",
      "about_desc",
      "Book trusted home professionals in a few taps — from one-off repairs to ongoing care for your property."
    )
  );

  const ctaLabel = getS("about_page", "how_cta_label", "Browse services");
  const ctaUrl = getS("about_page", "how_cta_url", "/services");

  const features = [
    {
      title: getS("about_page", "step_1_title", "Tell us what you need"),
      description: stepDesc(
        getS,
        1,
        "Search by service and location so we can match you with verified pros."
      ),
    },
    {
      title: getS("about_page", "step_2_title", "Choose a time"),
      description: stepDesc(
        getS,
        2,
        "Pick a date and time that works for you — providers confirm availability."
      ),
    },
    {
      title: getS("about_page", "step_3_title", "We handle the rest"),
      description: stepDesc(
        getS,
        3,
        "Secure booking, messaging, and payments through one trusted platform."
      ),
    },
  ];

  return (
    <LandingSection variant="muted" className="bg-muted/50 dark:bg-muted/30">
      <LandingSectionHeader
        badge={badge}
        title={<LandingGradientTitle part1={titlePart1} part2={titlePart2} />}
        subtitle={intro}
        align="center"
        className="mb-10 md:mb-12"
      />

      <div
        className={cn(
          "rounded-[1.75rem] md:rounded-[2rem] bg-background border border-border/50",
          "shadow-sm p-8 md:p-12 lg:p-14"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? Search;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center space-y-5"
              >
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <Icon
                    className="h-20 w-20 text-foreground stroke-[1.25]"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <span
                    className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-teal-600/80"
                    aria-hidden
                  />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 md:mt-12 flex justify-center">
          <LandingButton asChild size="lg">
            <Link href={ctaUrl.startsWith("/") ? ctaUrl : `/${ctaUrl}`}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </LandingButton>
        </div>
      </div>
    </LandingSection>
  );
}
