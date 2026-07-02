"use client";

import { Check, Circle, Clock, CreditCard, Loader2, XCircle } from "lucide-react";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "pending", label: "Requested", hint: "Awaiting provider", icon: Clock },
  { id: "confirmed", label: "Confirmed", hint: "Provider accepted", icon: Check },
  { id: "in_progress", label: "In progress", hint: "Service underway", icon: Loader2 },
  { id: "completed", label: "Complete", hint: "Job finished", icon: Check },
] as const;

interface BookingStatusProgressProps {
  status: string;
  paymentStatus?: string;
  compact?: boolean;
  className?: string;
}

function stepIndex(status: string, paymentStatus?: string): number {
  if (status === "cancelled") return -1;
  if (status === "completed") return 3;
  if (status === "in_progress") return 2;
  if (status === "confirmed") return paymentStatus === "paid" ? 2 : 1;
  return 0;
}

export function BookingStatusProgress({
  status,
  paymentStatus,
  compact,
  className,
}: BookingStatusProgressProps) {
  const current = stepIndex(status, paymentStatus);

  if (status === "cancelled") {
    return (
      <div
        className={cn(
          workspaceUi.frosted.inset,
          "flex items-center gap-3 p-4 border-red-500/20",
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
          <XCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Booking cancelled</p>
          <p className="text-xs text-muted-foreground">This request is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(compact ? "py-2" : "py-4", className)}>
      <div className="relative flex justify-between gap-2">
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-border/60 -z-0 mx-6"
          aria-hidden
        />
        <div
          className="absolute top-5 left-6 h-0.5 bg-primary transition-all duration-700 -z-0"
          style={{
            width:
              current <= 0
                ? "0%"
                : `calc(${(current / (STEPS.length - 1)) * 100}% - 3rem)`,
          }}
          aria-hidden
        />

        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center flex-1 min-w-0 relative z-10"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border-2 border-background transition-all",
                  done || active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {done ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <Icon className={cn("h-4 w-4", active && step.id === "in_progress" && "animate-spin")} />
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-[10px] font-bold uppercase tracking-wide",
                  active || done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {!compact && (
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                  {step.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {paymentStatus === "paid" && status !== "completed" && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center mt-3">
          Payment received
        </p>
      )}
    </div>
  );
}
