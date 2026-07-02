"use client";

import { ReactNode } from "react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

interface DashboardFrostedSurfaceProps {
  children: ReactNode;
  className?: string;
  /** Optional section title row */
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  padding?: boolean;
}

/** Large frosted panel — chat, lists, detail sections. */
export function DashboardFrostedSurface({
  children,
  className,
  title,
  subtitle,
  action,
  padding = true,
}: DashboardFrostedSurfaceProps) {
  return (
    <section className={cn(workspaceUi.frosted.surface, "overflow-hidden", className)}>
      {(title || action) && (
        <div
          className={cn(
            "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/30",
            padding ? "px-5 py-4 md:px-6" : "px-5 py-4"
          )}
        >
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(!title && !action && padding && "p-0")}>{children}</div>
    </section>
  );
}
