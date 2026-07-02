"use client";

import { ReactNode } from "react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function DashboardPageHeader({ title, subtitle, children, className }: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
        className
      )}
    >
      <div>
        <h1 className={workspaceUi.greeting.title}>{title}</h1>
        {subtitle && <p className={workspaceUi.greeting.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
