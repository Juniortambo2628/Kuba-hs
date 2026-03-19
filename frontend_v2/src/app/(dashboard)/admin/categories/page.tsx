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
            <div className="flex justify-content-between align-items-center">
                <h2 className="m-0">Categories</h2>
                <Button label="Add Category" icon="pi pi-plus" className="p-button-primary" onClick={() => { setSelectedCat(null); setCatForm({ name: '', description: '', iconContext: 'wrench' }); setIsCatOpen(true); }} />
            </div>
        );
    };

    const itemTemplate = (cat: Category) => {
        return (
            <div className="col-12 md:col-6 lg:col-4 p-2">
                <Card className="h-full border-1 surface-border shadow-none">
                    <div className="flex align-items-start justify-content-between mb-3">
                        <div className="flex align-items-center">
                            <i className={`pi ${iconMap[cat.icon || 'wrench']} text-primary mr-3 text-2xl`} />
                            <div>
                                <h4 className="m-0 text-900">{cat.name}</h4>
                                <p className="text-500 m-0 text-sm line-clamp-1">{cat.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-sm" onClick={() => openEditCat(cat)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm" onClick={() => handleDeleteCategory(cat.id)} />
                        </div>
                    </div>

                    <div className="surface-100 border-round p-3">
                        <div className="flex align-items-center justify-content-between mb-2">
                            <span className="text-sm font-bold text-700">Services</span>
                            <Button label="Add" icon="pi pi-plus" className="p-button-text p-button-sm p-0 h-auto" onClick={() => openAddService(cat)} />
                        </div>
                        {cat.services?.length ? (
                            <div className="flex flex-column gap-2">
                                {cat.services.map(svc => (
                                    <div key={svc.id} className="flex align-items-center justify-content-between p-2 surface-0 border-round">
                                        <div className="flex align-items-center overflow-hidden">
                                            {svc.thumbnail_url ? (
                                                <img src={svc.thumbnail_url} alt={svc.name} className="w-2rem h-2rem border-round object-cover mr-2" />
                                            ) : (
                                                <div className="w-2rem h-2rem bg-100 border-round flex align-items-center justify-center mr-2">
                                                    <i className="pi pi-image text-400" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium truncate">{svc.name}</span>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-sm w-2rem h-2rem" onClick={() => openEditService(cat, svc)} />
                                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm w-2rem h-2rem" onClick={() => handleDeleteService(svc.id)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-500 text-center m-0 py-2">No services yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="card border-none shadow-none bg-transparent">
            {renderHeader()}
            
            <DataView value={categories} itemTemplate={itemTemplate} className="mt-4" />

            {/* Category Dialog */}
            <Dialog header={selectedCat ? "Edit Category" : "New Category"} visible={isCatOpen} style={{ width: '450px' }} onHide={() => setIsCatOpen(false)}>
                <div className="flex flex-column gap-3 py-2">
                    <div className="flex flex-column gap-2">
                        <label className="font-bold">Name</label>
                        <InputText value={catForm.name} onChange={(e) => setCatForm({...catForm, name: e.target.value})} />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="font-bold">Description</label>
                        <InputTextarea value={catForm.description} onChange={(e) => setCatForm({...catForm, description: e.target.value})} rows={3} autoResize />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="font-bold">Icon</label>
                        <div className="grid grid-nogutter gap-1">
                            {Object.entries(iconMap).map(([id, icon]) => (
                                <Button 
                                    key={id} 
                                    type="button" 
                                    icon={`pi ${icon}`} 
                                    className={`p-button-sm ${catForm.iconContext === id ? 'p-button-primary' : 'p-button-outlined p-button-secondary'}`}
                                    onClick={() => setCatForm({...catForm, iconContext: id})}
                                    style={{ width: '40px', height: '40px' }}
                                />
                            ))}
                        </div>
                    </div>
                    <Button label="Save Category" icon="pi pi-check" onClick={handleSaveCategory} loading={isSubmitting} disabled={!catForm.name} />
                </div>
            </Dialog>

            {/* Service Dialog */}
            <Dialog header={selectedSvc ? `Edit ${selectedSvc.name}` : `Add Service to ${selectedCat?.name}`} visible={isSvcOpen} style={{ width: '450px' }} onHide={() => setIsSvcOpen(false)}>
                <div className="flex flex-column gap-3 py-2">
                    <div className="flex flex-column gap-2">
                        <label className="font-bold">Service Name</label>
                        <InputText value={svcForm.name} onChange={(e) => setSvcForm({...svcForm, name: e.target.value})} />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="font-bold">Description</label>
                        <InputTextarea value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} rows={3} autoResize />
                    </div>
                    {selectedSvc && (
                        <div className="flex flex-column gap-2">
                            <label className="font-bold">Thumbnail</label>
                            <div className="flex align-items-center gap-3">
                                <div className="w-4rem h-4rem bg-100 border-round flex align-items-center justify-center overflow-hidden border-1 surface-border">
                                    {selectedSvc.thumbnail_url ? (
                                        <img src={selectedSvc.thumbnail_url} alt="Service" className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="pi pi-sparkles text-3xl text-400" />
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <input type="file" onChange={(e) => handleThumbnailUpload(e, selectedSvc.id)} accept="image/*" className="text-xs" />
                                </div>
                            </div>
                        </div>
                    )}
                    <Button label="Save Service" icon="pi pi-check" onClick={handleSaveService} loading={isSubmitting} disabled={!svcForm.name} />
                </div>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
