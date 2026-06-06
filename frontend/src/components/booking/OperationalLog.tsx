"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { History, Info as InfoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useData } from "@/hooks/useData";

export interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  actor?: { name: string; role: string };
  created_at: string;
}

function actionLabel(action: string) {
  switch (action) {
    case "created":
      return "Booking created";
    case "status_changed":
      return "Status updated";
    case "rescheduled":
      return "Rescheduled";
    case "payment_completed":
      return "Payment received";
    case "deleted":
      return "Deleted";
    default:
      return action.replace(/_/g, " ");
  }
}

export function OperationalLog({
  bookingId,
  refreshKey = 0,
}: {
  bookingId: string;
  refreshKey?: number;
}) {
  const { data, isLoading, mutate } = useData<ActivityLogEntry[]>(
    `/api/bookings/${bookingId}/activity`
  );

  useEffect(() => {
    mutate();
  }, [refreshKey, mutate]);

  const logs = Array.isArray(data) ? data : [];

  return (
    <Card className="border-none shadow-sm rounded-[2rem] bg-muted/30 border border-border/40">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            Operational Log
          </h3>
          <InfoIcon className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-[10px] text-muted-foreground font-medium">No activity recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((entry, index) => (
              <div key={entry.id} className="flex gap-3 relative">
                {index < logs.length - 1 && (
                  <div className="absolute left-[3px] top-[14px] bottom-0 w-[1px] bg-border/60" />
                )}
                <div
                  className={`w-2 h-2 rounded-full mt-1 shrink-0 ${index === 0 ? "bg-primary ring-4 ring-primary/10" : "bg-border"}`}
                />
                <div>
                  <p className="text-[11px] font-bold text-foreground leading-none">
                    {entry.description || actionLabel(entry.action)}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-1 uppercase font-medium">
                    {entry.actor?.name ? `${entry.actor.name} • ` : ""}
                    {format(new Date(entry.created_at), "HH:mm • MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
