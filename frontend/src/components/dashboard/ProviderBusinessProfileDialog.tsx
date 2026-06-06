"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

const LocationPickerMap = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[220px] rounded-xl" />,
});

export type ProviderBusinessForm = {
  business_name: string;
  bio: string;
  location_name: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  experience_years: number;
  service_radius: number;
  specialized_skills: string[];
};

interface ProviderBusinessProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProviderBusinessForm;
  onSuccess: () => void | Promise<void>;
}

export function ProviderBusinessProfileDialog({
  open,
  onOpenChange,
  initial,
  onSuccess,
}: ProviderBusinessProfileDialogProps) {
  const [form, setForm] = useState<ProviderBusinessForm>(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const skillsText = Array.isArray(form.specialized_skills)
    ? form.specialized_skills.join(", ")
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/provider/profile", {
        business_name: form.business_name,
        bio: form.bio,
        location_name: form.location_name,
        phone: form.phone,
        latitude: form.latitude,
        longitude: form.longitude,
        experience_years: form.experience_years,
        service_radius: form.service_radius,
        specialized_skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Profile saved");
      onOpenChange(false);
      await onSuccess();
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
      introTitle="Edit business profile"
      introDescription="Update how clients see your business on the marketplace, including your service area on the map."
      formId="provider-business-form"
      submitLabel="Save changes"
      isSubmitting={isSaving}
    >
      <form id="provider-business-form" onSubmit={handleSubmit} className="space-y-6 max-h-[55vh] overflow-y-auto kuba-scroll pr-1">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Business details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel>Business name</FieldLabel>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className={workspaceUi.input}
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Phone</FieldLabel>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={workspaceUi.input}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Base city</FieldLabel>
              <input
                type="text"
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                className={workspaceUi.input}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel>Bio</FieldLabel>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={workspaceUi.textarea}
                rows={4}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel>Skills & keywords</FieldLabel>
              <input
                type="text"
                value={skillsText}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specialized_skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className={workspaceUi.input}
                placeholder="welding, solar, plumbing"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Years of experience</FieldLabel>
              <input
                type="number"
                min={0}
                value={form.experience_years}
                onChange={(e) =>
                  setForm({ ...form, experience_years: Number(e.target.value) || 0 })
                }
                className={workspaceUi.input}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Service radius (km)</FieldLabel>
              <input
                type="number"
                min={1}
                value={form.service_radius}
                onChange={(e) =>
                  setForm({ ...form, service_radius: Number(e.target.value) || 10 })
                }
                className={workspaceUi.input}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/40">
          <h4 className="text-sm font-semibold text-foreground">Service area</h4>
          <div className="rounded-xl overflow-hidden border border-border/50">
            <LocationPickerMap
              position={
                form.latitude && form.longitude
                  ? [form.latitude, form.longitude]
                  : null
              }
              onChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
              radius={form.service_radius}
            />
          </div>
        </div>
      </form>
    </CrudFormDialog>
  );
}
