import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import type { DashboardPageWidth } from "@/lib/dashboard-ui";

interface DashboardSuspenseFallbackProps {
  width?: DashboardPageWidth;
  bodyHeight?: string;
}

/** Standard Suspense fallback for dashboard/admin list pages. */
export function DashboardSuspenseFallback({
  width = "standard",
  bodyHeight = "h-[600px]",
}: DashboardSuspenseFallbackProps) {
  return <DashboardPageSkeleton width={width} metrics={0} bodyHeight={bodyHeight} />;
}
