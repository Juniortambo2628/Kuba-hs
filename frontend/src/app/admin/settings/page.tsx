"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Save, 
  Loader2, 
  Layout, 
  Globe, 
  CreditCard, 
  ShieldCheck, 
  Image as ImageIcon,
  Activity,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Star,
  Navigation
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FAQManager } from "./components/FAQManager";
import { TestimonialManager } from "./components/TestimonialManager";
import { NavigationManager } from "./components/NavigationManager";

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

interface Metadata {
    environment: string;
    version: string;
    maintenance_mode: boolean;
}

const GROUP_LABELS: Record<string, { label: string, icon: any, color: string }> = {
    'branding': { label: 'Platform Identity', icon: Globe, color: 'text-blue-500' },
    'hero': { label: 'Hero Experience', icon: Sparkles, color: 'text-amber-500' },
    'payment': { label: 'Financial Gateways', icon: CreditCard, color: 'text-emerald-500' },
    'config': { label: 'System Guard', icon: SettingsIcon, color: 'text-indigo-500' },
    'about': { label: 'Brand Story', icon: Layout, color: 'text-rose-500' },
    'sections': { label: 'Site Content', icon: Layout, color: 'text-purple-500' },
    'social': { label: 'Digital Presence', icon: Activity, color: 'text-sky-500' }
};

