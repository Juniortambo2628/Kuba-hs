"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardStatusBadge } from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const DAYS = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export type DayAvailability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

interface WeeklyScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: DayAvailability[];
  onSuccess: () => void;
}

export function WeeklyScheduleDialog({
  open,
  onOpenChange,
  initial,
  onSuccess,
}: WeeklyScheduleDialogProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setAvailability(initial);
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.put("/api/provider/availability", { availability });
      toast.success("Weekly schedule saved");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to update schedule");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CrudFormDialog
      open={open}
      onOpenChange={onOpenChange}
      introTitle="Weekly hours"
      introDescription="Set which days you accept bookings and your working hours for each day."
      formId="weekly-schedule-form"
      submitLabel="Save schedule"
      isSubmitting={isSaving}
    >
      <form id="weekly-schedule-form" onSubmit={handleSubmit} className="space-y-3 max-h-[50vh] overflow-y-auto kuba-scroll pr-1">
        {availability.map((day) => {
          const dayName = DAYS.find((d) => d.id === day.day_of_week)?.name;
          return (
            <div
              key={day.day_of_week}
              className={cn(
                workspaceUi.frosted.inset,
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3",
                !day.is_available && "opacity-60"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold w-20 text-foreground">{dayName}</span>
                {day.is_available ? (
                  <DashboardStatusBadge status="active" label="Open" tone="good" />
                ) : (
                  <DashboardStatusBadge status="offline" label="Closed" tone="muted" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  disabled={!day.is_available}
                  value={day.start_time}
                  onChange={(e) =>
                    setAvailability(
                      availability.map((a) =>
                        a.day_of_week === day.day_of_week
                          ? { ...a, start_time: e.target.value }
                          : a
                      )
                    )
                  }
                  className="rounded-lg border border-border/60 bg-background px-2 py-1.5 text-sm"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <input
                  type="time"
                  disabled={!day.is_available}
                  value={day.end_time}
                  onChange={(e) =>
                    setAvailability(
                      availability.map((a) =>
                        a.day_of_week === day.day_of_week
                          ? { ...a, end_time: e.target.value }
                          : a
                      )
                    )
                  }
                  className="rounded-lg border border-border/60 bg-background px-2 py-1.5 text-sm"
                />
                <Switch
                  checked={day.is_available}
                  onCheckedChange={() =>
                    setAvailability(
                      availability.map((a) =>
                        a.day_of_week === day.day_of_week
                          ? { ...a, is_available: !a.is_available }
                          : a
                      )
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </form>
    </CrudFormDialog>
  );
}
