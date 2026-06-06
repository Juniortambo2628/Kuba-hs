"use client";

import { getComplianceStatusClasses, getComplianceStatusLabel } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

interface ComplianceStatusBadgeProps {
  status: string;
  className?: string;
}

export function ComplianceStatusBadge({ status, className }: ComplianceStatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
        getComplianceStatusClasses(status),
        className
      )}
    >
      {getComplianceStatusLabel(status)}
    </span>
  );
}
