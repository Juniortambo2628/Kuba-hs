"use client";

import { ReactNode } from "react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

export interface GreetingStat {
  label: string;
  value: string | number;
}

interface DashboardGreetingBarProps {
  greeting: string;
  subtitle?: string;
  stats?: GreetingStat[];
  actions?: ReactNode;
  className?: string;
}

export function DashboardGreetingBar({
  greeting,
  subtitle,
  stats = [],
  actions,
  className,
}: DashboardGreetingBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        <h1 className={workspaceUi.greeting.title}>{greeting}</h1>
        {subtitle && <p className={workspaceUi.greeting.subtitle}>{subtitle}</p>}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3">
            {stats.map((s) => (
              <p key={s.label} className={workspaceUi.greeting.stat}>
                {s.label}{" "}
                <span className={workspaceUi.greeting.statValue}>{s.value}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
