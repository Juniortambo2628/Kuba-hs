"use client";

import { ReactNode } from "react";
import { LucideIcon, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function DashboardEmptyState({ 
  icon: Icon = ClipboardList, 
  title, 
  description, 
  children,
  className 
}: DashboardEmptyStateProps) {
  return (
    <Card className={cn(
      "border border-dashed border-border min-h-[300px] flex items-center justify-center flex-col gap-6 text-center bg-transparent shadow-none rounded-[2.5rem]",
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
        <Icon className="w-8 h-8 opacity-50" />
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-foreground uppercase tracking-normal">{title}</p>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      {children}
    </Card>
  );
}
