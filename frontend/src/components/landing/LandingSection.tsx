"use client";

import { PageContainer } from "@/components/shared/ui";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  /** e.g. bg-background, bg-muted/50 */
  variant?: "default" | "muted";
  id?: string;
}

const variantBg = {
  default: "bg-background",
  muted: "bg-muted/50",
};

/** Consistent landing section shell — padding and container */
export function LandingSection({
  children,
  className,
  variant = "default",
  id,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(uiPrimitives.layout.sectionLanding, variantBg[variant], className)}
    >
      <PageContainer className="w-full py-0">{children}</PageContainer>
    </section>
  );
}
