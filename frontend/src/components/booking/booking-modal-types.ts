import type { ReactNode } from "react";
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

export interface BookingNewAddress {
  address_type: "home" | "work" | "other";
  street_address: string;
  apartment: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export interface BookingAddress {
  id: string | number;
  street_address: string;
  city: string;
  address_type?: string;
  apartment?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
}

export interface BookingConfigOption {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface BookingFormConfig {
  typeLabel: string;
  typeOptions: BookingConfigOption[];
  quantityLabel: string;
  quantityHint: string;
  getQuantityBadge: (type: string) => string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
}
