"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, LayoutGrid, Wrench, Trash2, Edit, Car, Home, Heart, Briefcase, Building2, Sparkles, Droplet, Zap } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
    id: number;
    name: string;
    description: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    services: Service[];
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);

    // Modals state
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSvcOpen, setIsSvcOpen] = useState(false);

    // Form states
    const [catForm, setCatForm] = useState({ name: '', description: '', iconContext: 'wrench' });
    const [svcForm, setSvcForm] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/categories");
            setCategories(res.data.categories);
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCategory = async () => {
        setIsSubmitting(true);
        try {
            if (selectedCat) {
                await axiosInstance.put(`/api/admin/categories/${selectedCat.id}`, {
                    ...catForm,
                    icon: catForm.iconContext
                });
                toast.success("Category updated");
            } else {
                await axiosInstance.post("/api/admin/categories", {
                    ...catForm,
                    icon: catForm.iconContext
                });
                toast.success("Category created");
            }
            fetchCategories();
            setIsCatOpen(false);
            setCatForm({ name: '', description: '', iconContext: 'wrench' });
            setSelectedCat(null);
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure? This will delete all services under this category too.")) return;
        try {
            await axiosInstance.delete(`/api/admin/categories/${id}`);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err: any) {
            toast.error(handleApiError(err));
        }
    };

    const handleSaveService = async () => {
        if (!selectedCat) return;
        setIsSubmitting(true);
        try {
            if (selectedSvc) {
                await axiosInstance.put(`/api/admin/services/${selectedSvc.id}`, svcForm);
                toast.success("Service updated");
            } else {
                await axiosInstance.post("/api/admin/services", {
                    ...svcForm,
                    category_id: selectedCat.id
                });
                toast.success("Service added");
            }
            fetchCategories();
            setIsSvcOpen(false);
            setSvcForm({ name: '', description: '' });
            setSelectedSvc(null);
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Delete this service?")) return;
        try {
            await axiosInstance.delete(`/api/admin/services/${id}`);
            toast.success("Service deleted");
            fetchCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const openEditCat = (cat: Category) => {
        setSelectedCat(cat);
        setCatForm({ name: cat.name, description: cat.description, iconContext: cat.icon || 'wrench' });
        setIsCatOpen(true);
    };

    const openAddService = (cat: Category) => {
        setSelectedCat(cat);
        setSelectedSvc(null);
        setSvcForm({ name: '', description: '' });
        setIsSvcOpen(true);
    };

    const openEditService = (cat: Category, svc: Service) => {
        setSelectedCat(cat);
        setSelectedSvc(svc);
        setSvcForm({ name: svc.name, description: svc.description });
        setIsSvcOpen(true);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
                <Skeleton className="h-12 w-64 rounded-2xl" />
                <div className="grid grid-cols-1 gap-6"><Skeleton className="h-64 rounded-2xl" /></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#1E293B] tracking-tight uppercase">
                        Service <span className="text-sky-600">Categories</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm">Manage platform marketplace offerings.</p>
                </div>
                <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => { setSelectedCat(null); setCatForm({ name: '', description: '', iconContext: 'wrench' }); }} 
                            className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[11px]"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white outline-none border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase text-[#1E293B]">
                                {selectedCat ? "Edit Category" : "New Category"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</Label>
                                <Input 
                                    className="bg-gray-50 border-none rounded-xl h-14 font-bold"
                                    value={catForm.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCatForm({...catForm, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</Label>
                                <Textarea 
                                    className="bg-gray-50 border-none rounded-xl min-h-[100px] font-medium"
                                    value={catForm.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCatForm({...catForm, description: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Icon</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        { id: 'wrench', icon: <Wrench className="w-4 h-4" /> },
                                        { id: 'car', icon: <Car className="w-4 h-4" /> },
                                        { id: 'home', icon: <Home className="w-4 h-4" /> },
                                        { id: 'heart', icon: <Heart className="w-4 h-4" /> },
                                        { id: 'briefcase', icon: <Briefcase className="w-4 h-4" /> },
                                        { id: 'building', icon: <Building2 className="w-4 h-4" /> },
                                        { id: 'sparkles', icon: <Sparkles className="w-4 h-4" /> },
                                        { id: 'droplet', icon: <Droplet className="w-4 h-4" /> },
                                        { id: 'bolt', icon: <Zap className="w-4 h-4" /> },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setCatForm({...catForm, iconContext: item.id})}
                                            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${catForm.iconContext === item.id ? "bg-sky-50 border-sky-200 text-sky-600" : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"}`}
                                        >
                                            {item.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button 
                                onClick={handleSaveCategory} 
                                disabled={isSubmitting || !catForm.name} 
                                className="w-full h-14 rounded-xl bg-[#1E293B] hover:bg-black text-white font-black uppercase tracking-widest mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Category"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Sub-Service Dialog */}
            <Dialog open={isSvcOpen} onOpenChange={setIsSvcOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white outline-none border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase text-[#1E293B]">
                            {selectedSvc ? `Edit ${selectedSvc.name}` : `Add Service to ${selectedCat?.name}`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service Title</Label>
                            <Input 
                                className="bg-gray-50 border-none rounded-xl h-14 font-bold"
                                value={svcForm.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvcForm({...svcForm, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</Label>
                            <Textarea 
                                className="bg-gray-50 border-none rounded-xl min-h-[100px] font-medium"
                                value={svcForm.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSvcForm({...svcForm, description: e.target.value})}
                            />
                        </div>
                        <Button 
                            onClick={handleSaveService} 
                            disabled={isSubmitting || !svcForm.name} 
                            className="w-full h-14 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest mt-4"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Service"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                {categories.map((cat) => (
                    <Card key={cat.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F8FAFC]/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
                                    {cat.icon === 'car' ? <Car className="w-6 h-6 text-sky-600" /> : 
                                     cat.icon === 'home' ? <Home className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'heart' ? <Heart className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'briefcase' ? <Briefcase className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'building' ? <Building2 className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'sparkles' ? <Sparkles className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'droplet' ? <Droplet className="w-6 h-6 text-sky-600" /> :
                                     cat.icon === 'bolt' ? <Zap className="w-6 h-6 text-sky-600" /> :
                                     <Wrench className="w-6 h-6 text-sky-600" />}
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-[#1E293B] uppercase">{cat.name}</CardTitle>
                                    <p className="text-sm text-gray-500">{cat.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditCat(cat)} className="h-10 rounded-lg text-gray-500">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(cat.id)} className="h-10 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Included Services</h4>
                                <Button variant="ghost" size="sm" onClick={() => openAddService(cat)} className="text-sky-600 font-bold uppercase tracking-wider text-[10px] hover:bg-sky-50 rounded-xl px-4 py-2 h-auto">
                                    <Plus className="w-3 h-3 mr-2" /> Add New
                                </Button>
                            </div>
                            
                            {cat.services?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cat.services.map(svc => (
                                        <div key={svc.id} className="bg-[#F8FAFC] rounded-2xl p-4 flex justify-between items-start group">
                                            <div>
                                                <h5 className="font-bold text-[#1E293B] text-sm group-hover:text-sky-600 transition-colors uppercase italic">{svc.name}</h5>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 italic">{svc.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => openEditService(cat, svc)}
                                                    className="text-sky-400 hover:text-sky-600 hover:bg-sky-50 w-8 h-8 rounded-full"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteService(svc.id)}
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 w-8 h-8 rounded-full"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-2xl">
                                    <p className="text-sm text-gray-400 font-medium">No services added to this category yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
