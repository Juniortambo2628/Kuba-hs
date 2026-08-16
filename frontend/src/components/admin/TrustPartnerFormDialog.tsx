"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import { useCrudForm } from "@/hooks/useCrudForm";

export interface TrustPartnerFormValues {
  name: string;
  logo_path: string;
  is_active: boolean;
}

interface TrustPartnerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  initial?: Partial<TrustPartnerFormValues>;
  onSuccess: () => void;
}

export function TrustPartnerFormDialog({
  open,
  onOpenChange,
  editingId,
  initial,
  onSuccess,
}: TrustPartnerFormDialogProps) {
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<TrustPartnerFormValues>({
    empty: () => ({ name: "", logo_path: "", is_active: true }),
    endpoint: "/api/admin/trust-partners",
    editingId,
    initial,
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
      introTitle={editingId ? "Edit Partner" : "New Partner"}
      introDescription="Manage brand logos displayed on the landing page."
      formId="admin-trust-partner-form"
      submitLabel={editingId ? "Save changes" : "Add Partner"}
      isSubmitting={isSaving}
    >
      <form id="admin-trust-partner-form" onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Partner Name</FieldLabel>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Safaricom"
            className="h-11 rounded-xl"
          />
        </div>

        <DashboardImageUpload
          value={form.logo_path}
          onChange={(url) => setForm({ ...form, logo_path: url })}
          type="logo"
          label="Partner Brand Logo"
        />

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Visible on site</p>
            <p className="text-xs text-muted-foreground">Show this partner on the landing page</p>
          </div>
          <Switch
            checked={form.is_active}
            onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
          />
        </div>
      </form>
    </CrudFormDialog>
  );
}
