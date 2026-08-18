"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useState, useMemo } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Save,
  Loader2,
  Layout,
  Globe,
  CreditCard,
  Navigation,
  Share2,
  Smartphone,
  Palette,
  FileText,
  Camera,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useData } from "@/hooks/useData";
import { compressImageFile } from "@/lib/image-compression";
import { useCMS } from "@/contexts/CMSContext";
import { NavigationManager } from "./components/NavigationManager";
import { SettingsGroupSection } from "@/components/admin/settings/SettingsGroupSection";
import { SettingsPageContent } from "@/components/admin/settings/SettingsPageContent";
import { PageSelectorToolbar } from "@/components/admin/settings/PageSelectorToolbar";
import type { Setting } from "@/components/admin/settings/types";
import type { ComponentType } from "react";

interface Metadata {
    environment: string;
    version: string;
    maintenance_mode: boolean;
}

interface SettingsApiResponse {
    settings: Record<string, Setting[]>;
    metadata?: Metadata | null;
}

const GROUP_CONFIG: Record<string, { label: string; icon: ComponentType<{ className?: string }>; category: string; description: string }> = {
    'identity': { label: 'Brand Identity', icon: Globe, category: 'brand', description: 'Logos, favicons, and site branding.' },
    'social_links': { label: 'Social Links', icon: Share2, category: 'brand', description: 'Social media handles and platform links.' },
    'hero_backgrounds': { label: 'Hero Backgrounds', icon: Camera, category: 'media', description: 'Default hero images per page.' },
    'hero_text': { label: 'Hero Titles & Copy', icon: Type, category: 'content', description: 'Headlines, subtitles, and badge text for hero banners.' },
    'home_hero': { label: 'Landing — Hero', icon: FileText, category: 'content', description: 'Eyebrow, headline, stat line, search bar labels, and hero copy.' },
    'about_page': { label: 'About Page', icon: FileText, category: 'content', description: 'About page headline, tagline, paragraphs, and how-it-works steps.' },
    'site_stats': { label: 'Landing — Stats', icon: FileText, category: 'content', description: 'Stat values used in the bottom CTA card.' },
    'landing_sections': { label: 'Landing — Sections', icon: Layout, category: 'content', description: 'Badges, titles, and subtitles for categories, services, providers, testimonials, and FAQ.' },
    'cta': { label: 'Landing — CTA', icon: FileText, category: 'content', description: 'Final call-to-action copy and button labels.' },
    'market_narratives': { label: 'Pages — Content', icon: Layout, category: 'content', description: 'Corporate landing banner, legacy keys, and portal page copy.' },
    'auth_pages': { label: 'Authentication Pages', icon: Smartphone, category: 'content', description: 'Login, register, forgot password, and reset password copy.' },
    'payment': { label: 'Payment Gateway Keys', icon: CreditCard, category: 'system', description: 'Paystack/M-Pesa keys (stored in DB; use env for secrets in production).' },
    'support_info': { label: 'Contact & Support', icon: Smartphone, category: 'system', description: 'Contact emails, phone numbers, and addresses.' },
    'financial_config': { label: 'Fees & Payments', icon: CreditCard, category: 'system', description: 'Platform fees, currency settings, and payout thresholds.' },
};

const PAGE_MAPPINGS = [
    { id: 'landing', label: 'Landing Page' },
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services' },
    { id: 'providers', label: 'Providers' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'cooperatives', label: 'Cooperatives' },
    { id: 'investors', label: 'Investors' },
    { id: 'contact', label: 'Contact' },
    { id: 'blog', label: 'Blog' },
    { id: 'auth', label: 'Auth Pages' },
];

