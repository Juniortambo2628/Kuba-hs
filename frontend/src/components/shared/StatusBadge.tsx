"use client";

import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Shield,
  User,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getBookingStatusClasses,
  getDashboardStatusClasses,
  getTransactionStatusClasses,
  getTransactionStatusLabel,
  getReviewStatusClasses,
  getComplianceStatusClasses,
  getComplianceStatusLabel,
  getVerificationDocStatusClasses,
  getVerificationDocStatusLabel,
  getPayoutStatusClasses,
  type DashboardBadgeType,
} from "@/lib/status-styles";

type BadgeType =
  | "booking"
  | "dashboard"
  | "transaction"
  | "review"
  | "compliance"
  | "verification"
  | "payout";

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
  dashboardType?: DashboardBadgeType;
  isExpired?: boolean;
  className?: string;
  showIcon?: boolean;
}

function getStatusIcon(s: string, type: BadgeType) {
  if (type === "dashboard") {
    // Icons handled internally by dashboard type
  }

  if (["active", "completed", "paid", "confirmed", "published", "approved", "success", "compliant"].includes(s)) {
    return <CheckCircle className="w-3.5 h-3.5" />;
  }
  if (["pending", "processing", "expiring_soon"].includes(s)) {
    return <Clock className="w-3.5 h-3.5" />;
  }
  if (["suspended", "cancelled", "failed", "error", "hidden", "rejected", "non_compliant", "expired"].includes(s)) {
    return <XCircle className="w-3.5 h-3.5" />;
  }
  return <AlertCircle className="w-3.5 h-3.5" />;
}

function getRoleIcon(s: string) {
  if (s === "admin") return <Shield className="w-3 h-3" />;
  if (s === "provider") return <Briefcase className="w-3 h-3" />;
  return <User className="w-3 h-3" />;
}

function getStyles(status: string, type: BadgeType, dashboardType?: DashboardBadgeType, isExpired = false): string {
  const s = status.toLowerCase();
  switch (type) {
    case "booking":
      return getBookingStatusClasses(s);
    case "dashboard":
      return getDashboardStatusClasses(s, dashboardType ?? "status");
    case "transaction":
      return getTransactionStatusClasses(s);
    case "review":
      return getReviewStatusClasses(s);
    case "compliance":
      return getComplianceStatusClasses(s);
    case "verification":
      return getVerificationDocStatusClasses(s, isExpired);
    case "payout":
      return getPayoutStatusClasses(s);
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function getLabel(status: string, type: BadgeType, isExpired = false): string {
  const s = status.toLowerCase();
  switch (type) {
    case "transaction":
      return getTransactionStatusLabel(s);
    case "compliance":
      return getComplianceStatusLabel(s);
    case "verification":
      return getVerificationDocStatusLabel(s, isExpired);
    default:
      return status;
  }
}

export function StatusBadge({
  status,
  type = "dashboard",
  dashboardType,
  isExpired = false,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const s = status.toLowerCase();
  const styles = getStyles(status, type, dashboardType, isExpired);
  const label = getLabel(status, type, isExpired);

  const icon =
    type === "dashboard" && dashboardType === "role" ? (
      getRoleIcon(s)
    ) : showIcon ? (
      getStatusIcon(s, type)
    ) : null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight border flex items-center gap-1.5 shrink-0 uppercase",
        styles,
        className
      )}
    >
      {icon}
      {label}
    </Badge>
  );
}
