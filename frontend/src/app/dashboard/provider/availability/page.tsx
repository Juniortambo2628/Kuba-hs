"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import {
  WeeklyScheduleDialog,
  type DayAvailability,
} from "@/components/dashboard/WeeklyScheduleDialog";
import {
  AvailabilityExceptionsDialog,
  type ScheduleException,
} from "@/components/dashboard/AvailabilityExceptionsDialog";

const DAYS = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export default function AvailabilityManagement() {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [exceptionsOpen, setExceptionsOpen] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/availability");
      const mapped = DAYS.map((day) => {
        const existing = (res.data.availability || []).find(
          (a: { day_of_week: number }) => a.day_of_week === day.id
        );
        return (
          existing ?? {
            day_of_week: day.id,
            start_time: "09:00",
            end_time: "17:00",
            is_available: false,
          }
        );
      });
      setAvailability(mapped);
      setExceptions(res.data.exceptions || []);
    } catch {
      toast.error("Failed to load availability");
    } finally {
      setIsLoading(false);
    }
  };

  const openDays = availability.filter((d) => d.is_available).length;

  const formatExceptionDate = (date: string) => {
    const d = date?.split("T")[0] ?? date;
    try {
      return new Date(d + "T12:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Availability"
        subtitle="Set your weekly hours and block off dates when you are unavailable."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DashboardPanelCard
            title="Weekly hours"
            description={`${openDays} day${openDays === 1 ? "" : "s"} open for bookings`}
            icon={Calendar}
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setWeeklyOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit schedule
              </Button>
            }
          >
            <ul className="space-y-2">
              {availability.map((day) => {
                const dayName = DAYS.find((d) => d.id === day.day_of_week)?.name;
                return (
                  <li
                    key={day.day_of_week}
                    className={cn(
                      workspaceUi.frosted.inset,
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4",
                      !day.is_available && "opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold w-24 text-foreground">{dayName}</span>
                      {day.is_available ? (
                        <DashboardStatusBadge status="active" label="Open" tone="good" />
                      ) : (
                        <DashboardStatusBadge status="offline" label="Closed" tone="muted" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {day.is_available
                        ? `${day.start_time} – ${day.end_time}`
                        : "Not accepting bookings"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </DashboardPanelCard>
        </div>

        <div className="space-y-5">
          <DashboardPanelCard
            title="Date exceptions"
            description={`${exceptions.length} override${exceptions.length === 1 ? "" : "s"}`}
            icon={Clock}
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setExceptionsOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Manage
              </Button>
            }
          >
            {exceptions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No exceptions yet</p>
            ) : (
              <ul className="space-y-2">
                {exceptions.slice(0, 5).map((exc, idx) => (
                  <li
                    key={idx}
                    className={cn(workspaceUi.frosted.inset, "p-3 flex justify-between gap-2 text-sm")}
                  >
                    <span className="font-medium text-foreground">
                      {formatExceptionDate(exc.date)}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {exc.is_closed
                        ? "Closed"
                        : `${exc.start_time} – ${exc.end_time}`}
                    </span>
                  </li>
                ))}
                {exceptions.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{exceptions.length - 5} more — open Manage to view all
                  </p>
                )}
              </ul>
            )}
          </DashboardPanelCard>

          <p className="text-xs text-muted-foreground leading-relaxed px-1">
            Exceptions take priority over your weekly schedule for those dates.
          </p>
        </div>
      </div>

      <WeeklyScheduleDialog
        open={weeklyOpen}
        onOpenChange={setWeeklyOpen}
        initial={availability}
        onSuccess={fetchAvailability}
      />
      <AvailabilityExceptionsDialog
        open={exceptionsOpen}
        onOpenChange={setExceptionsOpen}
        initial={exceptions}
        onSuccess={fetchAvailability}
      />
    </DashboardPageContainer>
  );
}
