"use client";

import {
  getVerificationDocStatusClasses,
  getVerificationDocStatusLabel,
} from "@/lib/status-styles";
import { cn } from "@/lib/utils";

interface VerificationDocStatusBadgeProps {
  status: string;
  isExpired?: boolean;
  className?: string;
}

export function VerificationDocStatusBadge({
  status,
  isExpired = false,
  className,
}: VerificationDocStatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md",
        getVerificationDocStatusClasses(status, isExpired),
        className
      )}
    >
      {getVerificationDocStatusLabel(status, isExpired)}
    </span>
  );
}
