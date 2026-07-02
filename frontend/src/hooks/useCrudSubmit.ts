"use client";

import { useState, useCallback } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

interface UseCrudSubmitOptions<T> {
  /** Base URL for the resource (e.g. "/api/admin/faqs") */
  url: string;
  /** ID of the item being edited (null for create) */
  editingId: string | number | null;
  /** The form data to submit */
  form: T;
  /** Extra payload to merge into the form data before sending */
  extraPayload?: Record<string, unknown>;
  /** Callback after successful save */
  onSuccess?: (response?: unknown) => void;
  /** Callback to close the dialog */
  onOpenChange?: (open: boolean) => void;
  /** Custom success message (defaults to "Saved") */
  successMessage?: string;
  /** Custom create message */
  createMessage?: string;
  /** Custom update message */
  updateMessage?: string;
}

interface UseCrudSubmitReturn {
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Shared CRUD submit hook for admin form dialogs.
 * Encapsulates the try/catch, axiosInstance.put/post, toast, onOpenChange, onSuccess pattern.
 */
export function useCrudSubmit<T extends Record<string, unknown>>({
  url,
  editingId,
  form,
  extraPayload,
  onSuccess,
  onOpenChange,
  successMessage,
  createMessage,
  updateMessage,
}: UseCrudSubmitOptions<T>): UseCrudSubmitReturn {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        const payload = { ...form, ...extraPayload };
        if (editingId) {
          const res = await axiosInstance.put(`${url}/${editingId}`, payload);
          toast.success(updateMessage ?? successMessage ?? "Updated");
          onOpenChange?.(false);
          onSuccess?.(res?.data);
        } else {
          const res = await axiosInstance.post(url, payload);
          toast.success(createMessage ?? successMessage ?? "Created");
          onOpenChange?.(false);
          onSuccess?.(res?.data);
        }
      } catch (err: unknown) {
        toast.error(handleApiError(err));
      } finally {
        setIsSaving(false);
      }
    },
    [url, editingId, form, extraPayload, onSuccess, onOpenChange, successMessage, createMessage, updateMessage]
  );

  return { isSaving, handleSubmit };
}
