"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
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
  Image as ImageIcon,
  Sparkles,
  Navigation,
  Share2,
  BarChart3,
  Smartphone,
  Info,
  Home,
  Palette,
  Layers,
  Type,
  FileText,
  Trash2,
  X,
  Plus
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { motion, AnimatePresence } from "framer-motion";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useApiData } from "@/hooks/useApiData";
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

const ImageSettingCard = ({ 
    setting, 
    pendingFile, 
    onSetFile, 
    onRemove, 
    getMediaUrl 
}: { 
    setting: Setting, 
    pendingFile?: File, 
    onSetFile: (file: File) => void,
    onRemove: () => void,
    getMediaUrl: (url: string) => string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Resolve what to show
    const currentUrl = pendingFile ? URL.createObjectURL(pendingFile) : (setting.image_url ? getMediaUrl(setting.image_url) : null);

    return (
        <Card className="border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden group/media-card hover:border-primary/20 transition-all flex flex-col">
            <div className="p-4 border-b border-border/10 bg-muted/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[80%]">
                    {setting.label || setting.key.replace(/_/g, ' ')}
                </span>
                <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            
            <div className="relative aspect-video group/asset overflow-hidden bg-muted/5">
                {currentUrl ? (
                    <img 
                        src={currentUrl} 
                        alt={setting.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/media-card:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                        <Plus className="w-8 h-8" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Visual Set</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <ImageManagementDialog 
                        setting={setting}
                        pendingFile={pendingFile}
                        onSetFile={onSetFile}
                        onRemove={onRemove}
                        getMediaUrl={getMediaUrl}
                        isOpen={isOpen}
                        onOpenChange={setIsOpen}
                   />
                </div>
            </div>

            {pendingFile && (
                <div className="p-2 px-4 bg-primary/10 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">Pending Upload</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
            )}
        </Card>
    );
};

const ImageManagementDialog = ({ 
    setting, 
    pendingFile, 
    onSetFile, 
    onRemove, 
    getMediaUrl,
    isOpen,
    onOpenChange
}: { 
    setting: Setting, 
    pendingFile?: File, 
    onSetFile: (file: File) => void,
    onRemove: () => void,
    getMediaUrl: (url: string) => string,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const savedUrl = setting.image_url ? getMediaUrl(setting.image_url) : null;
    const previewUrl = pendingFile ? URL.createObjectURL(pendingFile) : null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full font-bold text-[10px] tracking-widest px-6 h-10 shadow-xl">
                    MANAGE ASSET
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 pb-4 bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Manage Asset</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        {setting.group.replace(/_/g, ' ')} / {setting.label || setting.key}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-8">
                    {/* Visual Comparison */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current State</label>
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted border border-border/10 shadow-inner group">
                                {previewUrl || savedUrl ? (
                                    <img 
                                        src={previewUrl || savedUrl || ""} 
                                        className="w-full h-full object-cover" 
                                        alt="Preview" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
                                        <div className="w-12 h-12 rounded-2xl bg-muted-foreground/5 flex items-center justify-center">
                                            <X className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">No visual configured</span>
                                    </div>
                                )}
                                {previewUrl && (
                                     <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                        Unsaved Change
                                     </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Update Content</label>
                            <div className="premium-dropzone">
                                <FilePond
                                    onupdatefiles={(fileItems) => {
                                        const file = fileItems[0]?.file as File | undefined;
                                        if (file) {
                                            onSetFile(file);
                                        }
                                    }}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    labelIdle='<div class="flex flex-col items-center gap-2"><div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><div class="flex flex-col"><span class="text-foreground font-black uppercase text-[10px] tracking-widest mb-1">Upload New Asset</span><span class="text-[9px] text-muted-foreground/50 tracking-tight font-medium">Drag & Drop or <span class="text-primary">Browse Files</span></span></div></div>'
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 pt-0 flex-col sm:flex-row gap-4">
                    {(previewUrl || savedUrl) && (
                        <Button 
                            variant="destructive" 
                            size="lg"
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-2xl text-[10px] font-black tracking-widest h-14 px-8 group/trash transition-all"
                            onClick={() => {
                                onRemove();
                                onOpenChange(false);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2 group-hover/trash:animate-bounce" />
                            REMOVE ASSET
                        </Button>
                    )}
                    <div className="flex-1" />
                    <Button 
                        variant="outline" 
                        size="lg"
                        className="rounded-2xl text-[10px] font-black tracking-widest h-14 px-10 border-border dark:border-white/10"
                        onClick={() => onOpenChange(false)}
                    >
                        CANCEL
                    </Button>
                    <Button 
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-[10px] font-black tracking-widest h-14 px-12 shadow-xl shadow-primary/20"
                        onClick={() => onOpenChange(false)}
                    >
                        APPLY CHANGE
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface Metadata {
    environment: string;
    version: string;
    maintenance_mode: boolean;
}

const GROUP_CONFIG: Record<string, { label: string, icon: any, category: string, description: string }> = {
    // ── Brand & Identity ──
    'identity': { label: 'Brand Identity', icon: Globe, category: 'brand', description: 'Logos, favicons, and site branding.' },
    'social_links': { label: 'Social Links', icon: Share2, category: 'brand', description: 'Social media handles and platform links.' },

    // ── Hero Visuals ──
    'hero_backgrounds': { label: 'Backgrounds', icon: ImageIcon, category: 'hero', description: 'Hero background images for all page sections.' },
    'hero_text': { label: 'Titles & Copy', icon: Type, category: 'hero', description: 'Headlines, subtitles, and badge text for hero banners.' },

    // ── Content ──
    'home_hero': { label: 'Landing — Hero', icon: Sparkles, category: 'content', description: 'Homepage headline, subtitle, and call-to-action button.' },
    'about_page': { label: 'Landing — How We Operate', icon: Info, category: 'content', description: 'Three-step process cards, images, and section headings.' },
    'site_stats': { label: 'Landing — Impact Metrics', icon: BarChart3, category: 'content', description: 'Numerical counters showing platform growth.' },
    'market_narratives': { label: 'Pages — Section Content', icon: Layout, category: 'content', description: 'Body text for featured sections and portals.' },

    // ── System & Config ──
    'support_info': { label: 'Contact & Support', icon: Smartphone, category: 'system', description: 'Contact emails, phone numbers, and addresses.' },
    'financial_config': { label: 'Fees & Payments', icon: CreditCard, category: 'system', description: 'Platform fees, currency settings, and payout thresholds.' },
};

export default function UnifiedSettingsPage() {
    const { data: settingsData, isLoading, refetch: fetchSettings, setData: setSettingsData } = useApiData<any>("/api/admin/settings");
    const settings = settingsData?.settings || {} as Record<string, Setting[]>;
    const metadata = settingsData?.metadata || null as Metadata | null;

    const [files, setFiles] = useState<Record<string, File>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState("brand");

    const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB threshold
    const MAX_IMAGE_WIDTH = 1920;
    const COMPRESS_QUALITY = 0.8;

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            if (file.size <= MAX_IMAGE_SIZE || file.type === 'image/svg+xml') {
                return resolve(file);
            }

            const img = new Image();
            const canvas = document.createElement('canvas');
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                let { width, height } = img;

                if (width > MAX_IMAGE_WIDTH) {
                    height = Math.round(height * (MAX_IMAGE_WIDTH / width));
                    width = MAX_IMAGE_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);

                const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(
                    (blob) => {
                        if (blob && blob.size < file.size) {
                            const compressed = new File([blob], file.name, { type: mimeType, lastModified: Date.now() });
                            console.log(`Compressed ${file.name}: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
                            resolve(compressed);
                        } else {
                            resolve(file);
                        }
                    },
                    mimeType,
                    COMPRESS_QUALITY
                );
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(file);
            };

            img.src = url;
        });
    };

    const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api$/, '');
    
    const getMediaUrl = (url: any) => {
        if (!url || typeof url !== 'string') {
            if (url && typeof url === 'object') {
                console.warn("getMediaUrl received an object instead of string:", url);
            }
            return "";
        }
        const finalUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
        // Only use /cms-assets/ proxy in local dev (artisan serve CORS workaround)
        if (finalUrl.includes('localhost') && finalUrl.includes('/storage/')) {
            return finalUrl.replace('/storage/', '/cms-assets/');
        }
        return finalUrl;
    };

    const handleValueChange = (group: string, id: string, value: string) => {
        setSettingsData((prev: any) => ({
            ...prev,
            settings: {
                ...prev.settings,
                [group]: (prev.settings[group] as Setting[]).map((s: Setting) => s.id === id ? { ...s, value } : s)
            }
        }));
    };

    const handleRemoveImage = (group: string, id: string) => {
        setSettingsData((prev: any) => ({
            ...prev,
            settings: {
                ...prev.settings,
                [group]: (prev.settings[group] as Setting[]).map((s: Setting) => s.id === id ? { ...s, value: "", image_url: null } : s)
            }
        }));
        setFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[id];
            return newFiles;
        });
        toast.info("Image marked for removal. Save changes to persist.");
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            const allSettings = Object.values(settings).flat() as Setting[];

            // Compress all pending image files first
            const compressedFiles: Record<string, File> = {};
            for (const [id, file] of Object.entries(files)) {
                compressedFiles[id] = await compressImage(file);
            }
            
            // Filter out json type settings (handled by their own components)
            const saveable = allSettings.filter(s => s.type !== 'json') as Setting[];
            
            saveable.forEach((s: Setting, index: number) => {
                formData.append(`settings[${index}][id]`, s.id);
                formData.append(`settings[${index}][value]`, s.value || "");
                
                if (s.type === 'image' && compressedFiles[s.id]) {
                    formData.append(`settings[${index}][file]`, compressedFiles[s.id]);
                }
            });

            await axiosInstance.post("/api/admin/settings", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
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
                <div className="h-10 w-64 bg-muted rounded-xl" />
                <div className="space-y-6">
                    <div className="h-14 w-full bg-muted rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    const getGroupsByCategory = (cat: string) => {
        return Object.entries(GROUP_CONFIG)
            .filter(([_, config]) => config.category === cat)
            .map(([groupId, config]) => ({
                id: groupId,
                ...config,
                settings: settings[groupId] || []
            }))
            .filter(group => group.settings.length > 0);
    };

    const categories = [
        { id: 'brand', label: 'Brand & Identity', icon: Palette },
        { id: 'hero', label: 'Hero Visuals', icon: Layers },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'system', label: 'System & Config', icon: SettingsIcon },
        { id: 'navigation', label: 'Navigation', icon: Navigation },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-20 p-4 md:p-6 bg-[#F8FAFC] dark:bg-black min-h-screen">
            <DashboardPageHeader 
                title="Platform Architecture" 
                subtitle="Consolidated site parameters, narratives, and global configurations."
            >
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="rounded-xl bg-primary text-white hover:bg-black h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Configuration
                </Button>
            </DashboardPageHeader>

            <Tabs defaultValue="brand" onValueChange={setActiveMainTab} className="w-full">
                <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar scroll-smooth">
                    <TabsList className="bg-transparent h-auto p-0 flex gap-8 border-b border-border/10 rounded-none w-full justify-start">
                        {categories.map(cat => (
                            <TabsTrigger 
                                key={cat.id}
                                value={cat.id} 
                                className="relative h-14 px-0 rounded-none bg-transparent data-[state=active]:bg-transparent text-muted-foreground data-[state=active]:text-primary font-bold text-sm border-b-2 border-transparent data-[state=active]:border-primary transition-all flex items-center gap-2.5 group whitespace-nowrap"
                            >
                                <cat.icon className="w-4.5 h-4.5" />
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {['brand', 'hero', 'content', 'system'].map(catId => (
                    <TabsContent key={catId} value={catId} className="mt-0 focus:outline-none">
                        <div className="space-y-12">
                            {getGroupsByCategory(catId).map(group => (
                                <section key={group.id} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-border/40 shadow-sm text-primary`}>
                                            <group.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight text-foreground">{group.label}</h3>
                                            <p className="text-xs font-medium text-muted-foreground">{group.description}</p>
                                        </div>
                                    </div>

                                    <div className={`grid grid-cols-1 ${group.id === 'hero_backgrounds' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-2'} gap-6`}>
                                        {group.settings.map((setting: Setting) => (
                                            <div key={setting.id}>
                                                {setting.type === 'image' ? (
                                                    <ImageSettingCard 
                                                        setting={setting}
                                                        pendingFile={files[setting.id]}
                                                        onSetFile={(file: File) => setFiles(prev => ({ ...prev, [setting.id]: file }))}
                                                        onRemove={() => handleRemoveImage(setting.group, setting.id)}
                                                        getMediaUrl={getMediaUrl}
                                                    />
                                                ) : (
                                                    <Card className="p-6 border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm space-y-3 hover:border-primary/20 transition-all">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate">
                                                                {setting.label || setting.key.replace(/_/g, ' ')}
                                                            </label>
                                                            <div className="p-1 px-2.5 bg-primary/5 rounded-lg text-[10px] font-bold text-primary/60 border border-primary/10">
                                                                {setting.key}
                                                            </div>
                                                        </div>
                                                        {setting.type === 'textarea' ? (
                                                            <textarea 
                                                                className="w-full min-h-[120px] bg-muted/5 border border-border/40 rounded-xl px-4 py-3 text-foreground text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none leading-relaxed"
                                                                value={setting.value || ""}
                                                                onChange={(e) => handleValueChange(setting.group, setting.id, e.target.value)}
                                                            />
                                                        ) : (
                                                            <Input 
                                                                className="h-12 bg-muted/5 border-border/40 px-4 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all rounded-xl"
                                                                value={setting.value || ""}
                                                                onChange={(e) => handleValueChange(setting.group, setting.id, e.target.value)}
                                                            />
                                                        )}
                                                        {setting.description && (
                                                            <p className="text-[10px] font-medium text-muted-foreground/60 italic px-1">
                                                                {setting.description}
                                                            </p>
                                                        )}
                                                    </Card>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </TabsContent>
                ))}

                <TabsContent value="navigation" className="mt-0 focus:outline-none">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-border/40 shadow-sm min-h-[600px]">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-foreground">Global Navigation Engine</h3>
                                <p className="text-sm font-medium text-muted-foreground">Manage header, footer, and utility links across the primary storefront.</p>
                            </div>
                        </div>
                        <NavigationManager />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Floating Environment Badge */}
            <div className="fixed bottom-8 right-8 z-50">
                {metadata && (
                    <div className="bg-zinc-900 dark:bg-zinc-800 text-white rounded-3xl p-3 px-6 shadow-2xl flex items-center gap-5 border border-white/10 backdrop-blur-3xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <span className="text-[11px] font-bold text-zinc-400">Node v{metadata.version}</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">{metadata.environment}</span>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .tight-pond .filepond--root {
                    margin-bottom: 0;
                    font-family: inherit;
                }
                .tight-pond .filepond--panel-root {
                    background-color: transparent !important;
                    border: 2px dashed rgba(0,0,0,0.08) !important;
                    border-radius: 16px;
                }
                .tight-pond .filepond--label-idle {
                    font-size: 11px;
                    font-weight: 800;
                    color: #64748b;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
