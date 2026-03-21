'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance, { handleApiError } from '@/lib/axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { toast } from 'sonner';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Service, Category } from '@/types';

const iconMap: Record<string, string> = {
    car: 'pi-car',
    home: 'pi-home',
    heart: 'pi-heart',
    briefcase: 'pi-briefcase',
    building: 'pi-building',
    sparkles: 'pi-sparkles',
    droplet: 'pi-filter',
    bolt: 'pi-bolt',
    wrench: 'pi-wrench',
};

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState(1); // 1 = asc, -1 = desc
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSvcOpen, setIsSvcOpen] = useState(false);
    const [catForm, setCatForm] = useState({ name: '', description: '', iconContext: 'wrench' });
    const [svcForm, setSvcForm] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/api/admin/categories");
            setCategories(res.data.categories);
        } catch (err) { toast.error("Failed to load categories"); }
        finally { setIsLoading(false); }
    };

    const filteredCategories = React.useMemo(() => {
        let result = [...categories];

        // Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(cat => 
                cat.name.toLowerCase().includes(lowSearch) || 
                cat.description.toLowerCase().includes(lowSearch) ||
                cat.services?.some(s => s.name.toLowerCase().includes(lowSearch))
            );
        }

        // Sort
        result.sort((a, b) => {
            const valA = (a as any)[sortKey]?.toString().toLowerCase() || "";
            const valB = (b as any)[sortKey]?.toString().toLowerCase() || "";
            if (valA < valB) return -1 * sortOrder;
            if (valA > valB) return 1 * sortOrder;
            return 0;
        });

        return result;
    }, [categories, searchTerm, sortKey, sortOrder]);

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

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>, svcId: number) => {
        if (!e.target.files?.[0]) return;
        
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('collection', 'thumbnail');
        formData.append('model_type', 'service');
        formData.append('model_id', svcId.toString());

        setIsSubmitting(true);
        try {
            await axiosInstance.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Thumbnail uploaded");
            fetchCategories();
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight m-0">Service Categories</h2>
                    <p className="text-xs text-muted-foreground font-medium">Organize and manage global service offerings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="p-input-icon-left w-full md:w-64">
                        <i className="pi pi-search text-xs" />
                        <InputText 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Fuzzy search..." 
                            className="w-full text-xs h-9 rounded-lg border-border/60 bg-white/50 dark:bg-zinc-900/50"
                        />
                    </span>
                    <Button 
                        label="New Category" 
                        icon="pi pi-plus" 
                        className="bg-primary border-primary text-white text-xs h-9 px-4 rounded-lg font-bold tracking-tight shadow-sm hover:bg-primary/90 transition-all gap-2" 
                        onClick={() => { setSelectedCat(null); setCatForm({ name: '', description: '', iconContext: 'wrench' }); setIsCatOpen(true); }} 
                    />
                </div>
            </div>
        );
    };

    const itemTemplate = (cat: Category) => {
        return (
            <div className="col-12 md:col-6 lg:col-4 p-3 font-sans">
                <Card className="h-full border-1 border-border/40 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 group/card">
                    <div className="flex align-items-start justify-content-between mb-4">
                        <div className="flex align-items-center">
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 mr-4 group-hover/card:scale-110 transition-transform">
                                <i className={`pi ${iconMap[cat.icon || 'wrench']} text-primary text-xl`} />
                            </div>
                            <div>
                                <h4 className="m-0 text-foreground font-bold tracking-tight leading-tight">{cat.name}</h4>
                                <p className="text-muted-foreground m-0 text-xs font-medium line-clamp-1 mt-0.5">{cat.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary p-button-sm hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => openEditCat(cat)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDeleteCategory(cat.id)} />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-black/40 border border-border/40 rounded-xl p-4">
                        <div className="flex align-items-center justify-content-between mb-3">
                            <span className="text-[11px] font-bold tracking-tight text-muted-foreground">SERVICES ({cat.services?.length || 0})</span>
                            <Button label="Add New" icon="pi pi-plus" className="p-button-text p-button-sm p-0 h-auto text-[11px] font-bold tracking-tight text-primary hover:underline" onClick={() => openAddService(cat)} />
                        </div>
                        {cat.services?.length ? (
                            <div className="flex flex-column gap-2.5">
                                {cat.services.map(svc => (
                                    <div key={svc.id} className="flex align-items-center justify-content-between p-2.5 bg-white dark:bg-zinc-900 border border-border/20 rounded-lg shadow-sm group/svc">
                                        <div className="flex align-items-center overflow-hidden">
                                            {svc.thumbnail_url ? (
                                                <img src={svc.thumbnail_url} alt={svc.name} className="w-8 h-8 rounded-lg object-cover mr-3 border border-border/10" />
                                            ) : (
                                                <div className="w-8 h-8 bg-muted rounded-lg flex align-items-center justify-center mr-3 border border-dashed border-border/40">
                                                    <i className="pi pi-image text-muted-foreground/30 text-xs" />
                                                </div>
                                            )}
                                            <span className="text-xs font-bold text-foreground tracking-tight truncate">{svc.name}</span>
                                        </div>
                                        <div className="flex gap-1 ml-2 opacity-0 group-hover/svc:opacity-100 transition-opacity">
                                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary p-button-sm w-7 h-7" onClick={() => openEditService(cat, svc)} />
                                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm w-7 h-7" onClick={() => handleDeleteService(svc.id)} />
                                        </div>
                                    </div>
                                    
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] text-muted-foreground text-center m-0 py-3 italic font-medium">No specialized services yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="card border-none shadow-none bg-transparent p-0">
            {renderHeader()}
            
            <DataView 
                value={filteredCategories} 
                itemTemplate={itemTemplate} 
                className="mt-6 admin-content-area" 
                emptyMessage="No categories discovered matching those credentials."
            />

            {/* Category Dialog */}
            <Dialog 
                header={selectedCat ? "Update Category" : "Build New Category"} 
                visible={isCatOpen} 
                style={{ width: '450px' }} 
                onHide={() => setIsCatOpen(false)}
                className="rounded-3xl overflow-hidden shadow-2xl"
                headerClassName="text-lg font-bold tracking-tight border-b border-border/10 p-6 bg-white dark:bg-zinc-900"
                contentClassName="p-6 bg-white dark:bg-zinc-900"
            >
                <div className="flex flex-column gap-5 py-2">
                    <div className="flex flex-column gap-2">
                        <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Category Title</label>
                        <InputText 
                            value={catForm.name} 
                            onChange={(e) => setCatForm({...catForm, name: e.target.value})} 
                            className="h-11 rounded-xl bg-slate-50 dark:bg-black/40 border-border/40 font-bold text-sm px-4 focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Narrative Description</label>
                        <InputTextarea 
                            value={catForm.description} 
                            onChange={(e) => setCatForm({...catForm, description: e.target.value})} 
                            rows={3} 
                            autoResize 
                            className="rounded-xl bg-slate-50 dark:bg-black/40 border-border/40 font-medium text-sm p-4 focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Icon Representation</label>
                        <div className="grid grid-nogutter gap-2 p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-dashed border-border/40">
                            {Object.entries(iconMap).map(([id, icon]) => (
                                <Button 
                                    key={id} 
                                    type="button" 
                                    icon={`pi ${icon}`} 
                                    className={`p-button-sm rounded-lg transition-all ${catForm.iconContext === id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white dark:bg-zinc-900 border-border/40 text-muted-foreground hover:bg-muted'}`}
                                    onClick={() => setCatForm({...catForm, iconContext: id})}
                                    style={{ width: '40px', height: '40px', padding: 0 }}
                                />
                            ))}
                        </div>
                    </div>
                    <Button 
                        label={selectedCat ? "Synchronize Changes" : "Confirm Creation"} 
                        icon="pi pi-check" 
                        onClick={handleSaveCategory} 
                        loading={isSubmitting} 
                        disabled={!catForm.name} 
                        className="h-12 bg-primary border-primary text-white rounded-xl font-bold tracking-tight mt-2 shadow-lg shadow-primary/20"
                    />
                </div>
            </Dialog>

            {/* Service Dialog */}
            <Dialog 
                header={selectedSvc ? `Refine Service` : `Provision New Service`} 
                visible={isSvcOpen} 
                style={{ width: '450px' }} 
                onHide={() => setIsSvcOpen(false)}
                className="rounded-3xl overflow-hidden shadow-2xl"
                headerClassName="text-lg font-bold tracking-tight border-b border-border/10 p-6 bg-white dark:bg-zinc-900"
                contentClassName="p-6 bg-white dark:bg-zinc-900"
            >
                <div className="flex flex-column gap-5 py-2">
                    <div className="flex flex-column gap-2">
                        <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Service Designation</label>
                        <InputText 
                            value={svcForm.name} 
                            onChange={(e) => setSvcForm({...svcForm, name: e.target.value})} 
                            className="h-11 rounded-xl bg-slate-50 dark:bg-black/40 border-border/40 font-bold text-sm px-4 focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Service Scope</label>
                        <InputTextarea 
                            value={svcForm.description} 
                            onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} 
                            rows={3} 
                            autoResize 
                            className="rounded-xl bg-slate-50 dark:bg-black/40 border-border/40 font-medium text-sm p-4 focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    {selectedSvc && (
                        <div className="flex flex-column gap-2">
                            <label className="text-[11px] font-bold text-muted-foreground tracking-tight ml-1">Visual Asset (Thumbnail)</label>
                            <div className="flex align-items-center gap-4 p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-dashed border-border/40">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden border border-border/20 shadow-sm relative group/thumb">
                                    {selectedSvc.thumbnail_url ? (
                                        <img src={selectedSvc.thumbnail_url} alt="Service" className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110" />
                                    ) : (
                                        <i className="pi pi-sparkles text-2xl text-muted-foreground/30" />
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <label className="cursor-pointer bg-white dark:bg-zinc-900 border border-border/40 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight hover:bg-muted transition-colors inline-block">
                                        CHOOSE FILE
                                        <input type="file" onChange={(e) => handleThumbnailUpload(e, selectedSvc.id)} accept="image/*" className="hidden" />
                                    </label>
                                    <p className="text-[9px] text-muted-foreground mt-2 uppercase font-bold tracking-widest opacity-50">JPG, PNG OR WEBP</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button 
                        label={selectedSvc ? "Commit Refinements" : "Finalize Provisioning"} 
                        icon="pi pi-check" 
                        onClick={handleSaveService} 
                        loading={isSubmitting} 
                        disabled={!svcForm.name} 
                        className="h-12 bg-primary border-primary text-white rounded-xl font-bold tracking-tight mt-2 shadow-lg shadow-primary/20"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
