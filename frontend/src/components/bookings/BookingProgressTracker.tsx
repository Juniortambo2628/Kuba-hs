"use client";

import { BookingStatusProgress } from "@/components/bookings/BookingStatusProgress";

interface BookingProgressTrackerProps {
  status: string;
  paymentStatus: string;
}

/** @deprecated Use BookingStatusProgress — kept for existing imports */
export function BookingProgressTracker({ status, paymentStatus }: BookingProgressTrackerProps) {
  return (
    <BookingStatusProgress status={status} paymentStatus={paymentStatus} />
  );
}
