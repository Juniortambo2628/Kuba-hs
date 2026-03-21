'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Booking, Provider } from '@/types';
import Link from 'next/link';

interface ProviderStats {
    total_earnings: number;
    active_bookings: number;
    completed_bookings: number;
    avg_rating: number;
}

interface ProviderDashboardData {
    stats: ProviderStats;
    recent_bookings: Booking[];
    profile: Partial<Provider>;
}

const ProviderDashboard = () => {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<ProviderDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (user?.role === 'provider') {
                fetchDashboard();
            } else if (user) {
                router.push('/dashboard' as any);
            } else {
                router.push('/login');
            }
        }
    }, [authLoading, user]);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/provider/dashboard');
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch provider dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId: number, status: string) => {
        setUpdatingId(bookingId);
        try {
            await axiosInstance.patch(`/api/bookings/${bookingId}/status`, { status });
            fetchDashboard();
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingId(null);
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

    const actionBodyTemplate = (rowData: Booking) => {
        return (
            <div className="flex gap-2">
                {rowData.status === 'pending' && (
                    <Button 
                        icon="pi pi-check" 
                        className="p-button-rounded p-button-success p-button-sm" 
                        onClick={() => handleStatusUpdate(rowData.id, 'confirmed')}
                        loading={updatingId === rowData.id}
                        tooltip="Accept Order"
                    />
                )}
                {rowData.status === 'confirmed' && (
                    <Button 
                        icon="pi pi-flag" 
                        className="p-button-rounded p-button-info p-button-sm" 
                        onClick={() => handleStatusUpdate(rowData.id, 'completed')}
                        loading={updatingId === rowData.id}
                        tooltip="Mark Completed"
                    />
                )}
                <Link href={`/provider/bookings` as any}>
                    <Button icon="pi pi-external-link" className="p-button-rounded p-button-secondary p-button-sm" />
                </Link>
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div>
                        <h2 className="m-0">Merchant Portal</h2>
                        <p className="text-secondary">Logged in as {user?.name} — Managing Kuba Marketplace Operations.</p>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <Link href="/provider/services">
                            <Button label="Add Service" icon="pi pi-plus" className="p-button-primary mr-2" />
                        </Link>
                        <Link href={"/provider/profile" as any}>
                            <Button label="Business Profile" icon="pi pi-user" className="p-button-outlined" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Revenue</span>
                            <div className="text-900 font-medium text-xl">${Number(data?.stats?.total_earnings || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Paid out </span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Incoming Jobs</span>
                            <div className="text-900 font-medium text-xl">{data?.stats?.active_bookings || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-clock text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-orange-500 font-medium">Action required </span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Success Rate</span>
                            <div className="text-900 font-medium text-xl">{data?.stats?.completed_bookings || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check-circle text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Total served</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Merchant Rating</span>
                            <div className="text-900 font-medium text-xl">{Number(data?.stats?.avg_rating || 5.0).toFixed(1)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-star text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-purple-500 font-medium">Elite status </span>
                </div>
            </div>

            <div className="col-12 xl:col-8">
                <div className="card">
                    <h5>Work Order Monitor</h5>
                    <DataTable value={data?.recent_bookings || []} rows={10} paginator responsiveLayout="scroll" loading={loading}>
                        <Column field="id" header="ID" sortable body={(data) => <span className="font-bold">#{data.id || data.booking_number}</span>} />
                        <Column field="service.name" header="Service" sortable body={(data) => <span className="capitalize">{data.service?.name}</span>} />
                        <Column field="customer.name" header="Customer" sortable />
                        <Column field="scheduled_date" header="Date" body={(data) => new Date(data.scheduled_date).toLocaleDateString()} sortable />
                        <Column field="status" header="Status" body={statusBodyTemplate} />
                        <Column body={actionBodyTemplate} header="Actions" />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card flex flex-column align-items-center justify-content-center text-center p-5">
                    <i className="pi pi-briefcase text-primary mb-3" style={{ fontSize: '3rem' }} />
                    <h3 className="m-0">Expand Portfolio</h3>
                    <p className="text-secondary mt-2 mb-4">Add more services to your Kuba profile to reach more customers and increase your revenue potential.</p>
                    <Link href="/provider/services" className="w-full">
                        <Button label="Get Started" className="w-full p-button-primary" />
                    </Link>
                </div>

                <div className="card mt-4">
                    <h5>Merchant Tools</h5>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 border-bottom-1 surface-border">
                            <i className="pi pi-clock text-blue-500 mr-3 text-xl" />
                            <Link href={"/provider/schedule" as any} className="text-900 font-medium text-sm flex-grow-1 cursor-pointer hover:text-primary">Availability Manager</Link>
                            <i className="pi pi-chevron-right text-500" />
                        </li>
                        <li className="flex align-items-center py-3 border-bottom-1 surface-border">
                            <i className="pi pi-star text-yellow-500 mr-3 text-xl" />
                            <Link href={"/provider/reviews" as any} className="text-900 font-medium text-sm flex-grow-1 cursor-pointer hover:text-primary">Merchant Feedback</Link>
                            <i className="pi pi-chevron-right text-500" />
                        </li>
                        <li className="flex align-items-center py-3">
                            <i className="pi pi-chart-line text-green-500 mr-3 text-xl" />
                            <Link href={"/provider/earnings" as any} className="text-900 font-medium text-sm flex-grow-1 cursor-pointer hover:text-primary">Earnings Reports</Link>
                            <i className="pi pi-chevron-right text-500" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
