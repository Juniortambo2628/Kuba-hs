"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import { useCrudForm } from "@/hooks/useCrudForm";

export type CategoryFormValues = {
  name: string;
  description: string;
  image_url: string;
};

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
  initial?: Partial<CategoryFormValues>;
  onSuccess: () => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  categoryId,
  initial,
  onSuccess,
}: CategoryFormDialogProps) {
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<CategoryFormValues>({
    empty: () => ({ name: "", description: "", image_url: "" }),
    endpoint: "/api/admin/categories",
    editingId: categoryId,
    initial,
    preparePayload: (f) => ({
      name: f.name,
      description: f.description,
      image_url: f.image_url || null,
    }),
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
      introTitle={categoryId ? "Edit category" : "New category"}
      introDescription="Categories group services on the marketplace. Thumbnails are cropped to 800×600 on upload."
      formId="admin-category-form"
      submitLabel={categoryId ? "Save category" : "Create category"}
      isSubmitting={isSaving}
    >
      <form id="admin-category-form" onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Category name</FieldLabel>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Home Cleaning"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Description</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the category scope…"
            className="min-h-[100px] rounded-xl resize-y"
          />
        </div>
        <DashboardImageUpload
          label="Category thumbnail"
          type="category_thumbnail"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
        />
      </form>
    </CrudFormDialog>
  );
}
