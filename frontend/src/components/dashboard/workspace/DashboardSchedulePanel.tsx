"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Plus, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { DashboardUserAvatar } from "@/components/dashboard/workspace/DashboardUserAvatar";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface DashboardSchedulePanelProps {
  dateLabel: string;
  jobCount: number;
  featured?: Booking | null;
  upcoming: Booking[];
  featuredActions?: ReactNode;
  addHref?: string;
  viewAllHref?: string;
  className?: string;
}

export function DashboardSchedulePanel({
  dateLabel,
  jobCount,
  featured,
  upcoming,
  featuredActions,
  addHref = "/dashboard/provider/bookings",
  viewAllHref = "/dashboard/provider/bookings",
  className,
}: DashboardSchedulePanelProps) {
  return (
    <div className={cn(workspaceUi.card, workspaceUi.cardPadding, "space-y-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-foreground">{dateLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{jobCount} active jobs</p>
        </div>
        <Button asChild size="icon" className="rounded-full h-9 w-9 shrink-0">
          <Link href={addHref} aria-label="View bookings">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {featured ? (
        <div className={workspaceUi.schedule.featured}>
          <div className="flex items-start gap-3">
            <DashboardUserAvatar
              name={featured.customer?.name}
              avatarUrl={featured.customer?.avatar_url}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-foreground truncate">
                {featured.customer?.name ?? "Client"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {featured.service?.name ?? "Service"}
              </p>
              <div className="mt-2">
                <BookingStatusBadge status={featured.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {featured.scheduled_date
              ? new Date(featured.scheduled_date).toLocaleString([], {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Schedule TBD"}
          </div>
          {featuredActions}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-6 text-center">No jobs scheduled today</p>
      )}

      <div className="space-y-0">
        {upcoming.map((b) => (
          <Link
            key={b.id}
            href={`/dashboard/provider/bookings/${b.id}`}
            className={cn(workspaceUi.schedule.row, "block")}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {b.customer?.name ?? "Client"}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
                {b.service?.name ?? "Service"}
              </p>
            </div>
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              {b.scheduled_date
                ? new Date(b.scheduled_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </Link>
        ))}
      </div>

      <Link href={viewAllHref} className="text-xs font-semibold text-primary hover:underline">
        View all jobs
      </Link>
    </div>
  );
}
