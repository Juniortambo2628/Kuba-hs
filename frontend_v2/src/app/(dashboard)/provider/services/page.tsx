'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'sonner';
import { FileUpload } from 'primereact/fileupload';
import { ProviderService, Service, Category } from '@/types';

const ProviderServices = () => {
    const [services, setServices] = useState<ProviderService[]>([]);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<ProviderService> | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/provider/services');
            setServices(res.data.services);
            setAvailableServices(res.data.available_services);
        } catch (err) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setCurrentService({ service_id: undefined, base_price: 0 });
        setIsDialogVisible(true);
    };

    const editService = (service: ProviderService) => {
        setCurrentService({ ...service });
        setIsDialogVisible(true);
    };

    const deleteService = async (id: number) => {
        if (!confirm('Are you sure you want to remove this service?')) return;
        try {
            await axiosInstance.delete(`/api/provider/services/${id}`);
            toast.success('Service removed');
            fetchServices();
        } catch (err) {
            toast.error('Failed to remove service');
        }
    };

    const saveService = async () => {
        if (!currentService?.service_id || currentService.base_price === undefined) {
            toast.error('Please fill all fields');
            return;
        }
        setSubmitting(true);
        try {
            if (currentService.id) {
                await axiosInstance.put(`/api/provider/services/${currentService.id}`, currentService);
                toast.success('Service updated');
            } else {
                await axiosInstance.post('/api/provider/services', currentService);
                toast.success('Service added');
            }
            setIsDialogVisible(false);
            fetchServices();
        } catch (err) {
            toast.error('Failed to save service');
        } finally {
            setSubmitting(false);
        }
    };

    const onUpload = async (event: any, serviceId: number) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('collection', 'services');
        formData.append('model_type', 'provider_service');
        formData.append('model_id', serviceId.toString());

        try {
            await axiosInstance.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Image uploaded');
            fetchServices();
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    const deleteImage = async (mediaId: number) => {
        try {
            await axiosInstance.delete(`/api/media/${mediaId}`);
            toast.success('Image removed');
            fetchServices();
        } catch (err) {
            toast.error('Failed to remove image');
        }
    };

    const galleryTemplate = (rowData: ProviderService) => {
        return (
            <div className="flex gap-2 flex-wrap max-w-20rem">
                {rowData.image_urls?.map((img: any) => (
                    <div key={img.id} className="relative w-3rem h-3rem border-round overflow-hidden border-1 surface-border group">
                        <img src={img.url || "/placeholder-light.png"} className="w-full h-full object-cover" alt="" />
                        <button 
                            onClick={() => deleteImage(img.id)}
                            className="absolute inset-0 bg-red-500 opacity-0 hover:opacity-80 transition-opacity flex align-items-center justify-content-center border-none cursor-pointer"
                        >
                            <i className="pi pi-trash text-white text-xs" />
                        </button>
                    </div>
                ))}
                <FileUpload 
                    mode="basic" 
                    name="demo[]" 
                    auto 
                    customUpload 
                    uploadHandler={(e) => onUpload(e, rowData.id)} 
                    className="p-button-outlined p-button-sm w-3rem h-3rem"
                />
            </div>
        );
    };

    const priceBodyTemplate = (rowData: ProviderService) => {
        return <span className="font-bold">${Number(rowData.base_price).toLocaleString()}</span>;
    };

    const actionBodyTemplate = (rowData: ProviderService) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-sm" onClick={() => editService(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm" onClick={() => deleteService(rowData.id)} />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Your Service Portfolio</h5>
            <Button label="Add New Service" icon="pi pi-plus" className="p-button-primary" onClick={openNew} />
        </div>
    );

    return (
        <div className="card border-none shadow-none">
            <DataTable 
                value={services} 
                header={header} 
                loading={loading} 
                responsiveLayout="scroll"
                emptyMessage="No services added to your portfolio."
            >
                <Column field="service.name" header="Service Name" sortable body={(data) => <span className="font-medium">{data.service?.name}</span>} />
                <Column field="service.category.name" header="Category" sortable />
                <Column header="Gallery" body={galleryTemplate} style={{ minWidth: '15rem' }} />
                <Column field="base_price" header="Base Price" body={priceBodyTemplate} sortable />
                <Column body={actionBodyTemplate} align="right" />
            </DataTable>

            <Dialog 
                header={currentService?.id ? 'Edit Service Offering' : 'Add New Service Offering'} 
                visible={isDialogVisible} 
                style={{ width: '400px' }} 
                onHide={() => setIsDialogVisible(false)}
                footer={(
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setIsDialogVisible(false)} />
                        <Button label="Save" icon="pi pi-check" onClick={saveService} loading={submitting} />
                    </div>
                )}
            >
                <div className="flex flex-column gap-3 py-2">
                    <div className="flex flex-column gap-2">
                        <label className="font-semibold">Select Service</label>
                        <Dropdown 
                            value={currentService?.service_id} 
                            options={availableServices} 
                            optionLabel="name" 
                            optionValue="id" 
                            onChange={(e) => setCurrentService({ ...currentService, service_id: e.value })} 
                            placeholder="Choose a service"
                            disabled={!!currentService?.id}
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className="font-semibold">Base Price ($)</label>
                        <InputNumber 
                            value={currentService?.base_price} 
                            onValueChange={(e) => setCurrentService({ ...currentService, base_price: e.value || 0 })} 
                            mode="currency" 
                            currency="USD" 
                            locale="en-US" 
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProviderServices;
