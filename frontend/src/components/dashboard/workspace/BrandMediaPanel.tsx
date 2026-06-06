"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";

interface BrandMediaPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function BrandMediaPanel({ title, description, children, className }: BrandMediaPanelProps) {
  return (
    <Card className={cn(workspaceUi.card, "overflow-hidden", className)}>
      <CardContent className="p-0 space-y-0">
        <div className="px-5 py-4 border-b border-border/50 bg-muted/20">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
        <div className="p-5">{children}</div>
      </CardContent>
    </Card>
  );
}
