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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/email-templates");
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">Email Core System</h1>
          <p className="text-gray-500 text-sm">Design and personalize automated system notifications.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* List */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search templates..." 
                        className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-xs"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)
                ) : (
                    templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            className={`w-full text-left p-4 rounded-2xl transition-all border ${
                                selectedTemplate?.id === t.id 
                                ? "bg-sky-50 border-sky-100 text-sky-600 shadow-sm" 
                                : "bg-white border-transparent text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTemplate?.id === t.id ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black uppercase tracking-tight leading-none">{t.name}</div>
                                        <div className="text-[9px] font-bold opacity-60 mt-1 uppercase tracking-widest">{t.key}</div>
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
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
                {selectedTemplate ? (
                    <motion.div 
                        key={selectedTemplate.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full"
                    >
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-200">
                                    <Edit3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-[#1E293B] uppercase tracking-tight">{selectedTemplate.name}</h2>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase bg-gray-100 border-none text-gray-400">Template Logic: Database</Badge>
                                </div>
                            </div>
                            <Button 
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl h-11 px-6 flex gap-2 shadow-lg shadow-sky-100"
                            >
                                {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>PUBLISH CHANGES</span>
                            </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    Subject Line
                                </label>
                                <Input 
                                    value={selectedTemplate.subject}
                                    onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                                    className="h-12 bg-gray-50/50 border-gray-100 rounded-xl font-bold text-sm focus:bg-white transition-all text-[#1E293B]"
                                    placeholder="Enter subject line..."
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Code className="w-3 h-3" />
                                        Template Body (Markdown)
                                    </label>
                                    <Textarea 
                                        value={selectedTemplate.body}
                                        onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
                                        className="min-h-[400px] bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-mono p-6 focus:bg-white transition-all text-[#1E293B]"
                                        placeholder="Start writing your email template..."
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100 relative overflow-hidden">
                                        <Info className="absolute -right-2 -bottom-2 w-24 h-24 text-sky-200/40" />
                                        <h4 className="text-[11px] font-black text-sky-600 uppercase mb-4 flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Available Variables
                                        </h4>
                                        <div className="flex flex-wrap gap-2 relative z-10">
                                            {selectedTemplate.variables?.map(v => (
                                                <Badge key={v} className="bg-white text-sky-600 border-sky-100 text-[10px] font-black px-3 py-1 rounded-lg shadow-sm">
                                                    {"{{"}{v}{"}}"}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-[10px] text-sky-500/80 leading-relaxed font-bold">
                                            Use these identifiers in your subject or body. They will be replaced with real data when the email is sent.
                                        </p>
                                    </div>

                                    <div className="p-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full">
                                        <div className="px-6 py-4 bg-gray-100/50 border-b border-gray-100 flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Live Email Preview</h4>
                                            <Badge className="bg-white text-gray-400 border-gray-200 text-[9px]">Branded: Kuba</Badge>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                                            <div className="max-w-md mx-auto space-y-8">
                                                {/* Branded Header */}
                                                <div className="flex justify-center border-b border-gray-50 pb-8">
                                                    <img src="/logo.png" alt="Kuba" className="h-10 w-auto" />
                                                </div>

                                                {/* Content Area */}
                                                <div className="prose prose-sm prose-sky max-w-none">
                                                    {selectedTemplate.body.split('\n').map((line, i) => {
                                                        // Simple MD replacement for preview
                                                        let processed = line;
                                                        if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 uppercase tracking-tight">{line.replace('# ', '')}</h1>;
                                                        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-800">{line.replace(/\*\*/g, '')}</p>;
                                                        
                                                        // Replace variables with sample data for preview
                                                        selectedTemplate.variables.forEach(v => {
                                                            processed = processed.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), `<span class="bg-sky-100 text-sky-600 px-1 rounded font-bold">${v}</span>`);
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
                                                <div className="pt-12 border-t border-gray-50 text-center space-y-2">
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        © {new Date().getFullYear()} Kuba. All rights reserved.
                                                    </p>
                                                    <p className="text-[9px] text-sky-500 font-bold uppercase tracking-widest cursor-pointer hover:underline">
                                                        Unsubscribe
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
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Mail className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-black text-gray-400 uppercase tracking-tight leading-none">Select a template</h3>
                        <p className="max-w-[240px] text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Choose an automated automated flow from the list to begin designing its content.
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
