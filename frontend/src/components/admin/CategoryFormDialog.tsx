"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

export type CategoryFormValues = {
  name: string;
  description: string;
  image_url: string;
};

const emptyCategory = (): CategoryFormValues => ({
  name: "",
  description: "",
  image_url: "",
});

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
  const [form, setForm] = useState<CategoryFormValues>(emptyCategory());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyCategory(),
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      image_url: initial?.image_url ?? "",
    });
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        image_url: form.image_url || null,
      };
      if (categoryId) {
        await axiosInstance.put(`/api/admin/categories/${categoryId}`, payload);
        toast.success("Category updated");
      } else {
        await axiosInstance.post("/api/admin/categories", payload);
        toast.success("Category created");
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
      introTitle={categoryId ? "Edit category" : "New category"}
      introDescription="Categories group services on the marketplace. Thumbnails are cropped to 800×600 on upload."
      formId="admin-category-form"
      submitLabel={categoryId ? "Save category" : "Create category"}
      isSubmitting={isSaving}
    >
      <form id="admin-category-form" onSubmit={handleSubmit} className="space-y-5">
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
