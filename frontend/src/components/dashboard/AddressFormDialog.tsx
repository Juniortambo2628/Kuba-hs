"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import type { ClientAddress } from "@/components/dashboard/workspace/ClientAddressCard";
import { workspaceUi } from "@/lib/dashboard-ui";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[240px] rounded-xl" />,
});

export type AddressFormValues = {
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
};

export const emptyAddressForm = (): AddressFormValues => ({
  address_type: "home",
  street_address: "",
  apartment: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Kenya",
  latitude: null,
  longitude: null,
  is_default: false,
});

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  /** Omit to create; pass a saved address to edit it. */
  address?: ClientAddress | null;
}

function toFormValues(address: ClientAddress): AddressFormValues {
  return {
    address_type: (address.address_type as AddressFormValues["address_type"]) ?? "home",
    street_address: address.street_address ?? "",
    apartment: address.apartment ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postal_code: address.postal_code ?? "",
    country: address.country || "Kenya",
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
    // Kept, not reset: writing false here would demote a default address.
    is_default: address.is_default ?? false,
  };
}

export function AddressFormDialog({
  open,
  onOpenChange,
  onSuccess,
  address,
}: AddressFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<AddressFormValues>(emptyAddressForm());

  useEffect(() => {
    if (!open) return;
    setForm(address ? toFormValues(address) : emptyAddressForm());
    // address?.id only - the parent rebuilds the object every render.
  }, [open, address?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        state: form.state.trim() || form.city.trim() || "Kenya",
      };
      if (address) {
        // No pin fallback here: an edit must store what the form shows, so a
        // null pin stays null instead of jumping to Nairobi.
        await axiosInstance.put(`/api/client/addresses/${address.id}`, payload);
        toast.success("Address updated");
      } else {
        await axiosInstance.post("/api/client/addresses", {
          ...payload,
          latitude: form.latitude ?? -1.2921,
          longitude: form.longitude ?? 36.8219,
        });
        toast.success("Address saved");
      }
      handleOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CrudFormDialog
      open={open}
      onOpenChange={handleOpenChange}
      introTitle={address ? "Edit saved address" : "Add a saved address"}
      introDescription={
        address
          ? "Update this location. Providers will use it for bookings that point here."
          : "Providers use this location when you book. Pin the map for accurate routing."
      }
      formId="client-address-form"
      submitLabel={address ? "Save changes" : "Save address"}
      isSubmitting={isSaving}
    >
      <form id="client-address-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <FieldLabel>Street address</FieldLabel>
            <input
              required
              value={form.street_address}
              onChange={(e) => setForm({ ...form, street_address: e.target.value })}
              className={workspaceUi.input}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Apartment / unit</FieldLabel>
            <input
              value={form.apartment}
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              className={workspaceUi.input}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>City</FieldLabel>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={workspaceUi.input}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>County / region</FieldLabel>
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={workspaceUi.input}
              placeholder="e.g. Nairobi County"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Postal code</FieldLabel>
            <input
              required
              value={form.postal_code}
              onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
              className={workspaceUi.input}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FieldLabel>Map location</FieldLabel>
          <div className="rounded-xl overflow-hidden border border-border/50">
            <LocationPicker
              position={
                form.latitude && form.longitude
                  ? [form.latitude, form.longitude]
                  : null
              }
              onChange={(lat, lng) =>
                setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
              }
            />
          </div>
        </div>
      </form>
    </CrudFormDialog>
  );
}
