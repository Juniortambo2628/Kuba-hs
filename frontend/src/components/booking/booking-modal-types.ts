import type { UseFormReturn } from "react-hook-form";

export interface BookingValues {
  service_type: string;
  quantity: number;
  address_id: string;
  description: string;
  scheduled_date: string;
  scheduled_time: string;
  promo_code?: string;
}

export type BookingForm = UseFormReturn<BookingValues>;
