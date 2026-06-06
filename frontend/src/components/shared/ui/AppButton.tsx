import { Button } from "@/components/ui/button";
import { dashboardUi } from "@/lib/dashboard-ui";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type AppButtonTone =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "marketing";

export type AppButtonScale = "sm" | "md" | "lg" | "default";

const toneClass: Record<AppButtonTone, string> = {
  primary: cn(uiPrimitives.button.base, uiPrimitives.button.primary),
  secondary: cn(uiPrimitives.button.base, uiPrimitives.button.secondary, dashboardUi.button.secondary),
  destructive: dashboardUi.button.destructive,
  outline: cn(uiPrimitives.button.base, uiPrimitives.button.secondary),
  ghost: cn(uiPrimitives.button.base, uiPrimitives.button.ghost),
  marketing: cn(uiPrimitives.button.base, uiPrimitives.button.lg, uiPrimitives.button.primary),
};

const scaleClass: Record<AppButtonScale, string> = {
  sm: uiPrimitives.button.sm,
  md: uiPrimitives.button.md,
  lg: uiPrimitives.button.lg,
  default: "",
};

interface AppButtonProps extends ComponentProps<typeof Button> {
  tone?: AppButtonTone;
  scale?: AppButtonScale;
}

/** Unified CTA — dashboards, marketing listings, empty states */
export function AppButton({
  tone = "primary",
  scale = "default",
  className,
  variant,
  size,
  ...props
}: AppButtonProps) {
  const mappedVariant =
    variant ??
    (tone === "destructive"
      ? "destructive"
      : tone === "secondary" || tone === "outline"
        ? "outline"
        : tone === "ghost"
          ? "ghost"
          : "default");

  return (
    <Button
      variant={mappedVariant}
      className={cn(toneClass[tone], scale !== "default" && scaleClass[scale], className)}
      {...props}
    />
  );
}
