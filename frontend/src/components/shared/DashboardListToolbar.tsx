"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppBadge } from "@/components/shared/ui/AppBadge";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface DashboardListToolbarProps {
  viewMode?: "grid" | "list";
  onViewChange?: (mode: "grid" | "list") => void;
  filters?: FilterGroup[];
  bulkActions?: BulkAction[];
  trailing?: React.ReactNode;
  className?: string;
  hint?: string;
}

/** Filters and view toggle only — use header GlobalSearch (⌘K) for text search. */
export function DashboardListToolbar({
  viewMode,
  onViewChange,
  filters = [],
  bulkActions = [],
  trailing,
  className,
  hint = "Use ⌘K in the header to search this dashboard",
}: DashboardListToolbarProps) {
  const activeFiltersCount = filters.filter(
    (f) => f.value && f.value !== "all" && f.value !== ""
  ).length;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6",
        className
      )}
    >
      <p className="text-xs text-muted-foreground hidden sm:block">{hint}</p>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {trailing}

        {bulkActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full h-9 gap-2">
                <MoreHorizontal className="h-3.5 w-3.5" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {bulkActions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  onClick={action.onClick}
                  className={action.destructive ? "text-destructive" : undefined}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full h-9 gap-2">
                <Filter className="h-3.5 w-3.5" />
                Filters
                {activeFiltersCount > 0 && (
                  <AppBadge semantic="count" className="h-5 min-w-5 px-1">
                    {activeFiltersCount}
                  </AppBadge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {filters.map((group, idx) => (
                <div key={group.id}>
                  {idx > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  {group.options.map((opt) => (
                    <DropdownMenuCheckboxItem
                      key={opt.value}
                      checked={group.value === opt.value}
                      onCheckedChange={() => group.onChange(opt.value)}
                    >
                      {opt.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {viewMode && onViewChange && (
          <div className="flex rounded-full border border-border/60 p-0.5 bg-muted/30">
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onViewChange("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
