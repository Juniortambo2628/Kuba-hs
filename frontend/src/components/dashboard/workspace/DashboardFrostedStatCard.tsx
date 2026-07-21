"use client";

import type { ReactNode, ComponentType } from "react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type FrostedStatTone = "neutral" | "primary" | "success" | "warning";

const iconTone: Record<FrostedStatTone, string> = {
  neutral: "bg-muted/80 text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface DashboardFrostedStatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string; strokeWidth?: number | string }>;
  tone?: FrostedStatTone;
  badge?: string;
  badgeTone?: "good" | "info" | "muted";
  hint?: string;
  isLoading?: boolean;
  className?: string;
}

/** Compact frosted summary tile (screenshot-style stat row). */
export function DashboardFrostedStatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  badge,
  badgeTone = "muted",
  hint,
  isLoading,
  className,
}: DashboardFrostedStatCardProps) {
  if (isLoading) {
    return (
      <div className={cn(workspaceUi.frosted.statCard, "p-4 md:p-5", className)}>
        <Skeleton className="h-10 w-10 rounded-xl mb-4" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        workspaceUi.frosted.statCard,
        "p-4 md:p-5 flex flex-col gap-3 min-h-[120px]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
            iconTone[tone]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {badge && (
          <span className={cn(workspaceUi.frosted.badge.base, workspaceUi.frosted.badge[badgeTone])}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground/80 mt-1 leading-snug">{hint}</p>}
      </div>
    </div>
  );
}

interface DashboardFrostedStatGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function DashboardFrostedStatGrid({
  children,
  className,
  columns = 3,
}: DashboardFrostedStatGridProps) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return <div className={cn("grid grid-cols-1 gap-4", cols, className)}>{children}</div>;
}
