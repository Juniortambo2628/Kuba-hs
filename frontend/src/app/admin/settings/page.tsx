"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
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
  Palette,
  Layers,
  Type,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useData } from "@/hooks/useData";
import { compressImageFile } from "@/lib/image-compression";
import { useCMS } from "@/contexts/CMSContext";
import { NavigationManager } from "./components/NavigationManager";
import { resolveMediaUrl } from "@/lib/utils";
import { SettingsGroupSection } from "@/components/admin/settings/SettingsGroupSection";
import { SettingsPageContent } from "@/components/admin/settings/SettingsPageContent";
import type { Setting } from "@/components/admin/settings/types";
import type { LucideIcon } from "lucide-react";

interface Metadata {
    environment: string;
    version: string;
    maintenance_mode: boolean;
}

interface SettingsApiResponse {
    settings: Record<string, Setting[]>;
    metadata?: Metadata | null;
}

const GROUP_CONFIG: Record<string, { label: string; icon: LucideIcon; category: string; description: string }> = {
    // ── Brand & Identity ──
    'identity': { label: 'Brand Identity', icon: Globe, category: 'brand', description: 'Logos, favicons, and site branding.' },
    'social_links': { label: 'Social Links', icon: Share2, category: 'brand', description: 'Social media handles and platform links.' },

    // ── Hero Visuals ──
    'hero_backgrounds': { label: 'Backgrounds', icon: ImageIcon, category: 'hero', description: 'Default hero images per page (e.g. services_hero_image). Category/service pages use uploaded thumbnails when available.' },
    'hero_text': { label: 'Titles & Copy', icon: Type, category: 'hero', description: 'Headlines, subtitles, and badge text for hero banners.' },

    // ── Content ──
    'home_hero': { label: 'Landing — Hero', icon: Sparkles, category: 'content', description: 'Eyebrow, headline, stat line, search bar labels, and hero copy.' },
    'about_page': { label: 'How It Works', icon: Info, category: 'content', description: 'Section headline, intro, and three feature columns (step titles & descriptions).' },
    'payment': { label: 'Payment Gateway Keys', icon: CreditCard, category: 'system', description: 'Paystack/M-Pesa keys (stored in DB; use env for secrets in production).' },
    'site_stats': { label: 'Landing — Legacy counters', icon: BarChart3, category: 'content', description: 'Stat values used in the bottom CTA card (stat_1–4). The standalone “Why thousands trust” section was removed from the homepage.' },
    'landing_sections': { label: 'Landing — Section Headings', icon: Layout, category: 'content', description: 'Badges, titles, and subtitles for categories, services, providers, testimonials, and FAQ blocks.' },
    'cta': { label: 'Landing — Bottom CTA', icon: Sparkles, category: 'content', description: 'Final call-to-action copy and button labels.' },
    'market_narratives': { label: 'Pages — Section Content', icon: Layout, category: 'content', description: 'Corporate landing banner (corp_banner_*), legacy corp_title/desc keys, and portal page copy.' },
    'auth_pages': { label: 'Authentication Pages', icon: Smartphone, category: 'content', description: 'Login, register, forgot password, and reset password copy, visuals, and social proof.' },

    // ── System & Config ──
    'support_info': { label: 'Contact & Support', icon: Smartphone, category: 'system', description: 'Contact emails, phone numbers, and addresses.' },
    'financial_config': { label: 'Fees & Payments', icon: CreditCard, category: 'system', description: 'Platform fees, currency settings, and payout thresholds.' },
};

const PAGE_MAPPINGS = [
    { id: 'landing', label: 'Landing Page' },
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services Marketplace' },
    { id: 'providers', label: 'Providers Portal' },
    { id: 'commercial', label: 'Commercial Business' },
    { id: 'cooperatives', label: 'Cooperatives & Groups' },
    { id: 'investors', label: 'Investor Relations' },
    { id: 'contact', label: 'Contact & Support' },
    { id: 'blog', label: 'Kuba Journal' },
    { id: 'auth', label: 'Authentication' },
];

