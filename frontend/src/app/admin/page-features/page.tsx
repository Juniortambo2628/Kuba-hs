"use client";

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
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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
    const { data: featuresData, isLoading, refetch: fetchFeatures } = useApiData<any>("/api/admin/page-features", { initialData: [] });
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
        order_index: 0,
        is_active: true
    });


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
            order_index: feature.order_index,
            is_active: feature.is_active
        }); 
        setIsOpen(true); 
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-pulse p-6">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <DashboardPageHeader 
                title="Canvas Orchestrator" 
                subtitle="Configure and fine-tune dynamic content sections across the platform's public pages."
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
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {selectedFeature ? "Edit UI Feature" : "Define New Feature"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Target Page</Label>
                                    <Input value={form.page_name} onChange={(e) => setForm({...form, page_name: e.target.value})} className="h-12 bg-muted border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Main Title</Label>
                                    <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Feature Title" className="h-12 bg-muted border-none rounded-xl font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Descriptive Narrative</Label>
                                    <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Describe this feature..." className="min-h-[140px] bg-muted border-none rounded-xl pt-4" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Section Slot</Label>
                                    <Input value={form.section_name} onChange={(e) => setForm({...form, section_name: e.target.value})} className="h-12 bg-muted border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Subtitle (Optional)</Label>
                                    <Input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} placeholder="Contextual subtitle..." className="h-12 bg-muted border-none rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">Order</Label>
                                        <Input type="number" value={form.order_index} onChange={(e) => setForm({...form, order_index: parseInt(e.target.value)})} className="h-12 bg-muted border-none rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">Icon Identifier</Label>
                                        <Input value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} placeholder="Sparkles" className="h-12 bg-muted border-none rounded-xl font-mono text-xs" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-6">
                                    <Label className="text-xs font-bold text-muted-foreground">Instant Deployment</Label>
                                    <Switch checked={form.is_active} onCheckedChange={(val) => setForm({...form, is_active: val})} />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <Button onClick={handleSave} disabled={isSubmitting || !form.title || !form.description} className="w-full h-14 bg-primary hover:bg-black text-white font-bold rounded-2xl">
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publish to Canvas"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </DashboardPageHeader>

            <div className="space-y-6">
                {['landing', 'about', 'services'].map(page => {
                    const pageFeatures = features.filter(f => f.page_name === page);
                    if (pageFeatures.length === 0) return null;

                    return (
                        <div key={page} className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-2">{page} Blueprint</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageFeatures.map((feature) => (
                                    <Card key={feature.id} className="border-none bg-card/40 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden group hover:bg-card/60 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Sparkles className="w-6 h-6" />
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
                                                    <ConfirmDeleteDialog
                                                        trigger={
                                                            <button className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 flex items-center justify-center transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        }
                                                        title="Delete Feature?"
                                                        description={`Archiving "${feature.title}" will remove it from the ${feature.page_name} page immediately.`}
                                                        onConfirm={() => handleDelete(feature.id)}
                                                    />
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
        </div>
    );
}
