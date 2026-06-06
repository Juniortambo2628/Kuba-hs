"use client";

import { Button } from "@/components/ui/button";
import { landingUi } from "@/lib/landing-ui";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type LandingButtonVariant = "primary" | "secondary" | "ghost";
type LandingButtonSize = "sm" | "md" | "lg";

interface LandingButtonProps extends Omit<ComponentProps<typeof Button>, "variant" | "size"> {
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
}

const variantClass: Record<LandingButtonVariant, string> = {
  primary: landingUi.button.primary,
  secondary: landingUi.button.secondary,
  ghost: landingUi.button.ghost,
};

const sizeClass: Record<LandingButtonSize, string> = {
  sm: landingUi.button.sm,
  md: landingUi.button.md,
  lg: landingUi.button.lg,
};

const shadcnVariant: Record<
  LandingButtonVariant,
  ComponentProps<typeof Button>["variant"]
> = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
};

/** Consistent pill CTAs across all landing sections */
export function LandingButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LandingButtonProps) {
  return (
    <Button
      variant={shadcnVariant[variant]}
      className={cn(
        landingUi.button.base,
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    />
  );
}
