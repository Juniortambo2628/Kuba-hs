"use client";

import { CheckCircle, Clock, XCircle, AlertCircle, Shield, User, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getDashboardStatusClasses, type DashboardBadgeType } from "@/lib/status-styles";

export type StatusType = DashboardBadgeType;

interface DashboardStatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
  showIcon?: boolean;
}

export function DashboardStatusBadge({
  status,
  type = "status",
  className,
  showIcon = true,
}: DashboardStatusBadgeProps) {
  const s = status.toLowerCase();
  const styles = getDashboardStatusClasses(status, type);

  const getIcon = () => {
    if (type === "role") {
      if (s === "admin") return <Shield className="w-3 h-3" />;
      if (s === "provider") return <Briefcase className="w-3 h-3" />;
      return <User className="w-3 h-3" />;
    }
    if (["active", "completed", "paid", "confirmed", "published"].includes(s)) {
      return <CheckCircle className="w-3.5 h-3.5" />;
    }
    if (["pending", "processing", "warning"].includes(s)) {
      return <Clock className="w-3.5 h-3.5" />;
    }
    if (["suspended", "cancelled", "failed", "error", "hidden", "rejected"].includes(s)) {
      return <XCircle className="w-3.5 h-3.5" />;
    }
    return <AlertCircle className="w-3.5 h-3.5" />;
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight border flex items-center gap-1.5 shrink-0 uppercase",
        styles,
        className
      )}
    >
      {showIcon && getIcon()}
      {status}
    </Badge>
  );
}
