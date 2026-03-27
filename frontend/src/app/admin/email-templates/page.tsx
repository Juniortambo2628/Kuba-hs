"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Mail, 
  Search, 
  Edit3, 
  Save, 
  ChevronRight,
  Info,
  Code,
  FileText,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useApiData } from "@/hooks/useApiData";
import { EmailTemplate } from "@/types";

export default function AdminEmailTemplatesPage() {
  const { data: templates, isLoading, refetch: fetchTemplates } = useApiData<EmailTemplate[]>("/api/admin/email-templates", { initialData: [] });
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    try {
      await axiosInstance.put(`/api/admin/email-templates/${selectedTemplate.id}`, {
        subject: selectedTemplate.subject,
        body: selectedTemplate.body
      });
      toast.success("Template updated successfully");
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-500 pb-8">
      {/* Standard Dashboard Header */}
      <DashboardPageHeader 
        title="Email Core System" 
        subtitle="Design and personalize automated system notifications and transactional triggers."
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* List */}
        <div className="w-full lg:w-1/3 bg-card/50 backdrop-blur-md rounded-[2rem] border-none shadow-sm flex flex-col overflow-hidden relative">
            <div className="p-6 border-b border-border/40 bg-muted/20">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input 
                        placeholder="Search templates..." 
                        className="pl-10 h-10 bg-white border-border rounded-xl text-xs"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />)
                ) : (
                    templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            className={`w-full text-left p-4 rounded-2xl transition-all border ${
                                selectedTemplate?.id === t.id 
                                ? "bg-muted/50 border-primary/20 text-primary shadow-sm" 
                                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/30"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTemplate?.id === t.id ? "bg-primary text-white" : "bg-gray-100 text-muted-foreground"}`}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold tracking-tight leading-none">{t.name}</div>
                                        <div className="text-[9px] font-bold opacity-60 mt-1 uppercase tracking-normal">{t.key}</div>
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${selectedTemplate?.id === t.id ? "rotate-90" : ""}`} />
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>

        {/* Editor */}
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
                        <div className="p-8 border-b border-border flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                    <Edit3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground tracking-tight">{selectedTemplate.name}</h2>
                                    <Badge variant="outline" className="text-[9px] font-bold bg-muted border-none text-muted-foreground">Template logic: Database record</Badge>
                                </div>
                            </div>
                            <Button 
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="bg-primary hover:bg-black text-white font-bold rounded-xl h-12 px-8 flex gap-2 shadow-lg shadow-primary/10 transition-all"
                            >
                                {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Publish Changes</span>
                            </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Subject Line Architecture
                                </label>
                                <Input 
                                    value={selectedTemplate.subject}
                                    onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                                    className="h-12 bg-muted/50 border-border rounded-xl font-bold text-sm focus:bg-white transition-all text-foreground"
                                    placeholder="Enter subject line..."
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        Template Body (Markdown)
                                    </label>
                                    <Textarea 
                                        value={selectedTemplate.body}
                                        onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
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
                                            {selectedTemplate.variables?.map(v => (
                                                <Badge key={v} className="bg-white text-primary border-primary/10 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                                    {"{{"}{v}{"}}"}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-[10px] text-sky-500/80 leading-relaxed font-bold">
                                            Use these identifiers in your subject or body. They will be replaced with real data when the email is sent.
                                        </p>
                                    </div>

                                    <div className="p-0 bg-muted/10 rounded-2xl border border-border/60 overflow-hidden flex flex-col h-full">
                                        <div className="px-6 py-4 bg-muted/30 border-b border-border/60 flex items-center justify-between">
                                            <h4 className="text-[11px] font-bold text-muted-foreground">Live Delivery Preview</h4>
                                            <Badge className="bg-white text-muted-foreground border-border text-[9px] font-bold">Branded Output</Badge>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-8 bg-card">
                                            <div className="max-w-md mx-auto space-y-8">
                                                {/* Branded Header */}
                                                <div className="flex justify-center border-b border-border pb-8">
                                                    <img src="/logo.png" alt="Kuba" className="h-10 w-auto" />
                                                </div>

                                                {/* Content Area */}
                                                <div className="prose prose-sm prose-sky max-w-none">
                                                    {selectedTemplate.body.split('\n').map((line, i) => {
                                                        // Simple MD replacement for preview
                                                        let processed = line;
                                                        if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-semibold text-gray-900 border-b border-border pb-2 mb-4 uppercase tracking-tight">{line.replace('# ', '')}</h1>;
                                                        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-800">{line.replace(/\*\*/g, '')}</p>;
                                                        
                                                        // Replace variables with sample data for preview
                                                        selectedTemplate.variables.forEach(v => {
                                                            processed = processed.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), `<span class="bg-sky-100 text-primary px-1 rounded font-bold">${v}</span>`);
                                                        });

                                                        return (
                                                            <div 
                                                                key={i} 
                                                                className="text-gray-600 text-[13px] leading-relaxed mb-1 min-h-[1.5em]"
                                                                dangerouslySetInnerHTML={{ __html: processed }}
                                                            />
                                                        );
                                                    })}
                                                </div>

                                                {/* Footer Component */}
                                                <div className="pt-12 border-t border-border text-center space-y-2">
                                                    <p className="text-[10px] text-muted-foreground font-bold">
                                                        © {new Date().getFullYear()} Kuba Architecture. All rights reserved.
                                                    </p>
                                                    <p className="text-[10px] text-primary font-bold cursor-pointer hover:underline">
                                                        Unsubscribe Preferences
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Select Communication Dispatch</h3>
                        <p className="max-w-[280px] text-xs font-bold text-muted-foreground leading-relaxed">
                            Choose an automated workflow from the audit list to begin designing its content architecture.
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
