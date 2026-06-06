import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type SurfaceVariant = "card" | "elevated" | "panel" | "ctaPrimary";

const surfaceClass: Record<SurfaceVariant, string> = {
  card: uiPrimitives.surface.card,
  elevated: uiPrimitives.surface.cardElevated,
  panel: uiPrimitives.surface.panel,
  ctaPrimary: uiPrimitives.surface.ctaPrimary,
};

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  children: ReactNode;
}

/** Large-radius panels — replaces ad-hoc rounded-[2.5rem] blocks */
export function SurfaceCard({
  variant = "card",
  children,
  className,
  ...props
}: SurfaceCardProps) {
  return (
    <div className={cn(surfaceClass[variant], className)} {...props}>
      {children}
    </div>
  );
}
