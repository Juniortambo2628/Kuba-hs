"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import { useCrudForm } from "@/hooks/useCrudForm";

export interface FaqFormValues {
  question: string;
  answer: string;
  avatar: string;
  is_active: boolean;
  order: number;
}

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
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<FaqFormValues>({
    empty: () => ({ question: "", answer: "", avatar: "", is_active: true, order: 0 }),
    endpoint: "/api/admin/faqs",
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
      introTitle={editingId ? "Edit FAQ entry" : "Create FAQ entry"}
      introDescription="Questions and answers shown on the public help center. Set order and visibility before publishing."
      formId="admin-faq-form"
      submitLabel={editingId ? "Save changes" : "Publish entry"}
      isSubmitting={isSaving}
    >
      <form id="admin-faq-form" onSubmit={onSubmit} className="space-y-5">
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
