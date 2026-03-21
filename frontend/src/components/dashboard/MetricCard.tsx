"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isLoading?: boolean;
}

export function MetricCard({ label, value, icon: Icon, trend, isLoading }: MetricCardProps) {
  return (
    <Card 
      className="border border-border/50 group shadow-sm bg-card/50 backdrop-blur-md rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5 overflow-hidden"
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <CardContent className="p-6 flex items-center justify-between">
        {isLoading ? (
          <div className="space-y-3 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground">
              {label}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter leading-none">
                {value}
              </span>
              {trend && (
                <span className="text-[8px] font-bold text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded-md">
                  {trend}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="p-4 bg-muted/50 rounded-xl text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