const getPageForKey = (key: string, group: string) => {
    // Specific elements for "How We Operate" physically on the Landing Page
    if (
        key.startsWith('step_') || 
        key === 'about_badge' ||
        key === 'how_eyebrow' ||
        key === 'how_headline' ||
        key === 'how_intro' ||
        key === 'about_title_1' ||
        key === 'about_title_2' ||
        key === 'about_desc' ||
        key.startsWith('step_') ||
        key.startsWith('hero_eyebrow') ||
        key.startsWith('hero_headline') ||
        key.startsWith('hero_stat_') ||
        key.startsWith('hero_search_') ||
        key.startsWith('search_modal_') ||
        key.startsWith('stats_') ||
        key.startsWith('categories_') ||
        key.startsWith('services_') ||
        key.startsWith('providers_') ||
        key.startsWith('testimonials_') ||
        key.startsWith('faq_') ||
        key.startsWith('how_cta_')
    ) {
        return 'landing';
    }

    // Check group matches first
    if (group === 'about_page' || group === 'about') return 'about';
    if (group === 'commercial_page' || group === 'commercial') return 'commercial';
    if (group === 'cooperative_page' || group === 'cooperatives') return 'cooperatives';
    if (group === 'investor_page' || group === 'investors') return 'investors';
    if (group === 'provider_page' || group === 'providers') return 'providers';
    if (group === 'services_page' || group === 'services') return 'services';
    if (group === 'contact_page' || group === 'contact') return 'contact';
    if (group === 'blog_page' || group === 'blog') return 'blog';
    if (group === 'auth_pages' || key.startsWith('auth_')) return 'auth';
    if (group === 'home_hero' || group === 'site_stats' || group === 'stats' || group === 'cta' || group === 'landing_sections' || group === 'testimonials' || group === 'sections') return 'landing';

    // Fallback to key prefixes
    if (key.startsWith('about_')) return 'about';
    if (key.startsWith('commercial_')) return 'commercial';
    if (key.startsWith('cooperatives_')) return 'cooperatives';
    if (key.startsWith('investors_')) return 'investors';
    if (key.startsWith('providers_') || key.startsWith('provider_')) return 'providers';
    if (key.startsWith('services_') || key.startsWith('featured_')) return 'services';
    if (key.startsWith('contact_')) return 'contact';
    if (key.startsWith('blog_') || key.startsWith('journal_')) return 'blog';
    if (key.startsWith('hero_') || key.startsWith('stat_') || key.startsWith('step_') || key.startsWith('test_') || key.startsWith('faq_') || key.startsWith('cta_')) return 'landing';
    
    // Default fallback to landing if it's general content
    return 'landing';
};

