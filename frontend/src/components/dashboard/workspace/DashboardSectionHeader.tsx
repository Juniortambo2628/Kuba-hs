"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function DashboardSectionHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-foreground border border-border/50">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0 space-y-0.5">
          <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
