import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardShell from '@/Components/DashboardShell';
import DataCard from '@/Components/DataCard';
import { cn } from '@/lib/utils';
import { 
  Calendar, User, ClipboardList, Clock, 
  Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle
} from 'lucide-react';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function Bookings({ auth, bookings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            confirmed: "bg-blue-50 text-blue-700 border-blue-200",
            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            cancelled: "bg-red-50 text-red-600 border-red-200",
        };
        return (
            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", styles[status])}>
                {status}
            </Badge>
        );
    };

    const handleStatusUpdate = (bookingId, status) => {
        const action = status === 'confirmed' ? 'accept' : status === 'completed' ? 'complete' : 'cancel';
        if (confirm(`Are you sure you want to ${action} this booking?`)) {
            router.patch(route('booking.update-status', bookingId), { status });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Service Requests" />

            <DashboardShell
                title="Service Requests"
                subtitle="Manage your incoming bookings and job history."
            >
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by service or customer..." 
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? 'default' : 'outline'}
                                        size="sm"
                                        className="capitalize text-xs h-8"
                                        onClick={() => setStatusFilter(status)}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <DataCard title={`${statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests`} icon={ClipboardList}>
                        <div className="-mx-6">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="pl-6 py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Service</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Customer</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Date & Time</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Earnings</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Status</TableHead>
                                        <TableHead className="pr-6 py-3 text-right uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.length > 0 ? (
                                        filteredBookings.map((booking) => (
                                            <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{booking.service?.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">#{String(booking.id).substring(0, 8)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                            <User className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[150px]">
                                                            {booking.customer?.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {new Date(booking.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(booking.scheduled_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-sm font-bold text-foreground">${booking.estimated_price}</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {getStatusBadge(booking.status)}
                                                </TableCell>
                                                <TableCell className="pr-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('dashboard')}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {booking.status === 'pending' && (
                                                                <DropdownMenuItem 
                                                                    className="text-emerald-600 focus:text-emerald-700"
                                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Accept Request
                                                                </DropdownMenuItem>
                                                            )}
                                                            {booking.status === 'confirmed' && (
                                                                <DropdownMenuItem 
                                                                    className="text-emerald-600 focus:text-emerald-700"
                                                                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Mark as Completed
                                                                </DropdownMenuItem>
                                                            )}
                                                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                                <DropdownMenuItem 
                                                                    className="text-red-600 focus:text-red-700"
                                                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Decline / Cancel
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <ClipboardList className="h-8 w-8 mb-2 opacity-20" />
                                                    <p className="text-sm">No requests found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DataCard>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
