import { Badge } from "@/components/ui/badge";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type AppBadgeVariant = "default" | "secondary" | "outline" | "verified" | "rating" | "count" | "status";

const semanticClass: Partial<Record<AppBadgeVariant, string>> = {
  verified: uiPrimitives.badge.verified,
  rating: uiPrimitives.badge.rating,
  count: uiPrimitives.badge.count,
  status: uiPrimitives.badge.status,
};

interface AppBadgeProps extends ComponentProps<typeof Badge> {
  semantic?: AppBadgeVariant;
}

export function AppBadge({ semantic = "default", className, variant, ...props }: AppBadgeProps) {
  const useSemantic = semantic && semantic in semanticClass && semantic !== "default";
  const shadcnVariant =
    variant ??
    (semantic === "outline" || semantic === "secondary" ? semantic : useSemantic ? "outline" : "default");

  return (
    <Badge
      variant={shadcnVariant}
      className={cn(useSemantic && semanticClass[semantic], className)}
      {...props}
    />
  );
}
