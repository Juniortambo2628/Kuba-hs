"use client";

import { useState, useMemo, useEffect } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import {
  Mail,
  Search,
  Edit3,
  Save,
  ChevronRight,
  Info,
  Code,
  FileText,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useData } from "@/hooks/useData";
import { EmailTemplate } from "@/types";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";

const SYSTEM_TEMPLATE_KEYS = new Set([
  "booking_confirmation_customer",
  "booking_confirmation_provider",
  "booking_status_updated_customer",
  "booking_status_updated_provider",
  "payment_received_customer",
  "new_review_received_provider",
  "investor_inquiry_admin_alert",
]);

interface AvailableKey {
  key: string;
  label: string;
  description: string;
  exists: boolean;
}

const emptyCreateForm = () => ({
  key: "",
  name: "",
  subject: "",
  body: "# Hello {{name}}\n\nYour message here.",
  variables: "",
});

export default function AdminEmailTemplatesPage() {
  const { data: templates, isLoading, refetch: fetchTemplates } = useData<EmailTemplate[]>(
    "/api/admin/email-templates",
    { initialData: [] }
  );
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [availableKeys, setAvailableKeys] = useState<AvailableKey[]>([]);

  useEffect(() => {
    axiosInstance
      .get<AvailableKey[]>("/api/admin/email-templates/available-keys")
      .then((res) => setAvailableKeys(res.data))
      .catch(() => {});
  }, []);

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return templates;
    return templates.filter(
      (t) => t.name.toLowerCase().includes(q) || t.key.toLowerCase().includes(q)
    );
  }, [templates, search]);

  const handleUpdate = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    try {
      await axiosInstance.put(`/api/admin/email-templates/${selectedTemplate.id}`, {
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
      });
      toast.success("Template updated successfully");
      fetchTemplates();
    } catch {
      toast.error("Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const variables = createForm.variables
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const res = await axiosInstance.post("/api/admin/email-templates", {
        key: createForm.key.trim().toLowerCase().replace(/\s+/g, "_"),
        name: createForm.name.trim(),
        subject: createForm.subject.trim(),
        body: createForm.body,
        variables,
      });

      const created = res.data.template as EmailTemplate;
      toast.success("Template created");
      setCreateOpen(false);
      setCreateForm(emptyCreateForm());
      await fetchTemplates();
      setSelectedTemplate(created);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/api/admin/email-templates/${deleteId}`);
      toast.success("Template deleted");
      if (selectedTemplate?.id === deleteId) setSelectedTemplate(null);
      setDeleteId(null);
      fetchTemplates();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const canDelete =
    selectedTemplate && !SYSTEM_TEMPLATE_KEYS.has(selectedTemplate.key);

  return (
    <DashboardPageContainer width="wide" className="h-full flex flex-col space-y-10 animate-in fade-in duration-500 pb-8">
      <DashboardPageHeader
        title="Email Core System"
        subtitle="Design and personalize automated system notifications and transactional triggers."
      >
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold gap-2">
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create email template</DialogTitle>
              <DialogDescription>
                Select a system template key or choose "Custom" to create your own.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Template key</Label>
                <Select
                  value={createForm.key}
                  onValueChange={(value) => {
                    const selected = availableKeys.find((k) => k.key === value);
                    setCreateForm({
                      ...createForm,
                      key: value,
                      name: selected?.label || createForm.name,
                    });
                  }}
                >
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select a template key..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKeys.map((ak) => (
                      <SelectItem
                        key={ak.key}
                        value={ak.key}
                        disabled={ak.exists}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{ak.label}</span>
                          {ak.exists && (
                            <Badge variant="secondary" className="text-[9px] ml-auto">
                              <Check className="w-3 h-3 mr-1" />
                              exists
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.key && availableKeys.find((k) => k.key === createForm.key) && (
                  <p className="text-[10px] text-muted-foreground">
                    {availableKeys.find((k) => k.key === createForm.key)?.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Display name</Label>
                  <Input
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="Welcome Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Subject</Label>
                  <Input
                    value={createForm.subject}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, subject: e.target.value })
                    }
                    placeholder="Hello {{name}}"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Body (Markdown)</Label>
                <Textarea
                  value={createForm.body}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, body: e.target.value })
                  }
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Variables (comma-separated)</Label>
                <Input
                  value={createForm.variables}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, variables: e.target.value })
                  }
                  placeholder="name, email, dashboard_url"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={
                  isCreating ||
                  !createForm.key.trim() ||
                  !createForm.name.trim() ||
                  !createForm.subject.trim() ||
                  !createForm.body.trim()
                }
                className="rounded-xl font-bold w-full"
              >
                {isCreating ? "Creating…" : "Create template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardPageHeader>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        <div className="w-full lg:w-1/3 bg-card/50 backdrop-blur-md rounded-[2rem] border-none shadow-sm flex flex-col overflow-hidden relative">
          <div className="p-6 border-b border-border/40 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-white border-border rounded-xl text-xs"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
              ))
            ) : (
              filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border group ${
                    selectedTemplate?.id === t.id
                      ? "bg-transparent border-transparent text-primary shadow-none"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5 ${
                          selectedTemplate?.id === t.id
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="text-[11px] font-bold tracking-tight leading-normal mb-0.5">
                          {t.name}
                        </div>
                        <div className="text-[9px] font-black opacity-50 uppercase tracking-[0.05em] truncate">
                          {t.key}
                          {SYSTEM_TEMPLATE_KEYS.has(t.key) && (
                            <span className="ml-1 text-primary">• system</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 mt-2 shrink-0 transition-transform ${
                        selectedTemplate?.id === t.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 bg-card/50 backdrop-blur-md rounded-[2rem] border-none shadow-sm flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedTemplate ? (
              <motion.div
                key={selectedTemplate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="p-8 border-b border-border flex items-center justify-between shrink-0 gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                      <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        {selectedTemplate.name}
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold bg-muted border-none text-muted-foreground"
                      >
                        {SYSTEM_TEMPLATE_KEYS.has(selectedTemplate.key)
                          ? "System template (protected)"
                          : "Custom template"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteId(selectedTemplate.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 px-6 rounded-xl font-bold border-border gap-2"
                        >
                          <Search className="w-4 h-4" />
                          Live Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl h-[80vh] bg-card p-0 overflow-hidden flex flex-col border-border/60">
                        <DialogTitle className="sr-only">Live Delivery Preview</DialogTitle>
                        <div className="px-6 py-4 bg-muted/30 border-b border-border/60 flex items-center justify-between">
                          <h4 className="text-[11px] font-bold text-muted-foreground">
                            Live Delivery Preview
                          </h4>
                          <Badge className="bg-white text-muted-foreground border-border text-[9px] font-bold">
                            Branded Output
                          </Badge>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-card">
                          <div className="max-w-md mx-auto space-y-8">
                            <div className="flex justify-center border-b border-border pb-8">
                              <img
                                src="/assets/Kuba-Header-footter-Logo-for-Light-Mode.png"
                                alt="Kuba"
                                className="h-10 w-auto object-contain dark:hidden"
                              />
                              <img
                                src="/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png"
                                alt="Kuba"
                                className="h-10 w-auto object-contain hidden dark:block"
                              />
                            </div>
                            <div className="prose prose-sm prose-sky max-w-none">
                              {selectedTemplate.body.split("\n").map((line, i) => {
                                let processed = line;
                                if (line.startsWith("# "))
                                  return (
                                    <h1
                                      key={i}
                                      className="text-xl font-semibold text-foreground border-b border-border pb-2 mb-4 uppercase tracking-tight"
                                    >
                                      {line.replace("# ", "")}
                                    </h1>
                                  );
                                if (line.startsWith("**") && line.endsWith("**"))
                                  return (
                                    <p key={i} className="font-bold text-foreground">
                                      {line.replace(/\*\*/g, "")}
                                    </p>
                                  );

                                if (selectedTemplate.variables) {
                                  selectedTemplate.variables.forEach((v) => {
                                    processed = processed.replace(
                                      new RegExp(`\\{\\{${v}\\}\\}`, "g"),
                                      `<span class="bg-sky-100 text-primary px-1 rounded font-bold">${v}</span>`
                                    );
                                  });
                                }

                                return (
                                  <div
                                    key={i}
                                    className="text-muted-foreground text-[13px] leading-relaxed mb-1 min-h-[1.5em]"
                                    dangerouslySetInnerHTML={{ __html: processed }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="bg-primary hover:bg-black text-white font-bold rounded-xl h-12 px-8 flex gap-2 shadow-lg shadow-primary/10 transition-all"
                    >
                      {isSaving ? (
                        <Save className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Publish Changes</span>
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Subject Line Architecture
                    </label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={(e) =>
                        setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                      }
                      className="h-12 bg-muted/50 border-border rounded-xl font-bold text-sm focus:bg-white transition-all text-foreground"
                      placeholder="Enter subject line..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Template Body (Markdown)
                      </label>
                      <Textarea
                        value={selectedTemplate.body}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, body: e.target.value })
                        }
                        className="min-h-[450px] bg-muted/30 border-border/60 rounded-2xl text-sm font-mono p-8 focus:bg-white transition-all text-foreground"
                        placeholder="Start writing your email template..."
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                        <Info className="absolute -right-2 -bottom-2 w-24 h-24 text-primary/10" />
                        <h4 className="text-[11px] font-bold text-primary mb-5 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Available Dynamic Variables
                        </h4>
                        <div className="flex wrap gap-2 relative z-10">
                          {selectedTemplate.variables?.map((v) => (
                            <Badge
                              key={v}
                              className="bg-white text-primary border-primary/10 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                            >
                              {"{{"}
                              {v}
                              {"}}"}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-4 text-[10px] text-sky-500/80 leading-relaxed font-bold">
                          Use these identifiers in your subject or body. They will be replaced
                          with real data when the email is sent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center text-muted-foreground/30 shadow-inner">
                  <Mail className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Select Communication Dispatch
                </h3>
                <p className="max-w-[280px] text-xs font-bold text-muted-foreground leading-relaxed">
                  Choose a template from the list or create a new one for custom workflows.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AppConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete email template?"
        description="This template will be removed permanently. System templates cannot be deleted."
        confirmLabel="Delete"
      />
    </DashboardPageContainer>
  );
}
