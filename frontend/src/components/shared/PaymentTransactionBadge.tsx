"use client";

import { Badge } from "@/components/ui/badge";
import { getTransactionStatusClasses, getTransactionStatusLabel } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

interface PaymentTransactionBadgeProps {
  status: string;
  className?: string;
}

export function PaymentTransactionBadge({ status, className }: PaymentTransactionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border",
        getTransactionStatusClasses(status),
        className
      )}
    >
      {getTransactionStatusLabel(status)}
    </Badge>
  );
}
