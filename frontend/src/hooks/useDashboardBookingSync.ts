"use client";

import { useEffect } from "react";
import { loadEcho } from "@/lib/echo-loader";
import { mutate } from "swr";
import { toast } from "sonner";

/** Real-time booking updates for client/provider dashboards (no full page reload). */
export function useDashboardBookingSync(userId: string | undefined, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !userId) return;

    let disposed = false;
    let leave: (() => void) | undefined;

    loadEcho().then((echo) => {
      if (disposed || !echo) return;

      echo.leave(`user.${userId}`);
      const channel = echo.private(`user.${userId}`);
      channel.listen(".booking.updated", (e: { booking?: { booking_number?: string; status?: string } }) => {
        const b = e.booking;
        toast.info(
          `Booking #${b?.booking_number ?? ""} has been updated to ${b?.status ?? "updated"}`
        );
        mutate("/api/client/dashboard");
        mutate("/api/provider/dashboard");
        mutate((key) => typeof key === "string" && key.includes("/api/bookings/"));
      });

      leave = () => {
        echo.leave(`user.${userId}`);
      };
    }).catch(() => {});

    return () => {
      disposed = true;
      leave?.();
    };
  }, [userId, enabled]);
}
