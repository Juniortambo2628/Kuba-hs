"use client";

import { CheckCircle, Clock, XCircle, AlertCircle, Shield, User, Briefcase, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | 'booking' 
  | 'user' 
  | 'role' 
  | 'payment' 
  | 'status' 
  | 'priority';

interface DashboardStatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
  showIcon?: boolean;
}

export function DashboardStatusBadge({ 
  status, 
  type = 'status', 
  className,
  showIcon = true
}: DashboardStatusBadgeProps) {
  const s = status.toLowerCase();

  const getBadgeConfig = () => {
    // Role Statuses
    if (type === 'role') {
      if (s === 'admin') return { icon: <Shield className="w-3 h-3" />, styles: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20" };
      if (s === 'provider') return { icon: <Briefcase className="w-3 h-3" />, styles: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" };
      return { icon: <User className="w-3 h-3" />, styles: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20" };
    }

    // User/General Statuses
    if (s === 'active' || s === 'completed' || s === 'paid' || s === 'confirmed') {
      return { 
        icon: <CheckCircle className="w-3.5 h-3.5" />, 
        styles: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
      };
    }
    if (s === 'pending' || s === 'processing' || s === 'warning') {
      return { 
        icon: <Clock className="w-3.5 h-3.5" />, 
        styles: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" 
      };
    }
    if (s === 'suspended' || s === 'cancelled' || s === 'failed' || s === 'error') {
      return { 
        icon: <XCircle className="w-3.5 h-3.5" />, 
        styles: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" 
      };
    }

    // Default Fallback
    return { 
      icon: <AlertCircle className="w-3.5 h-3.5" />, 
      styles: "bg-muted text-muted-foreground border-border" 
    };
  };

  const { icon, styles } = getBadgeConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight border flex items-center gap-1.5 shrink-0 uppercase",
        styles,
        className
      )}
    >
      {showIcon && icon}
      {status}
    </Badge>
  );
}
