"use client";

import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { formatStatusLabel } from "@/lib/dashboard-copy";
import { cn } from "@/lib/utils";

export type StatusBadgeTone = "good" | "info" | "muted" | "warning";

const toneForStatus = (status: string): StatusBadgeTone => {
  const s = status.toLowerCase();
  if (["approved", "completed", "active", "verified", "paid", "read", "clear", "good", "live"].includes(s)) {
    return "good";
  }
  if (["pending", "in_progress", "confirmed", "new", "attention"].includes(s)) {
    return "info";
  }
  if (["rejected", "cancelled", "failed", "closed"].includes(s)) {
    return "warning";
  }
  return "muted";
};

interface DashboardStatusBadgeProps {
  status: string;
  label?: string;
  tone?: StatusBadgeTone;
  className?: string;
}

export function DashboardStatusBadge({
  status,
  label,
  tone,
  className,
}: DashboardStatusBadgeProps) {
  const t = tone ?? toneForStatus(status);
  const text = label ?? formatStatusLabel(status);

  return (
    <span
      className={cn(
        workspaceUi.frosted.badge.base,
        workspaceUi.frosted.badge[t],
        className
      )}
    >
      {text}
    </span>
  );
}
