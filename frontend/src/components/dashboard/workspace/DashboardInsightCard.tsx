"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";

type InsightTone = "neutral" | "primary" | "warm";

const toneClasses: Record<InsightTone, string> = {
  neutral: "bg-muted/50",
  primary: "bg-primary/10",
  warm: "bg-amber-50 dark:bg-amber-950/30",
};

interface DashboardInsightCardProps {
  title: string;
  description: string;
  metric?: string | number;
  href?: string;
  tone?: InsightTone;
  className?: string;
}

export function DashboardInsightCard({
  title,
  description,
  metric,
  href,
  tone = "neutral",
  className,
}: DashboardInsightCardProps) {
  const inner = (
    <div className={cn(workspaceUi.insight.base, toneClasses[tone], className)}>
      <div className="space-y-2 pr-12">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {metric !== undefined && (
        <p className="text-4xl font-bold text-foreground tracking-tight">{metric}</p>
      )}
      {href && (
        <span className={workspaceUi.insight.action} aria-hidden>
          <ArrowUpRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {inner}
      </Link>
    );
  }

  return inner;
}