const getPageForKey = (key: string, group: string) => {
    if (
        key.startsWith('step_') ||
        key === 'about_badge' ||
        key === 'how_eyebrow' ||
        key === 'how_headline' ||
        key === 'how_intro' ||
        key === 'about_title_1' ||
        key === 'about_title_2' ||
        key === 'about_desc' ||
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

    if (key.startsWith('about_')) return 'about';
    if (key.startsWith('commercial_')) return 'commercial';
    if (key.startsWith('cooperatives_')) return 'cooperatives';
    if (key.startsWith('investors_')) return 'investors';
    if (key.startsWith('providers_') || key.startsWith('provider_')) return 'providers';
    if (key.startsWith('services_') || key.startsWith('featured_')) return 'services';
    if (key.startsWith('contact_')) return 'contact';
    if (key.startsWith('blog_') || key.startsWith('journal_')) return 'blog';
    if (key.startsWith('hero_') || key.startsWith('stat_') || key.startsWith('step_') || key.startsWith('test_') || key.startsWith('faq_') || key.startsWith('cta_')) return 'landing';

    return 'landing';
};

export default function UnifiedSettingsPage() {
    const { refreshSettings } = useCMS();
    const { data: settingsData, isLoading, refetch: fetchSettings, setData: setSettingsData } = useData<SettingsApiResponse>("/api/admin/settings");
    const rawSettings = useMemo(() => settingsData?.settings ?? ({} as Record<string, Setting[]>), [settingsData?.settings]);
    const metadata = settingsData?.metadata ?? null;

    const [files, setFiles] = useState<Record<string, File>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedContentPage, setSelectedContentPage] = useState("landing");
    const [selectedMediaPage, setSelectedMediaPage] = useState("landing");

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
            const allSettings = Object.values(rawSettings).flat() as Setting[];

            const compressedFiles: Record<string, File> = {};
            for (const [id, file] of Object.entries(files)) {
                compressedFiles[id] = await compressImageFile(file, { preset: "cms" });
            }

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

    const getGroupsByCategory = (cat: string) => {
        return Object.entries(GROUP_CONFIG)
            .filter(([, config]) => config.category === cat)
            .map(([groupId, config]) => ({
                id: groupId,
                ...config,
                settings: ((rawSettings[groupId] || []) as Setting[]).filter((s: Setting) => s.type !== 'json')
            }))
            .filter(group => group.settings.length > 0);
    };

    // All hooks must be before any early returns
    const allFlatSettings = useMemo(() => {
        return Object.entries(rawSettings).flatMap(([, groupSettings]) =>
            (groupSettings as Setting[]).filter(s => s.type !== 'json')
        );
    }, [rawSettings]);

    const contentByPage = useMemo(() => {
        const byPage: Record<string, Setting[]> = {};
        allFlatSettings
            .filter(s => s.type === 'text' || s.type === 'textarea')
            .forEach(s => {
                const page = getPageForKey(s.key, s.group);
                if (!byPage[page]) byPage[page] = [];
                byPage[page].push(s);
            });
        return byPage;
    }, [allFlatSettings]);

    const mediaByPage = useMemo(() => {
        const byPage: Record<string, Setting[]> = {};
        allFlatSettings
            .filter(s => s.type === 'image')
            .forEach(s => {
                const page = getPageForKey(s.key, s.group);
                if (!byPage[page]) byPage[page] = [];
                byPage[page].push(s);
            });
        return byPage;
    }, [allFlatSettings]);

    const contentPageCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const [page, items] of Object.entries(contentByPage)) {
            counts[page] = items.length;
        }
        return counts;
    }, [contentByPage]);

    const mediaPageCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const [page, items] of Object.entries(mediaByPage)) {
            counts[page] = items.length;
        }
        return counts;
    }, [mediaByPage]);

    const brandGroups = getGroupsByCategory('brand');
    const systemGroups = getGroupsByCategory('system');

    const categories = [
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'media', label: 'Media', icon: Camera },
        { id: 'brand', label: 'Brand', icon: Palette },
        { id: 'system', label: 'System', icon: SettingsIcon },
        { id: 'navigation', label: 'Navigation', icon: Navigation },
    ];

    if (isLoading) {
        return (
            <DashboardPageSkeleton width="wide" metrics={3} className="p-4 md:p-8" />
        );
    }

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

            <Tabs defaultValue="content" className="w-full">
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

                {/* ── Content Tab ── */}
                <TabsContent value="content" className="mt-0 focus:outline-none">
                    <div className="space-y-6">
                        <PageSelectorToolbar
                            pages={PAGE_MAPPINGS}
                            selectedPage={selectedContentPage}
                            onSelect={setSelectedContentPage}
                            counts={contentPageCounts}
                        />
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border/40 shadow-sm p-6">
                            <div className="mb-6 flex items-center justify-between border-b border-border/10 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                                        {PAGE_MAPPINGS.find(p => p.id === selectedContentPage)?.label}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">
                                        {(contentByPage[selectedContentPage] || []).length} content settings
                                    </p>
                                </div>
                            </div>
                            {(contentByPage[selectedContentPage] || []).length === 0 ? (
                                <div className="py-16 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
                                    <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm font-medium">No content settings mapped for this page.</p>
                                </div>
                            ) : (
                                <SettingsPageContent
                                    pageInfo={{ id: selectedContentPage, label: PAGE_MAPPINGS.find(p => p.id === selectedContentPage)?.label || selectedContentPage }}
                                    pageSettings={contentByPage[selectedContentPage] || []}
                                    allPlatformSettings={allFlatSettings}
                                    files={files}
                                    onValueChange={handleValueChange}
                                    onRemoveImage={handleRemoveImage}
                                    onSetFile={(id, file) => setFiles(prev => ({ ...prev, [id]: file }))}
                                    filterType="content"
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* ── Media Tab ── */}
                <TabsContent value="media" className="mt-0 focus:outline-none">
                    <div className="space-y-6">
                        <PageSelectorToolbar
                            pages={PAGE_MAPPINGS}
                            selectedPage={selectedMediaPage}
                            onSelect={setSelectedMediaPage}
                            counts={mediaPageCounts}
                        />
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border/40 shadow-sm p-6">
                            <div className="mb-6 flex items-center justify-between border-b border-border/10 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                                        {PAGE_MAPPINGS.find(p => p.id === selectedMediaPage)?.label}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">
                                        {(mediaByPage[selectedMediaPage] || []).length} media assets
                                    </p>
                                </div>
                            </div>
                            {(mediaByPage[selectedMediaPage] || []).length === 0 ? (
                                <div className="py-16 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
                                    <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm font-medium">No media assets mapped for this page.</p>
                                </div>
                            ) : (
                                <SettingsPageContent
                                    pageInfo={{ id: selectedMediaPage, label: PAGE_MAPPINGS.find(p => p.id === selectedMediaPage)?.label || selectedMediaPage }}
                                    pageSettings={mediaByPage[selectedMediaPage] || []}
                                    allPlatformSettings={allFlatSettings}
                                    files={files}
                                    onValueChange={handleValueChange}
                                    onRemoveImage={handleRemoveImage}
                                    onSetFile={(id, file) => setFiles(prev => ({ ...prev, [id]: file }))}
                                    filterType="media"
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* ── Brand Tab ── */}
                <TabsContent value="brand" className="mt-0 focus:outline-none">
                    <div className="space-y-12">
                        {brandGroups.map(group => (
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

                {/* ── System Tab ── */}
                <TabsContent value="system" className="mt-0 focus:outline-none">
                    <div className="space-y-12">
                        {systemGroups.map(group => (
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

                {/* ── Navigation Tab ── */}
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
