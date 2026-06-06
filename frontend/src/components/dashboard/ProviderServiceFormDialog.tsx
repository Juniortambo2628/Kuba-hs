"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { cn } from "@/lib/utils";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";
import type { ProviderService, Service } from "@/types";

const emptyForm = () => ({
  service_id: "",
  base_price: "",
  pricing_type: "fixed" as "fixed" | "hourly",
  min_hours: "1",
  travel_fee: "0",
  equipment_included: false,
});

interface ProviderServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: ProviderService | null;
  availableServices: Service[];
  linkedServiceIds: Set<string>;
  onSuccess: () => void;
}

export function ProviderServiceFormDialog({
  open,
  onOpenChange,
  editing,
  availableServices,
  linkedServiceIds,
  onSuccess,
}: ProviderServiceFormDialogProps) {
  const [form, setForm] = useState(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        service_id: String(editing.service_id),
        base_price: String(editing.base_price ?? ""),
        pricing_type: (editing.pricing_type as "fixed" | "hourly") || "fixed",
        min_hours: String(editing.min_hours ?? 1),
        travel_fee: String(editing.travel_fee ?? 0),
        equipment_included: !!editing.equipment_included,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, editing]);

  const catalogOptions = useMemo(() => {
    if (editing) return availableServices;
    return availableServices.filter((s) => !linkedServiceIds.has(String(s.id)));
  }, [availableServices, linkedServiceIds, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !form.service_id) {
      toast.error("Select a service from the catalog");
      return;
    }
    if (form.base_price === "") {
      toast.error("Enter a price");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        service_id: form.service_id,
        base_price: Number(form.base_price),
        pricing_type: form.pricing_type,
        min_hours: Number(form.min_hours) || 1,
        travel_fee: Number(form.travel_fee) || 0,
        equipment_included: form.equipment_included,
      };

      if (editing) {
        await axiosInstance.put(`/api/provider/services/${editing.id}`, payload);
        toast.success("Service updated");
      } else {
        await axiosInstance.post("/api/provider/services", payload);
        toast.success("Service added to your profile");
      }
      onOpenChange(false);
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
      onOpenChange={onOpenChange}
      introTitle={editing ? "Edit service offering" : "Add a service offering"}
      introDescription="Choose a catalog service and set your rates. Clients see these prices when booking you on the marketplace."
      formId="provider-service-form"
      submitLabel={editing ? "Save changes" : "Add to profile"}
      isSubmitting={isSaving}
    >
      <form id="provider-service-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <FieldLabel>Catalog service</FieldLabel>
          <select
            className={cn(
              "w-full h-11 rounded-xl border border-border/60 bg-muted/30 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/15",
              editing && "opacity-70 cursor-not-allowed"
            )}
            value={form.service_id}
            disabled={!!editing}
            onChange={(e) => setForm({ ...form, service_id: e.target.value })}
          >
            <option value="">Select a service…</option>
            {catalogOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.category?.name ? ` · ${s.category.name}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>Pricing model</FieldLabel>
            <select
              className="w-full h-11 rounded-xl border border-border/60 bg-muted/30 px-4 text-sm font-medium"
              value={form.pricing_type}
              onChange={(e) =>
                setForm({ ...form, pricing_type: e.target.value as "fixed" | "hourly" })
              }
            >
              <option value="fixed">Fixed price</option>
              <option value="hourly">Hourly rate</option>
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>
              {form.pricing_type === "hourly" ? "Price per hour (KES)" : "Base price (KES)"}
            </FieldLabel>
            <Input
              type="number"
              min={0}
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          {form.pricing_type === "hourly" && (
            <div className="space-y-2">
              <FieldLabel>Minimum hours</FieldLabel>
              <Input
                type="number"
                min={1}
                value={form.min_hours}
                onChange={(e) => setForm({ ...form, min_hours: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
          )}
          <div className="space-y-2">
            <FieldLabel>Travel fee (KES)</FieldLabel>
            <Input
              type="number"
              min={0}
              value={form.travel_fee}
              onChange={(e) => setForm({ ...form, travel_fee: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary"
            checked={form.equipment_included}
            onChange={(e) => setForm({ ...form, equipment_included: e.target.checked })}
          />
          <span className="text-sm font-medium">Equipment included in rate</span>
        </label>
      </form>
    </CrudFormDialog>
  );
}
