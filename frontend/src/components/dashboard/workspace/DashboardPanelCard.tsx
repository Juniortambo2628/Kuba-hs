"use client";

import { ReactNode } from "react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { DashboardSectionHeader } from "./DashboardSectionHeader";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardPanelCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  padding?: boolean;
}

/** Frosted panel with optional section header — standard inner card for dashboard pages. */
export function DashboardPanelCard({
  children,
  title,
  description,
  icon,
  action,
  className,
  contentClassName,
  padding = true,
}: DashboardPanelCardProps) {
  const hasHeader = !!(title || description || action);

  return (
    <section className={cn(workspaceUi.frosted.surface, "overflow-hidden", className)}>
      {hasHeader && title && (
        <div className="border-b border-border/30 px-5 py-4 md:px-6">
          <DashboardSectionHeader
            title={title}
            description={description}
            icon={icon}
            action={action}
          />
        </div>
      )}
      <div className={cn(padding && "p-5 md:p-6", contentClassName)}>{children}</div>
    </section>
  );
}
