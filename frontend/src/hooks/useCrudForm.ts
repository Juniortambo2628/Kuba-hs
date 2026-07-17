"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

interface UseCrudFormOptions<T> {
  empty: () => T;
  endpoint: string;
  editingId: string | number | null;
  initial?: Partial<T>;
  /** Transform form data before sending to API (e.g., strip extra fields) */
  preparePayload?: (form: T) => Record<string, unknown>;
  /** Extra payload fields to merge on create (e.g., { category_id }) */
  extraCreatePayload?: Record<string, unknown>;
}

interface UseCrudFormReturn<T> {
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Shared CRUD form state management.
 * Eliminates the重复 useState + useEffect + handleSubmit pattern across admin form dialogs.
 */
export function useCrudForm<T extends object>({
  empty,
  endpoint,
  editingId,
  initial,
  preparePayload,
  extraCreatePayload,
}: UseCrudFormOptions<T>): UseCrudFormReturn<T> {
  const emptyRef = useRef(empty);
  emptyRef.current = empty;

  const [form, setForm] = useState<T>(empty);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({ ...emptyRef.current(), ...initial } as T);
  }, [editingId, initial]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        const payload = preparePayload ? preparePayload(form) : form;

        if (editingId) {
          await axiosInstance.put(`${endpoint}/${editingId}`, payload);
          toast.success("Updated successfully");
        } else {
          await axiosInstance.post(endpoint, { ...payload, ...extraCreatePayload });
          toast.success("Created successfully");
        }
      } catch (err: unknown) {
        toast.error(handleApiError(err));
      } finally {
        setIsSaving(false);
      }
    },
    [form, editingId, endpoint, preparePayload, extraCreatePayload]
  );

  return { form, setForm, isSaving, handleSubmit };
}
