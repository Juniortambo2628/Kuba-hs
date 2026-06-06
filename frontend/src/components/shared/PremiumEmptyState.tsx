"use client";

import { LucideIcon, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/ui/EmptyState";

interface PremiumEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

/** @deprecated Prefer `<EmptyState variant="premium" />` — kept for existing imports */
export function PremiumEmptyState({
  icon = Sparkles,
  title,
  description,
  actionLabel,
  actionHref,
}: PremiumEmptyStateProps) {
  return (
    <EmptyState
      variant="premium"
      icon={icon}
      title={title}
      description={description}
      actionLabel={actionLabel}
      actionHref={actionHref}
    />
  );
}
