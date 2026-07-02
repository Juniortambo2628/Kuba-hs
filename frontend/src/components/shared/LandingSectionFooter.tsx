"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingButton } from "@/components/shared/LandingButton";

interface LandingSectionFooterProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * Reusable "View all" CTA at the bottom of landing sections.
 * Replaces the duplicated pattern across FeaturedServices, FeaturedProviders, Categories, About.
 */
export function LandingSectionFooter({
  href,
  label = "View all",
  className = "mt-12 flex justify-center",
}: LandingSectionFooterProps) {
  return (
    <div className={className}>
      <LandingButton asChild variant="secondary" size="md">
        <Link href={href}>
          {label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </LandingButton>
    </div>
  );
}
