"use client";

import { Badge } from "@/components/ui/badge";
import { getPayoutStatusClasses } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

interface PayoutStatusBadgeProps {
  status: string;
  className?: string;
}

export function PayoutStatusBadge({ status, className }: PayoutStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize text-[10px] font-bold border", getPayoutStatusClasses(status), className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
