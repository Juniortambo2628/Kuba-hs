"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit, Briefcase, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
    id: number;
    name: string;
}

interface Service {
    id: string;
    name: string;
    description: string;
    category_id: number;
    category?: Category;
    thumbnail_url?: string;
    is_active: boolean;
}

export default function BaseServicesPage() {
    const { data: services, isLoading: servicesLoading, refetch: fetchServices } = useApiData<Service[]>("/api/admin/services", { initialData: [] });
    const { data: categories, isLoading: categoriesLoading } = useApiData<Category[]>("/api/admin/categories", { initialData: [], extractKey: 'categories' });
    
    const isLoading = servicesLoading || categoriesLoading;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({
        name: '',
        description: '',
        category_id: '',
    });

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (selectedService) {
                await axiosInstance.put(`/api/admin/services/${selectedService.id}`, form);
                toast.success("Service updated");
            } else {
                await axiosInstance.post("/api/admin/services", form);
                toast.success("New service defined");
            }
            fetchServices();
            setIsOpen(false);
            resetForm();
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { 
            await axiosInstance.delete(`/api/admin/services/${id}`); 
            toast.success("Service permanentally removed"); 
            fetchServices();
 
        } catch (err: any) { toast.error(handleApiError(err)); }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', category_id: '' });
        setSelectedService(null);
    };

    const openEdit = (service: Service) => { 
        setSelectedService(service); 
        setForm({
            name: service.name,
            description: service.description,
            category_id: service.category_id.toString(),
        }); 
        setIsOpen(true); 
    };

    const filteredServices = services.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-6">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-[500px] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <DashboardPageHeader 
                title="Service Blueprint" 
                subtitle="Master list of all professional services defined on the platform."
            >
                <div className="flex items-center gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search blueprints..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 bg-card/50 border-none rounded-2xl font-medium focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                onClick={resetForm} 
                                className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Define Service
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                    {selectedService ? "Edit Service Definition" : "New Service Blueprint"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Category Assignment</Label>
                                    <Select value={form.category_id} onValueChange={(val) => setForm({...form, category_id: val})}>
                                        <SelectTrigger className="h-12 bg-muted border-none rounded-xl font-bold">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Service Identity</Label>
                                    <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Interior Painting" className="h-12 bg-muted border-none rounded-xl font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Detailed Description</Label>
                                    <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="A comprehensive definition of this service..." className="min-h-[120px] bg-muted border-none rounded-xl pt-4" />
                                </div>
                                <Button onClick={handleSave} disabled={isSubmitting || !form.name || !form.category_id} className="w-full h-14 bg-primary hover:bg-black text-white font-bold rounded-2xl mt-4">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commit to Blueprint"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </DashboardPageHeader>

            <div className="bg-card/30 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Category</th>
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Narrative</th>
                            <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-widest text-muted-foreground">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredServices.map((service) => (
                            <tr key={service.id} className="group hover:bg-white/5 transition-colors">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-foreground block">{service.name}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase racking-tighter">UUID: {service.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                                        <span className="text-[11px] font-bold text-muted-foreground">{service.category?.name || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 max-w-sm">
                                    <p className="text-xs text-muted-foreground/80 line-clamp-1 leading-relaxed">{service.description}</p>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(service)} className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <ConfirmDeleteDialog
                                            trigger={
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-red-500 rounded-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            }
                                            title="Purge Blueprint?"
                                            description={
                                                <>Are you sure you want to delete the <span className="font-bold">"{service.name}"</span> definition? Warning: This will fail if any professionals are currently offering this service.</>
                                            }
                                            onConfirm={() => handleDelete(service.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredServices.length === 0 && (
                    <div className="py-20 text-center">
                        <Sparkles className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No services match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
