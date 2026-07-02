"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export type ScheduleException = {
  date: string;
  is_closed: boolean;
  start_time: string;
  end_time: string;
  reason?: string;
};

interface AvailabilityExceptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ScheduleException[];
  onSuccess: () => void;
}

export function AvailabilityExceptionsDialog({
  open,
  onOpenChange,
  initial,
  onSuccess,
}: AvailabilityExceptionsDialogProps) {
  const [exceptions, setExceptions] = useState<ScheduleException[]>(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setExceptions(initial);
  }, [open, initial]);

  const addException = () => {
    setExceptions([
      ...exceptions,
      {
        date: new Date().toISOString().split("T")[0],
        is_closed: true,
        start_time: "09:00",
        end_time: "17:00",
        reason: "Time off",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.put("/api/provider/availability/exceptions", { exceptions });
      toast.success("Date exceptions saved");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to update exceptions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CrudFormDialog
      open={open}
      onOpenChange={onOpenChange}
      introTitle="Date exceptions"
      introDescription="Block holidays or set custom hours for specific dates. These override your weekly schedule."
      formId="availability-exceptions-form"
      submitLabel="Save exceptions"
      isSubmitting={isSaving}
    >
      <form id="availability-exceptions-form" onSubmit={handleSubmit} className="space-y-4">
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addException}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add date
        </Button>

        {exceptions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No exceptions yet</p>
        ) : (
          <ul className="space-y-3 max-h-[45vh] overflow-y-auto kuba-scroll pr-1">
            {exceptions.map((exc, idx) => (
              <li key={idx} className={cn(workspaceUi.frosted.inset, "p-4 space-y-3")}>
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="date"
                    value={exc.date?.split("T")[0] ?? exc.date}
                    onChange={(e) =>
                      setExceptions(
                        exceptions.map((item, i) =>
                          i === idx ? { ...item, date: e.target.value } : item
                        )
                      )
                    }
                    className="text-sm font-medium bg-transparent outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setExceptions(exceptions.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available this day</span>
                  <Switch
                    checked={!exc.is_closed}
                    onCheckedChange={(val) =>
                      setExceptions(
                        exceptions.map((item, i) =>
                          i === idx ? { ...item, is_closed: !val } : item
                        )
                      )
                    }
                  />
                </div>
                {!exc.is_closed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={exc.start_time}
                      onChange={(e) =>
                        setExceptions(
                          exceptions.map((item, i) =>
                            i === idx ? { ...item, start_time: e.target.value } : item
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-border/60 px-2 py-1.5 text-sm"
                    />
                    <span className="text-muted-foreground">–</span>
                    <input
                      type="time"
                      value={exc.end_time}
                      onChange={(e) =>
                        setExceptions(
                          exceptions.map((item, i) =>
                            i === idx ? { ...item, end_time: e.target.value } : item
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-border/60 px-2 py-1.5 text-sm"
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={exc.reason || ""}
                  onChange={(e) =>
                    setExceptions(
                      exceptions.map((item, i) =>
                        i === idx ? { ...item, reason: e.target.value } : item
                      )
                    )
                  }
                  className={workspaceUi.input}
                />
              </li>
            ))}
          </ul>
        )}
      </form>
    </CrudFormDialog>
  );
}
