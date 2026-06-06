import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dashboardUi } from "@/lib/dashboard-ui";

type DashboardCardVariant = "base" | "glass" | "premium" | "elevated";

const variantClass: Record<DashboardCardVariant, string> = {
  base: dashboardUi.card.base,
  glass: dashboardUi.card.glass,
  premium: dashboardUi.card.premium,
  elevated: dashboardUi.card.elevated,
};

interface DashboardCardProps {
  children: ReactNode;
  variant?: DashboardCardVariant;
  className?: string;
  title?: string;
  description?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function DashboardCard({
  children,
  variant = "glass",
  className,
  title,
  description,
  headerClassName,
  contentClassName,
}: DashboardCardProps) {
  return (
    <Card className={cn(variantClass[variant], className)}>
      {(title || description) && (
        <CardHeader className={cn("border-b border-border/40", headerClassName)}>
          {title && <CardTitle className="text-lg font-bold tracking-tight">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !description ? dashboardUi.card.padding : undefined, contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
