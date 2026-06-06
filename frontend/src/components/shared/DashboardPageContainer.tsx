import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { dashboardPageContainerClass, type DashboardPageWidth } from "@/lib/dashboard-ui";

interface DashboardPageContainerProps {
  children: ReactNode;
  width?: DashboardPageWidth;
  className?: string;
}

/** Standard page wrapper for admin + role dashboards */
export function DashboardPageContainer({
  children,
  width = "standard",
  className,
}: DashboardPageContainerProps) {
  return <div className={cn(dashboardPageContainerClass(width), className)}>{children}</div>;
}
