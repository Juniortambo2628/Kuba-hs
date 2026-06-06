import type { ComponentProps } from "react";
import { AppButton, type AppButtonTone } from "@/components/shared/ui/AppButton";

type DashboardButtonTone = "primary" | "secondary" | "destructive";

interface DashboardButtonProps extends ComponentProps<typeof AppButton> {
  tone?: DashboardButtonTone;
}

const toneMap: Record<DashboardButtonTone, AppButtonTone> = {
  primary: "primary",
  secondary: "secondary",
  destructive: "destructive",
};

/** Dashboard CTAs — wraps {@link AppButton} with dashboard tone presets */
export function DashboardButton({ tone = "primary", ...props }: DashboardButtonProps) {
  return <AppButton tone={toneMap[tone]} scale="md" {...props} />;
}
