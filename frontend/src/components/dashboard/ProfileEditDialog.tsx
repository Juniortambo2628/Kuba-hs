"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { FieldLabel } from "@/components/shared/ui";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

export interface ProfileFormValues {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProfileFormValues;
  saveUrl: string;
  saveMethod?: "put" | "post";
  onSuccess: () => void | Promise<void>;
  title?: string;
  description?: string;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  initial,
  saveUrl,
  saveMethod = "put",
  onSuccess,
  title = "Edit profile",
  description = "Update how your name and contact details appear across the platform.",
}: ProfileEditDialogProps) {
  const [form, setForm] = useState<ProfileFormValues>(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (saveMethod === "post") {
        await axiosInstance.post(saveUrl, form);
      } else {
        await axiosInstance.put(saveUrl, form);
      }
      toast.success("Profile updated");
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
      introTitle={title}
      introDescription={description}
      formId="profile-edit-form"
      submitLabel="Save changes"
      isSubmitting={isSaving}
    >
      <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>First name</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className={cn(workspaceUi.input, "pl-10")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Last name</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className={cn(workspaceUi.input, "pl-10")}
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <FieldLabel>Email</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn(workspaceUi.input, "pl-10")}
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <FieldLabel>Phone</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={cn(workspaceUi.input, "pl-10")}
              />
            </div>
          </div>
        </div>
      </form>
    </CrudFormDialog>
  );
}
