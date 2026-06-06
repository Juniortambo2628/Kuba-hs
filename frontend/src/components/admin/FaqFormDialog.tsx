"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";

export interface FaqFormValues {
  question: string;
  answer: string;
  avatar: string;
  is_active: boolean;
  order: number;
}

const emptyFaq = (order = 0): FaqFormValues => ({
  question: "",
  answer: "",
  avatar: "",
  is_active: true,
  order,
});

interface FaqFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: number | null;
  initial?: Partial<FaqFormValues>;
  onSuccess: () => void;
}

export function FaqFormDialog({
  open,
  onOpenChange,
  editingId,
  initial,
  onSuccess,
}: FaqFormDialogProps) {
  const [form, setForm] = useState<FaqFormValues>(emptyFaq());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyFaq(initial?.order ?? 0),
      ...initial,
      question: initial?.question ?? "",
      answer: initial?.answer ?? "",
      avatar: initial?.avatar ?? "",
      is_active: initial?.is_active ?? true,
      order: initial?.order ?? 0,
    });
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/api/admin/faqs/${editingId}`, form);
        toast.success("FAQ updated");
      } else {
        await axiosInstance.post("/api/admin/faqs", form);
        toast.success("FAQ published");
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
      introTitle={editingId ? "Edit FAQ entry" : "Create FAQ entry"}
      introDescription="Questions and answers shown on the public help center. Set order and visibility before publishing."
      formId="admin-faq-form"
      submitLabel={editingId ? "Save changes" : "Publish entry"}
      isSubmitting={isSaving}
    >
      <form id="admin-faq-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Question</FieldLabel>
          <Input
            required
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="How do I book a service?"
            className="h-11 rounded-xl"
          />
        </div>

        <DashboardImageUpload
          value={form.avatar}
          onChange={(url) => setForm({ ...form, avatar: url })}
          type="avatar"
          label="Avatar (optional)"
        />

        <div className="space-y-2">
          <FieldLabel>Answer</FieldLabel>
          <Textarea
            required
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Provide a clear resolution…"
            className="min-h-[140px] rounded-xl resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <FieldLabel>Display order</FieldLabel>
            <Input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })
              }
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Published</p>
              <p className="text-xs text-muted-foreground">Visible on the site</p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
            />
          </div>
        </div>
      </form>
    </CrudFormDialog>
  );
}
