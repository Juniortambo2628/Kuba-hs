"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TableHead, TableRow } from "@/components/ui/table";
import { dashboardUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type DashboardDataCardVariant = "base" | "glass" | "elevated";

const cardVariantClass: Record<DashboardDataCardVariant, string> = {
  base: dashboardUi.card.base,
  glass: dashboardUi.table.cardGlass,
  elevated: dashboardUi.card.elevated,
};

interface DashboardDataCardProps {
  children: ReactNode;
  variant?: DashboardDataCardVariant;
  className?: string;
  contentClassName?: string;
}

/** Standard table wrapper for admin + role dashboards */
export function DashboardDataCard({
  children,
  variant = "glass",
  className,
  contentClassName = "p-0",
}: DashboardDataCardProps) {
  return (
    <Card className={cn(cardVariantClass[variant], className)}>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

interface DashboardTableHeaderRowProps extends ComponentProps<typeof TableRow> {}

export function DashboardTableHeaderRow({ className, ...props }: DashboardTableHeaderRowProps) {
  return <TableRow className={cn(dashboardUi.table.headerRow, className)} {...props} />;
}

interface DashboardTableHeadProps extends ComponentProps<typeof TableHead> {
  position?: "first" | "last" | "default";
}

export function DashboardTableHead({
  className,
  position = "default",
  ...props
}: DashboardTableHeadProps) {
  const positionClass =
    position === "first"
      ? dashboardUi.table.headFirst
      : position === "last"
        ? dashboardUi.table.headLast
        : dashboardUi.table.head;

  return <TableHead className={cn(positionClass, className)} {...props} />;
}
