"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { RichTextEditor } from "@/components/shared/ui/RichTextEditor";
import { useCrudForm } from "@/hooks/useCrudForm";

export interface BlogPostFormValues {
  title: string;
  content: string;
  excerpt: string;
  is_published: boolean;
}

interface BlogPostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  initial?: Partial<BlogPostFormValues>;
  onSuccess: () => void;
}

export function BlogPostFormDialog({
  open,
  onOpenChange,
  editingId,
  initial,
  onSuccess,
}: BlogPostFormDialogProps) {
  const { form, setForm, isSaving, handleSubmit } = useCrudForm<BlogPostFormValues>({
    empty: () => ({ title: "", content: "", excerpt: "", is_published: false }),
    endpoint: "/api/admin/blog",
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
      introTitle={editingId ? "Edit Article" : "New Article"}
      introDescription="Create and publish editorial content for the marketplace."
      formId="admin-blog-form"
      submitLabel={editingId ? "Save changes" : "Publish Article"}
      isSubmitting={isSaving}
    >
      <form id="admin-blog-form" onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Title</FieldLabel>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Article title..."
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Excerpt</FieldLabel>
          <Input
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Brief summary..."
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Content</FieldLabel>
          <RichTextEditor
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            placeholder="Write your article content..."
            minHeight="min-h-[200px]"
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Publish immediately</p>
            <p className="text-xs text-muted-foreground">Visible on the site</p>
          </div>
          <Switch
            checked={form.is_published}
            onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
          />
        </div>
      </form>
    </CrudFormDialog>
  );
}
