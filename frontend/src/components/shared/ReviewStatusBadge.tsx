"use client";

import { Badge } from "@/components/ui/badge";
import { getReviewStatusClasses } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

interface ReviewStatusBadgeProps {
  status: string;
  className?: string;
}

export function ReviewStatusBadge({ status, className }: ReviewStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize text-[10px] font-bold border", getReviewStatusClasses(status), className)}
    >
      {status}
    </Badge>
  );
}
