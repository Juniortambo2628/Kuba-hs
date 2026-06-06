"use client";

import { LucideIcon, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/ui/EmptyState";

interface MarketingEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function MarketingEmptyState({
  icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: MarketingEmptyStateProps) {
  return (
    <EmptyState
      variant="marketing"
      icon={icon}
      title={title}
      description={description}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
      className={className}
    />
  );
}
