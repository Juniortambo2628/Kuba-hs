"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          styles: "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
        };
      case 'confirmed':
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          styles: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          styles: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
        };
      case 'in_progress':
        return {
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
          styles: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          styles: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
        };
      default:
        return {
          icon: null,
          styles: "bg-muted text-muted-foreground border-border"
        };
    }
  };

  const { icon, styles } = getStatusConfig(normalizedStatus);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-full px-3 py-1 font-semibold text-[9px] uppercase tracking-normal border flex items-center gap-1.5 shrink-0",
        styles,
        className
      )}
    >
      {icon}
      {status}
    </Badge>
  );
}