export default function UnifiedSettingsPage() {
    const { refreshSettings } = useCMS();
    const { data: settingsData, isLoading, refetch: fetchSettings, setData: setSettingsData } = useData<SettingsApiResponse>("/api/admin/settings");
    const settings = settingsData?.settings ?? ({} as Record<string, Setting[]>);
    const metadata = settingsData?.metadata ?? null;

    const [files, setFiles] = useState<Record<string, File>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [, setActiveMainTab] = useState("brand");

    const handleValueChange = (group: string, id: string, value: string) => {
        if (!settingsData) return;
        setSettingsData({
            ...settingsData,
            settings: {
                ...settingsData.settings,
                [group]: (settingsData.settings[group] ?? []).map((s: Setting) =>
                    s.id === id ? { ...s, value } : s
                ),
            },
        });
    };

    const handleRemoveImage = (group: string, id: string) => {
        if (!settingsData) return;
        setSettingsData({
            ...settingsData,
            settings: {
                ...settingsData.settings,
                [group]: (settingsData.settings[group] ?? []).map((s: Setting) =>
                    s.id === id ? { ...s, value: "", image_url: null } : s
                ),
            },
        });
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

            const compressedFiles: Record<string, File> = {};
            for (const [id, file] of Object.entries(files)) {
                compressedFiles[id] = await compressImageFile(file, { preset: "cms" });
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
            await fetchSettings();
            await refreshSettings();
            setFiles({});
        } catch (err) {
            toast.error(handleApiError(err));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardPageSkeleton width="wide" metrics={3} className="p-4 md:p-8" />
        );
    }

    const getGroupsByCategory = (cat: string) => {
        return Object.entries(GROUP_CONFIG)
            .filter(([, config]) => config.category === cat)
            .map(([groupId, config]) => ({
                id: groupId,
                ...config,
                // Filter out json settings so they don't render generically (e.g. navigation_menu)
                settings: ((settings[groupId] || []) as Setting[]).filter((s: Setting) => s.type !== 'json')
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
        <DashboardPageContainer width="wide" className="space-y-10 pb-20">
            <DashboardPageHeader 
                title="Platform CMS" 
                subtitle="Site settings stored in site_settings — synced to the public site via /api/settings."
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
                <div className="flex items-center justify-between mb-8 overflow-x-auto kuba-scroll-hidden scroll-smooth">
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

                {['brand', 'hero', 'content', 'system'].map(catId => {
                    const isPageAccordionMode = catId === 'hero' || catId === 'content';
                    let categoryGroups = getGroupsByCategory(catId);
                    
                    if (catId === 'content') {
                        // Dynamically pull unmapped database groups into the content tab
                        const unmappedGroups = Object.keys(settings).filter(groupId => !GROUP_CONFIG[groupId] && groupId !== 'navigation_menu' && groupId !== 'payment');
                        const dynamicGroups = unmappedGroups.map(groupId => ({
                            id: groupId,
                            label: groupId,
                            icon: Layout,
                            category: 'content',
                            description: '',
                            settings: (settings[groupId] || []).filter((s: Setting) => s.type !== 'json')
                        })).filter(g => g.settings.length > 0);
                        
                        categoryGroups = [...categoryGroups, ...dynamicGroups];
                    }
                    
                    if (isPageAccordionMode) {
                        // Gather all settings from this category's groups for local filtering
                        let catIdSettings: Setting[] = [];
                        categoryGroups.forEach(g => {
                            catIdSettings = [...catIdSettings, ...g.settings];
                        });

                        // Flatten ALL settings for the Preview Modal to allow cross-tab data access (e.g. Hero + Content)
                        const allPlatformSettings = Object.values(settings).flat() as Setting[];

                        // Group them by page
                        const settingsByPage: Record<string, Setting[]> = {};
                        catIdSettings.forEach(s => {
                            const page = getPageForKey(s.key, s.group);
                            if (!settingsByPage[page]) settingsByPage[page] = [];
                            settingsByPage[page].push(s);
                        });

                        return (
                            <TabsContent key={catId} value={catId} className="mt-0 focus:outline-none">
                                <Accordion type="multiple" className="space-y-4">
                                    {PAGE_MAPPINGS.map(pageInfo => {
                                        const pageSettings = settingsByPage[pageInfo.id] || [];
                                        return (
                                        <SettingsPageContent
                                            key={pageInfo.id}
                                            pageInfo={pageInfo}
                                            pageSettings={pageSettings}
                                            allPlatformSettings={allPlatformSettings}
                                            files={files}
                                            onValueChange={handleValueChange}
                                            onRemoveImage={handleRemoveImage}
                                            onSetFile={(id, file) => setFiles(prev => ({ ...prev, [id]: file }))}
                                        />
                                    )})}
                                </Accordion>
                            </TabsContent>
                        );
                    }

                    // Strict Standard rendering for Brand and System tabs
                    return (
                        <TabsContent key={catId} value={catId} className="mt-0 focus:outline-none">
                            <div className="space-y-12">
                                {categoryGroups.map(group => (
                                <SettingsGroupSection
                                    key={group.id}
                                    group={group}
                                    files={files}
                                    onValueChange={handleValueChange}
                                    onRemoveImage={handleRemoveImage}
                                    onSetFile={(id, file) => setFiles(prev => ({ ...prev, [id]: file }))}
                                />
                            ))}
                        </div>
                    </TabsContent>
                );
            })}

                <TabsContent value="navigation" className="mt-0 focus:outline-none">
                    <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl border border-border/40 shadow-sm min-h-[600px]", uiPrimitives.surface.paddingLg)}>
                        <div className="mb-10 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">Global Navigation</h3>
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
            `}</style>
        </DashboardPageContainer>
    );
}
