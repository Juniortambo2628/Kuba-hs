"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Wrench, Trash2, Edit, Car, Home, Heart, Briefcase, Building2, Sparkles, Droplet, Zap } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
    id: string;
    name: string;
    description: string;
    category_id: number;
    thumbnail_url?: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    services: Service[];
}

const iconMap: Record<string, React.ReactNode> = {
    car: <Car className="w-5 h-5" />,
    home: <Home className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
    briefcase: <Briefcase className="w-5 h-5" />,
    building: <Building2 className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
    droplet: <Droplet className="w-5 h-5" />,
    bolt: <Zap className="w-5 h-5" />,
    wrench: <Wrench className="w-5 h-5" />,
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSvcOpen, setIsSvcOpen] = useState(false);
    const [catForm, setCatForm] = useState({ name: '', description: '', iconContext: 'wrench' });
    const [svcForm, setSvcForm] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/categories");
            setCategories(res.data.categories);
        } catch (err) { toast.error("Failed to load categories"); }
        finally { setIsLoading(false); }
    };

    const handleSaveCategory = async () => {
        setIsSubmitting(true);
        try {
            if (selectedCat) {
                await axiosInstance.put(`/api/admin/categories/${selectedCat.id}`, { ...catForm, icon: catForm.iconContext });
                toast.success("Category updated");
            } else {
                await axiosInstance.post("/api/admin/categories", { ...catForm, icon: catForm.iconContext });
                toast.success("Category created");
            }
            fetchCategories();
            setIsCatOpen(false);
            setCatForm({ name: '', description: '', iconContext: 'wrench' });
            setSelectedCat(null);
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure? This will delete all services under this category too.")) return;
        try { await axiosInstance.delete(`/api/admin/categories/${id}`); toast.success("Category deleted"); fetchCategories(); }
        catch (err: any) { toast.error(handleApiError(err)); }
    };

    const handleSaveService = async () => {
        if (!selectedCat) return;
        setIsSubmitting(true);
        try {
            if (selectedSvc) {
                await axiosInstance.put(`/api/admin/services/${selectedSvc.id}`, svcForm);
                toast.success("Service updated");
            } else {
                await axiosInstance.post("/api/admin/services", { ...svcForm, category_id: selectedCat.id });
                toast.success("Service added");
            }
            fetchCategories();
            setIsSvcOpen(false);
            setSvcForm({ name: '', description: '' });
            setSelectedSvc(null);
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Delete this service?")) return;
        try { await axiosInstance.delete(`/api/admin/services/${id}`); toast.success("Service deleted"); fetchCategories(); }
        catch (err: any) { toast.error(err.response?.data?.message || "Delete failed"); }
    };

    const openEditCat = (cat: Category) => { setSelectedCat(cat); setCatForm({ name: cat.name, description: cat.description, iconContext: cat.icon || 'wrench' }); setIsCatOpen(true); };
    const openAddService = (cat: Category) => { setSelectedCat(cat); setSelectedSvc(null); setSvcForm({ name: '', description: '' }); setIsSvcOpen(true); };
    const openEditService = (cat: Category, svc: Service) => { setSelectedCat(cat); setSelectedSvc(svc); setSvcForm({ name: svc.name, description: svc.description }); setIsSvcOpen(true); };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !selectedSvc) return;
        
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('collection', 'thumbnail');
        formData.append('model_type', 'service');
        formData.append('model_id', selectedSvc.id);

        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Thumbnail uploaded");
            fetchCategories();
            // Update local state to show the new image
            if (selectedSvc) {
                setSelectedSvc({ ...selectedSvc, thumbnail_url: res.data.url });
            }
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Categories</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage platform service categories and offerings.</p>
                </div>
                <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setSelectedCat(null); setCatForm({ name: '', description: '', iconContext: 'wrench' }); }} size="sm">
                            <Plus className="w-4 h-4 mr-1.5" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedCat ? "Edit Category" : "New Category"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={catForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCatForm({...catForm, name: e.target.value})} className="h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={catForm.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCatForm({...catForm, description: e.target.value})} className="min-h-[80px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Icon</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {Object.entries(iconMap).map(([id, icon]) => (
                                        <button key={id} type="button" onClick={() => setCatForm({...catForm, iconContext: id})}
                                            className={`p-2.5 rounded-lg border flex items-center justify-center transition-all ${catForm.iconContext === id ? "bg-muted border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:bg-accent"}`}
                                        >{icon}</button>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleSaveCategory} disabled={isSubmitting || !catForm.name} className="w-full h-10 mt-2">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Service Dialog */}
            <Dialog open={isSvcOpen} onOpenChange={setIsSvcOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSvc ? `Edit ${selectedSvc.name}` : `Add Service to ${selectedCat?.name}`}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Service Name</Label>
                            <Input value={svcForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvcForm({...svcForm, name: e.target.value})} className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={svcForm.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSvcForm({...svcForm, description: e.target.value})} className="min-h-[80px]" />
                        </div>
                        
                        {selectedSvc && (
                            <div className="space-y-2">
                                <Label>Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
                                        {selectedSvc.thumbnail_url ? (
                                            <img src={selectedSvc.thumbnail_url} alt="Service" className="w-full h-full object-cover" />
                                        ) : (
                                            <Sparkles className="w-8 h-8 text-muted-foreground/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input type="file" onChange={handleThumbnailUpload} accept="image/*" className="h-9" />
                                        <p className="text-[10px] text-muted-foreground mt-1">Recommended size: 800x600px</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button onClick={handleSaveService} disabled={isSubmitting || !svcForm.name} className="w-full h-10 mt-2">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Service"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Category List */}
            <div className="space-y-4">
                {categories.map((cat) => (
                    <Card key={cat.id} className="border border-border">
                        <CardHeader className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                                        {iconMap[cat.icon || 'wrench']}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-foreground">{cat.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="ghost" size="icon" onClick={() => openEditCat(cat)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Services</h4>
                                <Button variant="ghost" size="sm" onClick={() => openAddService(cat)} className="text-primary h-7 text-xs">
                                    <Plus className="w-3.5 h-3.5 mr-1" /> Add
                                </Button>
                            </div>
                            {cat.services?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {cat.services.map(svc => (
                                        <div key={svc.id} className="bg-muted/50 rounded-lg p-3.5 flex justify-between items-start group border border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                                                    {svc.thumbnail_url ? (
                                                        <img src={svc.thumbnail_url} alt={svc.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Sparkles className="w-5 h-5 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-foreground text-sm">{svc.name}</h5>
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{svc.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => openEditService(cat, svc)} className="w-7 h-7 text-muted-foreground hover:text-primary">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteService(svc.id)} className="w-7 h-7 text-muted-foreground hover:text-red-500">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="text-sm text-muted-foreground">No services added yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