export default function UnifiedSettingsPage() {
    const [settings, setSettings] = useState<Record<string, Setting[]>>({});
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api$/, '');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/settings");
            setSettings(res.data.settings);
            setMetadata(res.data.metadata);
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

            await axiosInstance.post("/api/admin/settings", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.success("Synchronized! Site settings updated.");
            fetchSettings();
            setFiles({});
        } catch (err) {
            toast.error(handleApiError(err));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-8 animate-pulse">
                <div className="h-12 w-64 bg-muted rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
                    </div>
                    <div className="lg:col-span-9 space-y-6">
                        {[1, 2].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    const groups = Object.keys(settings).sort((a, b) => {
        const order = ['branding', 'hero', 'payment', 'config', 'about', 'sections', 'social'];
        return order.indexOf(a) - order.indexOf(b);
    });

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20 p-4 md:p-8">
            {/* Control Center Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white dark:bg-zinc-900 shadow-sm border border-border/40 p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Zap className="w-5 h-5 fill-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Platform CMS</h1>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Secure system-wide configuration terminal
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 relative z-10">
                    <Button asChild variant="outline" className="rounded-2xl border-border h-14 px-6 font-bold text-[11px] tracking-widest uppercase hover:bg-muted transition-all">
                        <Link href="/" target="_blank" className="flex items-center gap-2.5">
                            <ExternalLink className="w-4 h-4" />
                            Live Preview
                        </Link>
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="rounded-2xl bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-white dark:hover:text-black h-14 px-10 font-bold text-[11px] tracking-widest uppercase shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all gap-3"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Commit Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={groups[0]} orientation="vertical" className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-3 xl:col-span-3 space-y-8 sticky top-24">
                        <div className="bg-white dark:bg-zinc-900 border border-border/40 rounded-[2rem] p-4 shadow-sm overflow-hidden">
                            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 ml-4 mt-2">Configuration Clusters</h2>
                            <TabsList className="bg-transparent flex flex-col w-full h-auto p-0 space-y-1.5 items-stretch border-none shadow-none">
                                {groups.map(group => {
                                    const info = GROUP_LABELS[group] || { label: group.replace('_', ' '), icon: Layout, color: 'text-zinc-500' };
                                    return (
                                        <TabsTrigger 
                                            key={group} 
                                            value={group} 
                                            className="group relative justify-start px-5 py-4 rounded-2xl text-[13px] font-bold data-[state=active]:bg-primary/[0.08] data-[state=active]:text-primary text-muted-foreground hover:bg-muted/50 transition-all flex items-center gap-4 border-none shadow-none text-left"
                                        >
                                            <div className={`p-2 rounded-xl transition-colors ${info.color} bg-background group-data-[state=active]:bg-primary group-data-[state=active]:text-white shadow-sm`}>
                                                <info.icon className="w-4 h-4" />
                                            </div>
                                            <span className="flex-1 truncate">{info.label}</span>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:translate-x-1 transition-all" />
                                        </TabsTrigger>
                                    );
                                })}
                                <TabsTrigger value="faqs" className="group relative justify-start px-5 py-4 rounded-2xl text-[13px] font-bold data-[state=active]:bg-primary/[0.08] data-[state=active]:text-primary text-muted-foreground hover:bg-muted/50 transition-all flex items-center gap-4 border-none shadow-none text-left">
                                    <div className="p-2 rounded-xl transition-colors text-purple-500 bg-background group-data-[state=active]:bg-primary group-data-[state=active]:text-white shadow-sm">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 truncate">FAQ Management</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:translate-x-1 transition-all" />
                                </TabsTrigger>
                                <TabsTrigger value="testimonials" className="group relative justify-start px-5 py-4 rounded-2xl text-[13px] font-bold data-[state=active]:bg-primary/[0.08] data-[state=active]:text-primary text-muted-foreground hover:bg-muted/50 transition-all flex items-center gap-4 border-none shadow-none text-left">
                                    <div className="p-2 rounded-xl transition-colors text-amber-500 bg-background group-data-[state=active]:bg-primary group-data-[state=active]:text-white shadow-sm">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 truncate">Testimonials</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:translate-x-1 transition-all" />
                                </TabsTrigger>
                                <TabsTrigger value="navigation" className="group relative justify-start px-5 py-4 rounded-2xl text-[13px] font-bold data-[state=active]:bg-primary/[0.08] data-[state=active]:text-primary text-muted-foreground hover:bg-muted/50 transition-all flex items-center gap-4 border-none shadow-none text-left">
                                    <div className="p-2 rounded-xl transition-colors text-rose-500 bg-background group-data-[state=active]:bg-primary group-data-[state=active]:text-white shadow-sm">
                                        <Navigation className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 truncate">Site Navigation</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:translate-x-1 transition-all" />
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* System Metadata Card */}
                        {metadata && (
                            <div className="bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group/meta">
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mb-16 -mr-16 blur-2xl" />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Terminal Pulse</span>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Version Manifest</span>
                                        <span className="text-xl font-black tracking-tight">{metadata.version}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Environment</span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400">
                                                <Activity className="w-3 h-3" />
                                                {metadata.environment}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Health Status</span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400">
                                                <ShieldCheck className="w-3 h-3" />
                                                Active
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-9 xl:col-span-9 focus:outline-none min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {groups.map(group => (
                                <TabsContent key={group} value={group} className="mt-0 focus:outline-none">
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 gap-8">
                                            {settings[group].map((setting) => (
                                                <Card key={setting.id} className="border border-border/40 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow overflow-hidden group/card">
                                                    <div className="px-8 py-8 md:px-10 md:py-10 border-b border-border/30 bg-muted/5">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-1.5 h-6 bg-primary rounded-full group-hover/card:scale-y-110 transition-transform" />
                                                                    <CardTitle className="text-lg font-black text-foreground uppercase tracking-tight">
                                                                        {setting.label || setting.key.replace(/_/g, ' ')}
                                                                    </CardTitle>
                                                                </div>
                                                                <CardDescription className="text-sm font-medium text-muted-foreground ml-4">
                                                                    {setting.description || `Configuring the ${setting.key.replace(/_/g, ' ')} for the platform.`}
                                                                </CardDescription>
                                                            </div>
                                                            <div className="px-5 py-2.5 bg-background rounded-2xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                                <Zap className="w-3.5 h-3.5" />
                                                                {setting.type} Property
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <CardContent className="px-8 py-10 md:px-10 md:p-12">
                                                        <div className="space-y-6">
                                                            {setting.type === 'textarea' ? (
                                                                <div className="relative">
                                                                    <textarea 
                                                                        className="w-full min-h-[160px] bg-muted/20 border border-border/50 rounded-3xl px-6 py-6 text-foreground text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none leading-relaxed"
                                                                        value={setting.value || ""}
                                                                        onChange={(e) => handleValueChange(group, setting.id, e.target.value)}
                                                                        placeholder={`Enter deployment payload for ${setting.key}...`}
                                                                    />
                                                                </div>
                                                            ) : setting.type === 'image' ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                                                                    <div className="md:col-span-2 space-y-4">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <ImageIcon className="w-4 h-4 text-primary" />
                                                                            <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Active Asset</span>
                                                                        </div>
                                                                        <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-border/60 bg-muted/20 flex items-center justify-center group/asset p-4">
                                                                            {setting.image_url ? (
                                                                                <img 
                                                                                    src={setting.image_url.startsWith('http') ? setting.image_url : `${BACKEND_URL}${setting.image_url}`} 
                                                                                    alt={setting.label} 
                                                                                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover/asset:scale-105" 
                                                                                />
                                                                            ) : (
                                                                                <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
                                                                                    <div className="p-4 bg-muted/50 rounded-full">
                                                                                        <ImageIcon className="w-10 h-10" />
                                                                                    </div>
                                                                                    <span className="text-[10px] font-black uppercase tracking-widest">No Asset Deployed</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="md:col-span-3 space-y-4">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Activity className="w-4 h-4 text-primary" />
                                                                            <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Update Stream</span>
                                                                        </div>
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
                                                                            labelIdle='Drop professional asset or <span class="filepond--label-action">Browse System</span>'
                                                                            className="settings-upload-pond"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors">
                                                                        {setting.key.includes('email') ? <Mail className="w-5 h-5" /> : 
                                                                         setting.key.includes('phone') ? <Phone className="w-5 h-5" /> :
                                                                         setting.key.includes('address') ? <MapPin className="w-5 h-5" /> :
                                                                         <SettingsIcon className="w-5 h-5" />}
                                                                    </div>
                                                                    <Input 
                                                                        className="h-16 bg-muted/20 border-border/50 pl-16 pr-8 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all rounded-2xl shadow-sm border-2"
                                                                        value={setting.value || ""}
                                                                        onChange={(e) => handleValueChange(group, setting.id, e.target.value)}
                                                                        maxLength={255}
                                                                    />
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex justify-between items-center bg-muted/10 p-4 rounded-2xl border border-border/30">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-2 w-2 relative">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Real-time Status</span>
                                                                </div>
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest tabular-nums">
                                                                    {setting.value?.length || 0} <span className="text-muted-foreground/40 mx-1">/</span> 255
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            ))}
                        </AnimatePresence>

                        <TabsContent value="faqs" className="mt-0 focus:outline-none">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                                <FAQManager />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="testimonials" className="mt-0 focus:outline-none">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                                <TestimonialManager />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="navigation" className="mt-0 focus:outline-none">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                                <NavigationManager />
                            </motion.div>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
