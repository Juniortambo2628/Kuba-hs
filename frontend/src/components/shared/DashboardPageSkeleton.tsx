import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import type { DashboardPageWidth } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

interface DashboardPageSkeletonProps {
  width?: DashboardPageWidth;
  /** Number of metric card placeholders (0 to skip grid) */
  metrics?: number;
  /** Extra block height below metrics */
  bodyHeight?: string;
  className?: string;
}

/** Shared admin/dashboard loading shell — pair with DashboardPageContainer widths. */
export function DashboardPageSkeleton({
  width = "standard",
  metrics = 4,
  bodyHeight = "h-[400px]",
  className,
}: DashboardPageSkeletonProps) {
  return (
    <DashboardPageContainer width={width} className={className}>
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        {metrics > 0 && (
          <div
            className={
              metrics <= 2
                ? "grid gap-4 md:grid-cols-2"
                : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            }
          >
            {Array.from({ length: metrics }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}
        <Skeleton className={cn("w-full rounded-xl", bodyHeight)} />
      </div>
    </DashboardPageContainer>
  );
}
