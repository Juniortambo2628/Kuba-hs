'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Booking } from '@/types';

interface AdminStats {
    total_users: number;
    total_bookings: number;
    avg_rating: number;
    platform_revenue: number;
    growth: {
        users: number;
        bookings: number;
        revenue: number;
    };
}

const AdminDashboard = () => {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [trends, setTrends] = useState<any>({ users: [], bookings: [], revenue: [] });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const [lineOptions, setLineOptions] = useState<any>(null);
    const [barOptions, setBarOptions] = useState<any>(null);

    useEffect(() => {
        if (!authLoading) {
            if (user?.role === 'admin') {
                fetchData();
            } else if (user) {
                router.push('/dashboard' as any);
            } else {
                router.push('/login');
            }
        }
    }, [authLoading, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, bookingsRes] = await Promise.all([
                axiosInstance.get('/api/admin/analytics'),
                axiosInstance.get('/api/admin/bookings?limit=10'),
            ]);
            setStats({
                ...analyticsRes.data.summary,
                growth: analyticsRes.data.growth
            });
            setTrends(analyticsRes.data.trends || { users: [], bookings: [], revenue: [] });
            setBookings(bookingsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        setLineOptions({
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        });

        setBarOptions({
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        });
    }, [layoutConfig]);

    const lineData = {
        labels: trends.revenue.map((d: any) => d.date),
        datasets: [
            {
                label: 'Revenue',
                data: trends.revenue.map((d: any) => d.count),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            }
        ]
    };

    const barData = {
        labels: trends.users.map((d: any) => d.date),
        datasets: [
            {
                label: 'New Users',
                backgroundColor: '#00bb7e',
                data: trends.users.map((d: any) => d.count)
            }
        ]
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

    const customerBodyTemplate = (rowData: Booking) => {
        return (
            <div className="flex align-items-center">
                <span className="ml-2 font-bold">{rowData.customer?.name}</span>
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Users</span>
                            <div className="text-900 font-medium text-xl">{stats?.total_users || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{stats?.growth?.users || 0}% </span>
                    <span className="text-500">since last month</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Bookings</span>
                            <div className="text-900 font-medium text-xl">{stats?.total_bookings || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calendar text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{stats?.growth?.bookings || 0}% </span>
                    <span className="text-500">since last week</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Avg Rating</span>
                            <div className="text-900 font-medium text-xl">{Number(stats?.avg_rating || 0).toFixed(1)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-star text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Top rated platform</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Revenue</span>
                            <div className="text-900 font-medium text-xl">${Number(stats?.platform_revenue || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-wallet text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{stats?.growth?.revenue || 0}% </span>
                    <span className="text-500">growth</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Activity</h5>
                    <DataTable value={bookings} rows={5} paginator responsiveLayout="scroll">
                        <Column field="booking_number" header="Order" sortable style={{ width: '15%' }} body={(data) => <span className="text-primary font-bold">#{data.booking_number}</span>} />
                        <Column field="service.name" header="Service" sortable style={{ width: '35%' }} />
                        <Column field="customer.name" header="Customer" body={customerBodyTemplate} sortable style={{ width: '30%' }} />
                        <Column field="status" header="Status" sortable style={{ width: '20%' }} body={statusBodyTemplate} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Revenue Growth</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
                <div className="card">
                    <h5>User Onboarding</h5>
                    <Chart type="bar" data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
