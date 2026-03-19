'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'sonner';
import { Booking } from '@/types';

const AdminBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedBookings, setSelectedBookings] = useState<Booking[] | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const statuses = [
        { label: 'All Status', value: null },
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
    ];

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const url = statusFilter ? `/api/admin/bookings?status=${statusFilter}` : '/api/admin/bookings';
            const res = await axiosInstance.get(url);
            setBookings(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, statusToUpdate: string) => {
        try {
            await axiosInstance.patch(`/api/bookings/${id}/status`, { status: statusToUpdate });
            toast.success(`Booking ${statusToUpdate}`);
            fetchBookings();
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Failed to update status');
        }
    };

    const confirmSelected = async () => {
        if (!selectedBookings) return;
        try {
            await Promise.all(selectedBookings.map(b => axiosInstance.patch(`/api/bookings/${b.id}/status`, { status: 'confirmed' })));
            toast.success(`Confirmed ${selectedBookings.length} bookings`);
            setSelectedBookings(null);
            fetchBookings();
        } catch (err) {
            toast.error('Batch update failed');
        }
    };

    const cancelSelected = async () => {
        if (!selectedBookings) return;
        if (!confirm(`Are you sure you want to cancel ${selectedBookings.length} bookings?`)) return;
        try {
            await Promise.all(selectedBookings.map(b => axiosInstance.patch(`/api/bookings/${b.id}/status`, { status: 'cancelled' })));
            toast.success(`Cancelled ${selectedBookings.length} bookings`);
            setSelectedBookings(null);
            fetchBookings();
        } catch (err) {
            toast.error('Batch update failed');
        }
    };

    const statusBodyTemplate = (rowData: Booking) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'confirmed': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return null;
        }
    };

    const priceBodyTemplate = (rowData: Booking) => {
        return <span className="font-bold">${rowData.final_price || rowData.estimated_price || '0.00'}</span>;
    };

    const dateBodyTemplate = (rowData: Booking) => {
        return new Date(rowData.scheduled_date).toLocaleDateString();
    };

    const actionBodyTemplate = (rowData: Booking) => {
        return (
            <div className="flex gap-2">
                {rowData.status === 'pending' && (
                    <Button icon="pi pi-check" className="p-button-rounded p-button-success p-button-sm" onClick={() => updateStatus(rowData.id, 'confirmed')} tooltip="Confirm" />
                )}
                {(rowData.status === 'confirmed' || rowData.status === 'pending') && (
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-sm" onClick={() => updateStatus(rowData.id, 'cancelled')} tooltip="Cancel" />
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
            <h5 className="m-0">Manage Bookings</h5>
            <div className="flex flex-wrap gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Global Search" />
                </span>
                <Dropdown value={statusFilter} options={statuses} onChange={(e) => setStatusFilter(e.value)} placeholder="Select Status" className="w-full md:w-12rem" />
                {selectedBookings && selectedBookings.length > 0 && (
                    <>
                        <Button label="Confirm Selected" icon="pi pi-check" className="p-button-success" onClick={confirmSelected} />
                        <Button label="Cancel Selected" icon="pi pi-danger" className="p-button-danger" onClick={cancelSelected} />
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="card border-none shadow-none">
            <DataTable 
                value={bookings} 
                paginator 
                rows={10} 
                dataKey="id" 
                loading={loading}
                globalFilter={globalFilterValue}
                header={header}
                selection={selectedBookings}
                onSelectionChange={(e) => setSelectedBookings(e.value as Booking[])}
                responsiveLayout="scroll"
                emptyMessage="No bookings found."
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="booking_number" header="Reference" body={(data) => <span className="font-bold text-primary">#{data.booking_number}</span>} sortable />
                <Column field="service.name" header="Service" sortable />
                <Column field="customer.name" header="Customer" sortable />
                <Column field="provider.business_name" header="Provider" body={(data) => data.provider?.business_name || 'Individual'} sortable />
                <Column field="scheduled_date" header="Scheduled Date" body={dateBodyTemplate} sortable />
                <Column field="final_price" header="Value" body={priceBodyTemplate} sortable />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                <Column body={actionBodyTemplate} header="Actions" exportable={false} style={{ minWidth: '8rem' }} />
            </DataTable>
        </div>
    );
};

export default AdminBookings;
