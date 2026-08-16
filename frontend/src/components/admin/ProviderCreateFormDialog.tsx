"use client";

import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { useCrudForm } from "@/hooks/useCrudForm";

export interface ProviderCreateFormValues {
  business_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location_name: string;
}

interface ProviderCreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProviderCreateFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: ProviderCreateFormDialogProps) {
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<ProviderCreateFormValues>({
    empty: () => ({ business_name: "", first_name: "", last_name: "", email: "", password: "", location_name: "" }),
    endpoint: "/api/admin/providers",
    editingId: null,
  });

  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <CrudFormDialog
      open={open}
      onOpenChange={onOpenChange}
      introTitle="Create Provider Account"
      introDescription="Register a new service provider on the platform."
      formId="admin-provider-create-form"
      submitLabel="Create Provider"
      isSubmitting={isSaving}
    >
      <form id="admin-provider-create-form" onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Business Name</FieldLabel>
          <Input
            required
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            placeholder="e.g. Kuba Cleaning Services"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>First Name</FieldLabel>
            <Input
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="John"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Last Name</FieldLabel>
            <Input
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Doe"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="provider@example.com"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Password</FieldLabel>
          <Input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 8 characters"
            minLength={8}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Location</FieldLabel>
          <Input
            value={form.location_name}
            onChange={(e) => setForm({ ...form, location_name: e.target.value })}
            placeholder="e.g. Nairobi, Kenya"
            className="h-11 rounded-xl"
          />
        </div>
      </form>
    </CrudFormDialog>
  );
}
