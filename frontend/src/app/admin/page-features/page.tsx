"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit, Monitor, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { iconMap, resolveIcon } from "@/lib/icon-map";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import { getMediaUrl } from "@/lib/utils";

const PAGE_OPTIONS = [
    { label: 'Landing (Home)', value: 'landing' },
    { label: 'About Us', value: 'about' },
    { label: 'Services', value: 'services' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Cooperatives', value: 'cooperatives' },
    { label: 'Investors', value: 'investors' },
];

const SECTION_OPTIONS = [
    { label: 'Key Features / Highlights', value: 'features' },
    { label: 'Our Values', value: 'values' },
    { label: 'Why Choose Us / Benefits', value: 'benefits' },
    { label: 'Service Metrics', value: 'metrics' },
];

interface PageFeature {
    id: number;
    page_name: string;
    section_name: string;
    title: string;
    subtitle: string | null;
    description: string;
    icon: string | null;
    image_url: string | null;
    order_index: number;
    is_active: boolean;
}

export default function PageFeaturesPage() {
    const { data: featuresData, isLoading, refetch: fetchFeatures } = useData<any>("/api/admin/page-features", { initialData: [] });
    const features = (featuresData || []) as PageFeature[];
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<PageFeature | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        page_name: 'landing',
        section_name: 'features',
        title: '',
        subtitle: '',
        description: '',
        icon: 'Sparkles',
        image_url: '',
        order_index: 0,
        is_active: true
    });
    const [deleteTarget, setDeleteTarget] = useState<PageFeature | null>(null);


    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (selectedFeature) {
                await axiosInstance.put(`/api/admin/page-features/${selectedFeature.id}`, form);
                toast.success("Feature updated");
            } else {
                await axiosInstance.post("/api/admin/page-features", form);
                toast.success("Feature added");
            }
            fetchFeatures();
            setIsOpen(false);
            resetForm();
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: number) => {
        try { 
            await axiosInstance.delete(`/api/admin/page-features/${id}`); 
            toast.success("Feature removed"); 
            fetchFeatures(); 
        } catch (err: any) { toast.error(handleApiError(err)); }
    };

    const resetForm = () => {
        setForm({
            page_name: 'landing',
            section_name: 'features',
            title: '',
            subtitle: '',
            description: '',
            icon: 'Sparkles',
            image_url: '',
            order_index: 0,
            is_active: true
        });
        setSelectedFeature(null);
    };

    const openEdit = (feature: PageFeature) => { 
        setSelectedFeature(feature); 
        setForm({
            page_name: feature.page_name,
            section_name: feature.section_name,
            title: feature.title,
            subtitle: feature.subtitle || '',
            description: feature.description,
            icon: feature.icon || 'Sparkles',
            image_url: feature.image_url || '',
            order_index: feature.order_index,
            is_active: feature.is_active
        }); 
        setIsOpen(true); 
    };

    if (isLoading) {
        return <DashboardPageSkeleton width="narrow" metrics={0} bodyHeight="h-64" />;
    }

    return (
        <DashboardPageContainer width="default" className="space-y-10">
            <DashboardPageHeader 
                title="Page Feature Manager" 
                subtitle="Configure and fine-tune dynamic content cards displayed on the website's public pages."
            >
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={resetForm} 
                            className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Create Feature
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {selectedFeature ? "Modify Feature" : "Add New Feature"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Target Page</Label>
                                    <Select 
                                        value={form.page_name} 
                                        onValueChange={(val) => setForm({...form, page_name: val})}
                                    >
                                        <SelectTrigger className="h-12 bg-muted border-none rounded-xl font-bold focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select a page" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            {PAGE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value} className="font-medium">{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Section Category</Label>
                                    <Select 
                                        value={form.section_name} 
                                        onValueChange={(val) => setForm({...form, section_name: val})}
                                    >
                                        <SelectTrigger className="h-12 bg-muted border-none rounded-xl font-bold focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select a section" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            {SECTION_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value} className="font-medium">{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Feature Title</Label>
                                    <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. 24/7 Professional Support" className="h-12 bg-muted border-none rounded-xl font-bold focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</Label>
                                    <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Explain what makes this feature special..." className="min-h-[120px] bg-muted border-none rounded-xl pt-4 font-medium focus:ring-2 focus:ring-primary/20" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <DashboardImageUpload
                                    label="Feature Image (optional)"
                                    type="cms"
                                    value={form.image_url}
                                    onChange={(url) => setForm({ ...form, image_url: url })}
                                />
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-4 text-center">Fallback Icon (when no image)</Label>
                                    <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                                        <ScrollArea className="h-[210px] pr-4">
                                            <div className="grid grid-cols-4 gap-2">
                                                {Object.entries(iconMap).map(([key, Icon]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setForm({...form, icon: key})}
                                                        className={cn(
                                                            "aspect-square flex flex-col items-center justify-center p-2 rounded-xl transition-all border border-transparent",
                                                            form.icon === key 
                                                                ? "bg-primary text-white scale-105 shadow-md shadow-primary/20 border-primary" 
                                                                : "bg-background hover:bg-muted text-muted-foreground hover:scale-105"
                                                        )}
                                                    >
                                                        <Icon className="w-5 h-5 mb-1" />
                                                        <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full text-center">{key}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Display Rank</Label>
                                        <Input type="number" value={form.order_index} onChange={(e) => setForm({...form, order_index: parseInt(e.target.value)})} className="h-12 bg-muted border-none rounded-xl text-center font-bold" />
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-end pb-3">
                                        <div className="flex items-center justify-between px-2">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Status</Label>
                                            <Switch checked={form.is_active} onCheckedChange={(val) => setForm({...form, is_active: val})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Context Subtitle (Optional)</Label>
                                    <Input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} placeholder="Optional context..." className="h-12 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary/20" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 pt-4">
                                <Button onClick={handleSave} disabled={isSubmitting || !form.title || !form.description} className="w-full h-14 bg-primary hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest">
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (selectedFeature ? "Update Global Feature" : "Publish to Platforms")}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </DashboardPageHeader>

            <div className="space-y-12">
                {PAGE_OPTIONS.map(opt => opt.value).map(page => {
                    const pageFeatures = features.filter(f => f.page_name === page);
                    if (pageFeatures.length === 0) return null;

                    return (
                        <div key={page} className="space-y-6">
                            <div className="flex items-center gap-4 px-2">
                                <div className="h-[1px] flex-1 bg-border/40" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 whitespace-nowrap">
                                    {PAGE_OPTIONS.find(o => o.value === page)?.label || page} Blueprint
                                </h3>
                                <div className="h-[1px] flex-1 bg-border/40" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pageFeatures.map((feature) => (
                                    <Card key={feature.id} className="border-none bg-card/40 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden group hover:bg-card/60 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        {(() => {
                                                            const IconComp = resolveIcon(feature.icon, Sparkles);
                                                            return <IconComp className="w-6 h-6" />;
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{feature.section_name}</span>
                                                        <h4 className="text-base font-bold text-foreground leading-tight">{feature.title}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(feature)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <button className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 flex items-center justify-center transition-colors" onClick={() => setDeleteTarget(feature)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed font-medium">
                                                {feature.description}
                                            </p>
                                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-[10px] font-bold text-muted-foreground">Order: {feature.order_index}</span>
                                                </div>
                                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${feature.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                    {feature.is_active ? 'Online' : 'Draft'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {features.length === 0 && (
                    <div className="py-20 text-center bg-card/30 rounded-[2rem] border-2 border-dashed border-border/50">
                        <Monitor className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No page features defined.</p>
                    </div>
                )}
            </div>
            <AppConfirmDialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
                onConfirm={async () => { if (deleteTarget) { await handleDelete(deleteTarget.id); setDeleteTarget(null); } }}
                title="Delete Feature?"
                description={`Archiving "${deleteTarget?.title}" will remove it from the ${deleteTarget?.page_name} page immediately.`}
            />
        </DashboardPageContainer>
    );
}
