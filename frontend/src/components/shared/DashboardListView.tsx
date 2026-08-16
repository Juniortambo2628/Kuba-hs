"use client";

import { useState, ReactNode, ComponentProps } from "react";
import { LucideIcon } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { DashboardListToolbar, FilterGroup, BulkAction } from "@/components/shared/DashboardListToolbar";
import { EmptyState } from "@/components/shared/ui/EmptyState";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  position?: "first" | "last" | "default";
  className?: string;
  headerClassName?: string;
  render: (item: T) => ReactNode;
}

interface DashboardListViewProps<T> {
  data: T[];
  isLoading: boolean;
  keyExtractor: (item: T) => string | number;

  /** Column definitions for list/table mode */
  columns: ColumnDef<T>[];

  /** Render a card for grid mode */
  renderGridCard: (item: T) => ReactNode;

  /** Toolbar */
  hint?: string;
  filters?: FilterGroup[];
  bulkActions?: BulkAction[];
  toolbarTrailing?: ReactNode;

  /** View mode control */
  defaultViewMode?: "grid" | "list";

  /** Table styling */
  tableClassName?: string;
  dataCardVariant?: "base" | "glass" | "elevated";
  rowClassName?: (item: T) => string;

  /** Grid styling */
  gridClassName?: string;

  /** Empty state */
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;

  /** Loading skeleton counts */
  listSkeletonCount?: number;
  gridSkeletonCount?: number;

  /** Use full-page skeleton instead of inline skeletons */
  fullPageSkeleton?: boolean;
  fullPageSkeletonMetrics?: number;
  fullPageSkeletonHeight?: string;

  /** Custom skeleton renderers */
  renderListSkeleton?: (index: number) => ReactNode;
  renderGridSkeleton?: (index: number) => ReactNode;

  /** Custom empty renderers */
  renderEmptyList?: () => ReactNode;
  renderEmptyGrid?: () => ReactNode;
}

export function DashboardListView<T>({
  data,
  isLoading,
  keyExtractor,
  columns,
  renderGridCard,
  hint,
  filters,
  bulkActions,
  toolbarTrailing,
  defaultViewMode = "grid",
  tableClassName,
  dataCardVariant = "glass",
  rowClassName,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  emptyIcon,
  emptyTitle = "No items found",
  emptyDescription,
  listSkeletonCount = 5,
  gridSkeletonCount = 6,
  fullPageSkeleton,
  fullPageSkeletonMetrics,
  fullPageSkeletonHeight,
  renderListSkeleton,
  renderGridSkeleton,
  renderEmptyList,
  renderEmptyGrid,
}: DashboardListViewProps<T>) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultViewMode);
  const EmptyIcon = emptyIcon;

  if (fullPageSkeleton && isLoading) {
    const { DashboardPageSkeleton } = require("@/components/shared/DashboardPageSkeleton");
    return <DashboardPageSkeleton metrics={fullPageSkeletonMetrics ?? 0} bodyHeight={fullPageSkeletonHeight ?? "h-[500px]"} />;
  }

  const defaultListSkeleton = (i: number) => (
    <TableRow key={`skeleton-${i}`}>
      {columns.map((col) => (
        <TableCell key={col.key} className="py-4">
          <Skeleton className="h-5 w-full rounded-lg" />
        </TableCell>
      ))}
    </TableRow>
  );

  const defaultGridSkeleton = (i: number) => (
    <div key={`skeleton-${i}`} className="rounded-2xl border border-border/40 bg-card/50 p-5 space-y-4">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );

  return (
    <>
      <DashboardListToolbar
        hint={hint}
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={filters}
        bulkActions={bulkActions}
        trailing={toolbarTrailing}
      />

      {viewMode === "list" ? (
        <DashboardDataCard variant={dataCardVariant} className={tableClassName}>
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                {columns.map((col) => (
                  <DashboardTableHead
                    key={col.key}
                    position={col.position}
                    className={col.headerClassName}
                  >
                    {col.header}
                  </DashboardTableHead>
                ))}
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: listSkeletonCount }).map((_, i) =>
                    renderListSkeleton ? renderListSkeleton(i) : defaultListSkeleton(i)
                  )
                : data.length === 0
                ? renderEmptyList ? renderEmptyList() : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-80 text-center">
                        <EmptyState
                          variant="dashboard"
                          icon={emptyIcon}
                          title={emptyTitle}
                          description={emptyDescription}
                        />
                      </TableCell>
                    </TableRow>
                  )
                : data.map((item) => (
                    <TableRow
                      key={keyExtractor(item)}
                      className={rowClassName?.(item)}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </DashboardDataCard>
      ) : (
        <div className={gridClassName}>
          {isLoading
            ? Array.from({ length: gridSkeletonCount }).map((_, i) =>
                renderGridSkeleton ? renderGridSkeleton(i) : defaultGridSkeleton(i)
              )
            : data.length === 0
            ? renderEmptyGrid ? renderEmptyGrid() : (
                <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 text-muted-foreground border border-dashed border-border/60 rounded-2xl bg-muted/10">
                  {EmptyIcon && <EmptyIcon className="h-16 w-16 opacity-10" />}
                  <p className="text-[11px] font-bold tracking-tight">{emptyTitle}</p>
                </div>
              )
            : data.map((item) => (
                <div key={keyExtractor(item)}>
                  {renderGridCard(item)}
                </div>
              ))
          }
        </div>
      )}
    </>
  );
}
