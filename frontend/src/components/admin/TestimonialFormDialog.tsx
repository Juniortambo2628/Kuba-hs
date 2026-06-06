"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";
import type { Testimonial } from "@/types/admin";

export type TestimonialFormValues = {
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  image_url: string;
};

const emptyForm = (): TestimonialFormValues => ({
  client_name: "",
  client_role: "",
  content: "",
  rating: 5,
  image_url: "",
});

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: number | null;
  initial?: Partial<TestimonialFormValues>;
  order?: number;
  onSuccess: (item?: Testimonial) => void;
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  editingId,
  initial,
  order = 0,
  onSuccess,
}: TestimonialFormDialogProps) {
  const [form, setForm] = useState<TestimonialFormValues>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm(),
      client_name: initial?.client_name ?? "",
      client_role: initial?.client_role ?? "",
      content: initial?.content ?? "",
      rating: initial?.rating ?? 5,
      image_url: initial?.image_url ?? "",
    });
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/api/admin/testimonials/${editingId}`, form);
        toast.success("Testimonial updated");
        onOpenChange(false);
        onSuccess();
      } else {
        const res = await axiosInstance.post("/api/admin/testimonials", {
          ...form,
          order,
        });
        toast.success("Testimonial created");
        onOpenChange(false);
        onSuccess(res.data);
      }
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
      introTitle={editingId ? "Edit endorsement" : "Add endorsement"}
      introDescription="Client quotes shown on the landing page. Set rating and avatar before publishing."
      formId="admin-testimonial-form"
      submitLabel={editingId ? "Save changes" : "Create endorsement"}
      isSubmitting={isSaving}
    >
      <form id="admin-testimonial-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>Client name</FieldLabel>
            <Input
              required
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Role / designation</FieldLabel>
            <Input
              value={form.client_role}
              onChange={(e) => setForm({ ...form, client_role: e.target.value })}
              placeholder="CEO, Homeowner"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Testimonial</FieldLabel>
          <Textarea
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="min-h-[120px] rounded-xl resize-y"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Rating (1–5)</FieldLabel>
          <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-border/50">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 5)) })
              }
              className="w-12 bg-transparent font-semibold text-center outline-none"
            />
          </div>
        </div>

        <DashboardImageUpload
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          type="avatar"
          label="Client avatar (optional)"
        />
      </form>
    </CrudFormDialog>
  );
}
