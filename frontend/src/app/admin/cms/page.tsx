"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Globe, Info, Mail, Share2, ShieldCheck, Zap, Activity, PenTool, Layout, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { handleApiError } from "@/lib/axios";

registerPlugin(FilePondPluginImagePreview);

interface Setting {
    id: string;
    key: string;
    value: string;
    label: string;
    type: string;
    group: string;
    description?: string | null;
    image_url?: string | null;
}

export default function AdminCMS() {
    const [settings, setSettings] = useState<Record<string, Setting[]>>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/cms");
            setSettings(res.data.settings);
        } catch (err) {
            toast.error(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleValueChange = (group: string, id: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [group]: prev[group].map(s => s.id === id ? { ...s, value } : s)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            const allSettings = Object.values(settings).flat();
            
            allSettings.forEach((s, index) => {
                formData.append(`settings[${index}][id]`, s.id);
                formData.append(`settings[${index}][value]`, s.value || "");
                
                if (s.type === 'image' && files[s.id]) {
                    formData.append(`settings[${index}][file]`, files[s.id]);
                }
            });

            await axiosInstance.post("/api/admin/cms", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.success("Deployment successful! Platform environment updated.");
            fetchSettings();
            setFiles({});
        } catch (err) {
            console.error("CMS Save Error:", err);
            toast.error(handleApiError(err));
            // Reset files on error too if they are causing issues, or at least stop the spinner
            setFiles({}); 
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
              <Skeleton className="h-12 w-64 rounded-2xl" />
              <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
            </div>
        );
    }

    const groups = Object.keys(settings);

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
            {/* CMS Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2 text-glow-red">
                    <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                        Content <span className="text-sky-600">Commander</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Platform-wide global content and structural configuration.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" className="h-14 border-gray-100 bg-white text-[#1E293B] hover:bg-gray-50 rounded-2xl font-black px-8 transition-all uppercase tracking-widest text-[11px]">
                        <Link href="/" target="_blank" className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" /> Preview Site
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-14 border-gray-100 bg-white text-[#1E293B] hover:bg-gray-50 rounded-2xl font-black px-8 transition-all uppercase tracking-widest text-[11px]">
                        <Link href="/admin/blog" className="flex items-center gap-2">
                            <PenTool className="w-4 h-4" /> Editorial Blog
                        </Link>
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] group">
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />}
                        Deploy Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={groups[0]} className="w-full">
                <TabsList className="bg-white/50 backdrop-blur-md border border-gray-50 p-2 mb-10 rounded-2xl inline-flex shadow-sm">
                    {groups.map(group => (
                        <TabsTrigger 
                            key={group} 
                            value={group} 
                            className="capitalize px-8 py-3 rounded-xl font-black text-[10px] tracking-widest data-[state=active]:bg-[#1E293B] data-[state=active]:text-white transition-all"
                        >
                            {group.replace('_', ' ')}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {groups.map(group => (
                    <TabsContent key={group} value={group}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {settings[group].map(setting => (
                                <Card key={setting.id} className="premium-card group border-none overflow-hidden hover:bg-sky-50/5 transition-all duration-700">
                                    <div className="p-1.5 bg-gray-50 group-hover:bg-sky-600 transition-colors"></div>
                                    <CardHeader className="p-10 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xs font-black text-[#1E293B] uppercase tracking-[0.2em]">{setting.label}</CardTitle>
                                                <CardDescription className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter italic">Key: {setting.key}</CardDescription>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] group-hover:scale-110 transition-transform">
                                                <Layout className="w-5 h-5 opacity-40" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-10 pt-0">
                                        <div className="space-y-4">
                                            {setting.type === 'textarea' ? (
                                                <textarea 
                                                    className="w-full min-h-[150px] bg-[#F8FAFC] border-none rounded-[1.5rem] px-6 py-5 text-[#1E293B] text-[11px] font-bold font-mono outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none shadow-inner"
                                                    value={setting.value || ""}
                                                    onChange={(e) => handleValueChange(group, setting.id, e.target.value)}
                                                    placeholder={`Enter content for ${setting.label}...`}
                                                />
                                            ) : setting.type === 'image' ? (
                                                <div className="space-y-4">
                                                    {setting.image_url && (
                                                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center group/img">
                                                            <img 
                                                                src={setting.image_url.startsWith('http') ? setting.image_url : `${BACKEND_URL}${setting.image_url}`} 
                                                                alt={setting.label} 
                                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Replace with FilePond below</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <FilePond
                                                        files={files[setting.id] ? [files[setting.id]] : []}
                                                        onupdatefiles={(fileItems) => {
                                                            const file = fileItems[0]?.file as File | undefined;
                                                            if (file) {
                                                                setFiles(prev => ({ ...prev, [setting.id]: file }));
                                                            }
                                                        }}
                                                        allowMultiple={false}
                                                        maxFiles={1}
                                                        name={`file_${setting.id}`}
                                                        labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                                                        className="kuba-filepond"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative group/input">
                                                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-focus-within/input:text-sky-600 transition-colors" />
                                                    <Input 
                                                        className="h-16 pl-14 pr-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-bold text-[#1E293B] focus:ring-2 focus:ring-sky-100 transition-all shadow-inner"
                                                        value={setting.value || ""}
                                                        onChange={(e) => handleValueChange(group, setting.id, e.target.value)}
                                                        maxLength={255}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <p className="text-[9px] font-bold text-gray-300 italic flex items-center gap-1.5">
                                                    <Info className="w-3 h-3 text-sky-600" /> This setting controls frontend visibility.
                                                </p>
                                                {setting.type !== 'image' && (
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                                                        {setting.value?.length || 0} characters
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
