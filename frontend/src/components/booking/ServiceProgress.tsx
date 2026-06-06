"use client";

import { BookingStatusProgress } from "@/components/bookings/BookingStatusProgress";

interface ServiceProgressProps {
  status: string;
}

export function ServiceProgress({ status }: ServiceProgressProps) {
  return <BookingStatusProgress status={status} compact />;
}
