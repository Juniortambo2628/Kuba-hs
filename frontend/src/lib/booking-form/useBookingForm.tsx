"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export interface BookingFormData {
  provider_id: string;
  service_id: string;
  service_type: string;
  quantity: number;
  scheduled_date: string;
  scheduled_time?: string;
  description?: string;
}

export const bookingFormSchema = z.object({
  provider_id: z.string().min(1, "Provider is required"),
  service_id: z.string().min(1, "Service is required"),
  service_type: z.string().min(1, "Service type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  scheduled_date: z.string().min(1, "Date is required"),
  scheduled_time: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters").optional(),
});

export function useBookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      provider_id: '',
      service_id: '',
      service_type: 'residential',
      quantity: 1,
      scheduled_date: '',
      scheduled_time: undefined,
      description: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (onSuccess: (data: BookingFormData) => void) => {
    setIsSubmitting(true);
    try {
      await form.handleSubmit(async (data) => {
        await onSuccess(data);
      })();
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset();
    setIsDirty(false);
  }, [form]);

  return {
    form,
    isSubmitting,
    isDirty,
    handleSubmit,
    resetForm,
    setIsDirty,
  };
}