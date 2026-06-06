"use client";

import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type AppPillVariant = "hero" | "section" | "accent" | "muted" | "count" | "tab";

const variantClass: Record<AppPillVariant, string> = {
  hero: uiPrimitives.pill.hero,
  section: uiPrimitives.pill.section,
  accent: uiPrimitives.pill.accent,
  muted: uiPrimitives.pill.muted,
  count: uiPrimitives.pill.count,
  tab: uiPrimitives.pill.tab,
};

interface AppPillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: AppPillVariant;
  icon?: ReactNode;
  children: ReactNode;
}

/** Unified pills / badges / caps labels across marketing + dashboards */
export function AppPill({
  variant = "accent",
  icon,
  children,
  className,
  ...props
}: AppPillProps) {
  return (
    <span className={cn(uiPrimitives.pill.base, variantClass[variant], className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
