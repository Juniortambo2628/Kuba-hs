"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCMS } from "@/contexts/CMSContext";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingButton } from "@/components/shared/LandingButton";
import { CorporateQuoteRequestDialog } from "@/components/landing/CorporateQuoteRequestDialog";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";
import { designSystem } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function CorporateSolutions() {
  const { getS } = useCMS();
  const [requestOpen, setRequestOpen] = useState(false);

  const dedicatedHeadline = getS("market_narratives", "corp_banner_headline", "").trim();
  const headline =
    dedicatedHeadline ||
    `${getS("market_narratives", "corp_title_1", "One platform for every")} ${getS("market_narratives", "corp_title_2", "service your business needs")}`.trim();

  const highlightWord =
    getS("market_narratives", "corp_title_2", "needs").split(/\s+/).pop() || "needs";
  const { part1: titlePart1, part2: titlePart2 } = landingTitleParts(headline, highlightWord);

  const body =
    getS(
      "market_narratives",
      "corp_banner_body",
      getS(
        "market_narratives",
        "corp_desc",
        "Consolidated billing, dedicated account support, and vetted professionals for offices, retail, and multi-site teams."
      )
    ) || "";

  const badge = getS("market_narratives", "corp_badge", "For Businesses & Offices");
  const readMoreLabel = getS("market_narratives", "corp_cta_secondary", "Read more");
  const readMoreHref = getS(
    "market_narratives",
    "corp_read_more_href",
    getS("market_narratives", "corp_video_href", "/commercial")
  );
  const requestQuoteLabel = getS("market_narratives", "corp_cta_primary", "Request quote");

  const dialogTitle = getS(
    "market_narratives",
    "corp_request_modal_title",
    "Request a business plan"
  );
  const dialogDesc = getS(
    "market_narratives",
    "corp_request_modal_desc",
    "Tell us about your organization and we'll design a service package with consolidated billing and dedicated support."
  );

  return (
    <LandingSection variant="muted" id="for-businesses">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "rounded-[1.75rem] md:rounded-[2rem] bg-background border border-border/50",
          "shadow-sm p-8 md:p-12 lg:p-14"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <LandingSectionHeader
            badge={badge}
            title={<LandingGradientTitle part1={titlePart1} part2={titlePart2} />}
            align="left"
            className="mb-0 !mb-0 [&_h2]:text-left [&_p]:mx-0"
          />

          <div className="flex flex-col gap-6 lg:pt-1">
            <p
              className={cn(
                designSystem.typography.section.subtitle,
                "mx-0 max-w-xl text-left"
              )}
            >
              {body}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <LandingButton asChild variant="secondary" size="md">
                <Link href={readMoreHref.startsWith("/") ? readMoreHref : `/${readMoreHref}`}>
                  {readMoreLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </LandingButton>
              <LandingButton type="button" variant="primary" size="md" onClick={() => setRequestOpen(true)}>
                {requestQuoteLabel}
              </LandingButton>
            </div>
          </div>
        </div>
      </motion.div>

      <CorporateQuoteRequestDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        title={dialogTitle}
        description={dialogDesc}
      />
    </LandingSection>
  );
}
