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
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { iconMap } from "@/lib/category-icons";
import { useApiData } from "@/hooks/useApiData";

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
    image_url: string | null;
    services: Service[];
}

// Shared iconMap imported from @/lib/category-icons

export default function AdminCategories() {
    const { data: categories, isLoading, refetch: fetchCategories } = useApiData<Category[]>("/api/admin/categories", { 
        initialData: [],
        extractKey: 'categories'
    });
    
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSvcOpen, setIsSvcOpen] = useState(false);
    const [catForm, setCatForm] = useState<{name: string, description: string, iconContext: string, image: File | null}>({ name: '', description: '', iconContext: 'wrench', image: null });
    const [svcForm, setSvcForm] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveCategory = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', catForm.name);
            formData.append('description', catForm.description);
            formData.append('icon_url', catForm.iconContext);
            if (catForm.image) {
                formData.append('image', catForm.image);
            }

            if (selectedCat) {
                formData.append('_method', 'PUT');
                await axiosInstance.post(`/api/admin/categories/${selectedCat.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Category updated");
            } else {
                await axiosInstance.post("/api/admin/categories", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Category created");
            }
            fetchCategories();
            setIsCatOpen(false);
            setCatForm({ name: '', description: '', iconContext: 'wrench', image: null });
            setSelectedCat(null);
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteCategory = async (id: number) => {
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

    const handleDeleteService = async (id: string | number) => {
        try { await axiosInstance.delete(`/api/admin/services/${id}`); toast.success("Service deleted"); fetchCategories(); }
        catch (err: any) { toast.error(err.response?.data?.message || "Delete failed"); }
    };

    const openEditCat = (cat: Category) => { setSelectedCat(cat); setCatForm({ name: cat.name, description: cat.description, iconContext: cat.icon || 'wrench', image: null }); setIsCatOpen(true); };
    const openAddService = (cat: Category) => { setSelectedCat(cat); setSelectedSvc(null); setSvcForm({ name: '', description: '' }); setIsSvcOpen(true); };
    const openEditService = (cat: Category, svc: Service) => { setSelectedCat(cat); setSelectedSvc(svc); setSvcForm({ name: svc.name, description: svc.description }); setIsSvcOpen(true); };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !selectedSvc) return;
        
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('collection', 'thumbnail');
        formData.append('model_type', 'service');
        if (selectedSvc) {
            formData.append('model_id', selectedSvc.id);
        }
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
        <div className="max-w-5xl mx-auto space-y-10 pb-12">
            {/* Standard Dashboard Header */}
            <DashboardPageHeader 
                title="Service Categories" 
                subtitle="Manage platform service taxonomy and professional offerings."
            >
                <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => { setSelectedCat(null); setCatForm({ name: '', description: '', iconContext: 'wrench', image: null }); }} 
                            className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Create Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                {selectedCat ? "Edit Category" : "New Category"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground">Category Identity</Label>
                                <Input 
                                    value={catForm.name} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCatForm({...catForm, name: e.target.value})} 
                                    placeholder="e.g. Home Cleaning"
                                    className="h-14 bg-muted border-none rounded-2xl font-bold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground">Brief Narrative</Label>
                                <Textarea 
                                    value={catForm.description} 
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCatForm({...catForm, description: e.target.value})} 
                                    placeholder="Describe the category scope..."
                                    className="min-h-[100px] bg-muted border-none rounded-2xl font-bold pt-4" 
                                />
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
                            <div className="space-y-2">
                                <Label>Thumbail Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
                                        {catForm.image ? (
                                            <img src={URL.createObjectURL(catForm.image)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : selectedCat?.image_url ? (
                                            <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000'}/storage/${selectedCat.image_url}`} alt="Category" className="w-full h-full object-cover" />
                                        ) : (
                                            <Sparkles className="w-8 h-8 text-muted-foreground/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCatForm({...catForm, image: e.target.files?.[0] || null})} accept="image/*" className="h-9" />
                                        <p className="text-[10px] text-muted-foreground mt-1">Recommended size: 800x600px</p>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                onClick={handleSaveCategory} 
                                disabled={isSubmitting || !catForm.name} 
                                className="w-full h-14 bg-primary hover:bg-black text-white font-bold rounded-2xl mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Category Architecture"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </DashboardPageHeader>

            {/* Service Dialog */}
            <Dialog open={isSvcOpen} onOpenChange={setIsSvcOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground">
                            {selectedSvc ? `Edit ${selectedSvc?.name}` : `Add Service to ${selectedCat?.name}`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground">Service Name</Label>
                            <Input 
                                value={svcForm.name} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvcForm({...svcForm, name: e.target.value})} 
                                placeholder="e.g. Deep Carpet Cleaning"
                                className="h-14 bg-muted border-none rounded-2xl font-bold" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground">Service Narrative</Label>
                            <Textarea 
                                value={svcForm.description} 
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSvcForm({...svcForm, description: e.target.value})} 
                                placeholder="Detail the specific service offering..."
                                className="min-h-[100px] bg-muted border-none rounded-2xl font-bold pt-4" 
                            />
                        </div>
                        
                        {selectedSvc && (
                            <div className="space-y-2">
                                <Label>Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
                                        {selectedSvc?.thumbnail_url ? (
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
                                    <ConfirmDeleteDialog
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        }
                                        title="Purge Category?"
                                        description={
                                            <>Are you sure you want to delete <span className="font-bold text-foreground">"{cat.name}"</span>? This will also permanently remove all services associated with this category.</>
                                        }
                                        onConfirm={() => handleDeleteCategory(cat.id)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Service Registry</h4>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openAddService(cat)} 
                                    className="text-primary hover:text-black hover:bg-red-50 h-9 font-bold rounded-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Offering
                                </Button>
                            </div>
                            {cat.services?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {cat.services.map(svc => (
                                        <div key={svc.id} className="bg-muted/30 rounded-2xl p-4 flex justify-between items-start group border border-border/50 hover:border-border hover:bg-muted/50 transition-all flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white border border-border overflow-hidden shrink-0 shadow-sm">
                                                    {svc.thumbnail_url ? (
                                                        <img src={svc.thumbnail_url} alt={svc.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Sparkles className="w-6 h-6 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{svc.name}</h5>
                                                    <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">{svc.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => openEditService(cat, svc)} className="w-7 h-7 text-muted-foreground hover:text-primary">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <ConfirmDeleteDialog
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-red-500">
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    }
                                                    title="Delete Service?"
                                                    description={
                                                        <>Are you sure you want to remove <span className="font-bold text-foreground">"{svc.name}"</span> from the <span className="font-bold text-foreground">{cat.name}</span> category? This action cannot be undone.</>
                                                    }
                                                    onConfirm={() => handleDeleteService(svc.id)}
                                                    confirmLabel="Delete Service"
                                                    cancelLabel="Abort"
                                                />
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
