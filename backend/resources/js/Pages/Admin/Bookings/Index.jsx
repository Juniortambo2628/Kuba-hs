import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { 
    Search, 
    Calendar, 
    Filter, 
    RotateCcw,
    Eye,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminHeader from '@/Components/Admin/AdminHeader';

export default function BookingsIndex({ bookings, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('admin.bookings.index'), { ...filters, search: value }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 300),
        [filters]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.bookings.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <AdminHeader 
                    title="Booking Management" 
                    subtitle="Monitor and track all service transactions on the platform."
                />
            }
        >
            <Head title="Booking Management" />

            <div className="space-y-6 selection:bg-indigo-100 selection:text-indigo-700">
                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by booking # or customer..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full bg-white border-slate-100 border-2 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select 
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="bg-white border-slate-100 border-2 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm min-w-[180px]"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        
                        {(filters.search || filters.status) && (
                            <button 
                                onClick={() => router.get(route('admin.bookings.index'), {})}
                                className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Bookings List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Booking Info</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Provider</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 leading-tight truncate max-w-[200px]">
                                                    {booking.service?.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                    #{booking.booking_number || booking.id.substring(0, 8)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-bold text-slate-700">
                                                {booking.customer?.name}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-bold text-slate-700">
                                                {booking.provider?.user?.name}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium">
                                                    {new Date(booking.scheduled_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {bookings.data.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                                    <SearchX size={32} />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest leading-loose text-center max-w-xs">
                                    No bookings found matching your filters.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {bookings.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                showing {bookings.from}-{bookings.to} of {bookings.total}
                            </span>
                            <div className="flex gap-2">
                                {bookings.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={cn(
                                            "min-w-[40px] px-2 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all",
                                            link.active 
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-900",
                                            !link.url && "opacity-50 pointer-events-none"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
