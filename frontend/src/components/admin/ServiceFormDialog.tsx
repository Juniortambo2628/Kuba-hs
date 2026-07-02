"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { KubaFilePond } from "@/components/ui/filepond";
import { useCrudForm } from "@/hooks/useCrudForm";
import { toast } from "sonner";

export type ServiceFormValues = {
  name: string;
  description: string;
};

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  serviceId: string | null;
  thumbnailUrl?: string;
  initial?: Partial<ServiceFormValues>;
  onSuccess: () => void;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  serviceId,
  thumbnailUrl,
  initial,
  onSuccess,
}: ServiceFormDialogProps) {
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<ServiceFormValues>({
    empty: () => ({ name: "", description: "" }),
    endpoint: "/api/admin/services",
    editingId: serviceId,
    initial,
    extraCreatePayload: { category_id: categoryId },
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
      introTitle={serviceId ? "Edit service" : `Add service to ${categoryName}`}
      introDescription="Offerings appear under this category on the marketplace. Upload a thumbnail after saving."
      formId="admin-service-form"
      submitLabel={serviceId ? "Save service" : "Add service"}
      isSubmitting={isSaving}
    >
      <form id="admin-service-form" onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Service name</FieldLabel>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Deep Carpet Cleaning"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Description</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Detail the specific offering…"
            className="min-h-[100px] rounded-xl resize-y"
          />
        </div>

        {serviceId ? (
          <div className="space-y-2">
            <FieldLabel>Thumbnail</FieldLabel>
            {thumbnailUrl && (
              <div className="w-full aspect-[4/3] max-w-[200px] rounded-xl overflow-hidden border border-border bg-muted">
                <img src={thumbnailUrl} alt={form.name} className="w-full h-full object-cover" />
              </div>
            )}
            <KubaFilePond
              modelType="service"
              modelId={serviceId}
              collection="thumbnail"
              label='Drag & drop thumbnail or <span class="filepond--label-action">Browse</span>'
              onSuccess={() => {
                toast.success("Thumbnail uploaded");
                onSuccess();
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground rounded-xl bg-muted/50 p-3">
            Save the service first, then edit it to upload a thumbnail.
          </p>
        )}
      </form>
    </CrudFormDialog>
  );
}
