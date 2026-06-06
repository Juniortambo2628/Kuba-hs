"use client";

import { useData } from "@/hooks/useData";
import { normalizeApiResponse } from "@/lib/api-response";
import { Booking } from "@/types";

/** Fetches a booking and unwraps Laravel `{ booking }` envelopes */
export function useBookingDetail(bookingId: string | null) {
  const { data: raw, isLoading, mutate, isError } = useData<Booking | { booking: Booking }>(
    bookingId ? `/api/bookings/${bookingId}` : null
  );

  const normalized = raw ? normalizeApiResponse<Booking | { booking: Booking }>(raw) : null;
  const booking =
    normalized && typeof normalized === "object" && "booking" in normalized
      ? (normalized as { booking: Booking }).booking
      : (normalized as Booking | null);

  return {
    booking: booking ?? null,
    isLoading,
    refresh: () => mutate(),
    error: isError,
  };
}
