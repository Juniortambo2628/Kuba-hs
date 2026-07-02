"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DashboardUserAvatar } from "@/components/dashboard/workspace/DashboardUserAvatar";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface DashboardJobsTableProps {
  title: string;
  subtitle?: string;
  bookings: Booking[];
  viewAllHref?: string;
  className?: string;
}

export function DashboardJobsTable({
  title,
  subtitle,
  bookings,
  viewAllHref = "/dashboard/provider/bookings",
  className,
}: DashboardJobsTableProps) {
  return (
    <div className={cn(workspaceUi.table.wrap, className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border-b border-border/50">
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <Link href={viewAllHref} className="text-xs font-semibold text-primary hover:underline">
          Open registry
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className={cn(workspaceUi.table.head, "px-5 py-3")}>Client</th>
              <th className={cn(workspaceUi.table.head, "px-3 py-3")}>Service</th>
              <th className={cn(workspaceUi.table.head, "px-3 py-3")}>Status</th>
              <th className={cn(workspaceUi.table.head, "px-5 py-3 text-right")}>Visit</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground text-sm">
                  No recent jobs in this view
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className={workspaceUi.table.row}>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/provider/bookings/${b.id}`}
                      className="flex items-center gap-3"
                    >
                      <DashboardUserAvatar
                        name={b.customer?.name}
                        avatarUrl={b.customer?.avatar_url}
                        size="sm"
                      />
                      <span className="font-semibold text-foreground">
                        {b.customer?.name ?? "Client"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-4 text-muted-foreground max-w-[200px] truncate">
                    {b.service?.name ?? "—"}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={b.status} type="booking" />
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                    {b.scheduled_date
                      ? new Date(b.scheduled_date).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
