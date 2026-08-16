"use client";

import { TableHead, TableRow } from "@/components/ui/table";
import { dashboardUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { DashboardCard } from "@/components/shared/DashboardCard";

/** @deprecated Use DashboardCard instead */
export const DashboardDataCard = DashboardCard;

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
