"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getBookingStatusClasses } from "@/lib/status-styles";

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const getStatusConfig = (s: string) => {
    const styles = getBookingStatusClasses(s);
    switch (s) {
      case 'completed':
        return { icon: <CheckCircle className="w-3.5 h-3.5" />, styles };
      case 'confirmed':
      case 'in_progress':
        return {
          icon: <Clock className={`w-3.5 h-3.5 ${s === 'in_progress' ? 'animate-pulse' : ''}`} />,
          styles,
        };
      case 'pending':
        return { icon: <AlertCircle className="w-3.5 h-3.5" />, styles };
      case 'cancelled':
        return { icon: <XCircle className="w-3.5 h-3.5" />, styles };
      default:
        return { icon: null, styles };
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
