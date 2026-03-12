import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { 
    Search, DollarSign, CreditCard, TrendingUp, Clock, 
    CheckCircle2, AlertCircle, ArrowUpRight, Filter, 
    RotateCcw, FileText, ExternalLink, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import DashboardShell from '@/Components/DashboardShell';
import StatsCard from '@/Components/StatsCard';
import { 
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function PaymentsIndex({ payments, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('admin.payments.index'), { ...filters, search: value }, {
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
        router.get(route('admin.payments.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            failed: "bg-red-50 text-red-700 border-red-200",
            refunded: "bg-slate-50 text-slate-700 border-slate-200",
        };
        return (
            <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest", styles[status.toLowerCase()] || "bg-muted text-muted-foreground")}>
                {status}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Financial Overview" />

            <DashboardShell
                title="Financial Overview"
                subtitle="Track platform revenue, commission splits, and transaction health."
            >
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Volume"
                            value={formatCurrency(stats.total_volume)}
                            icon={TrendingUp}
                            description="All-time platform throughput"
                            trend={{ value: "Live", isPositive: true }}
                        />
                        <StatsCard
                            title="Platform Revenue"
                            value={formatCurrency(stats.total_fees)}
                            icon={DollarSign}
                            description="Total commissions collected"
                            className="border-primary/20 bg-primary/5"
                        />
                        <StatsCard
                            title="Pending Volume"
                            value={formatCurrency(stats.pending_volume)}
                            icon={Clock}
                            description="Awaiting service completion"
                        />
                        <StatsCard
                            title="Completed"
                            value={stats.completed_count.toString()}
                            icon={CheckCircle2}
                            description="Verified paid transactions"
                        />
                    </div>

                    <div className="space-y-4">
                        {/* Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                            <div className="relative w-full lg:w-96">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search transaction ID or customer..." 
                                    className="pl-9"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <select 
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary w-full sm:w-44"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                
                                {(filters.search || filters.status) && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => router.get(route('admin.payments.index'), {})}
                                        className="text-muted-foreground"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <TableHead className="pl-6 py-3">Transaction ID</TableHead>
                                        <TableHead className="py-3">Payer / Recipient</TableHead>
                                        <TableHead className="py-3">Gross Amount</TableHead>
                                        <TableHead className="py-3">Platform Fee</TableHead>
                                        <TableHead className="py-3">Status</TableHead>
                                        <TableHead className="pr-6 py-3 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-foreground font-mono">
                                                            #{payment.transaction_id?.substring(0, 8) || payment.id.substring(0, 8)}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter mt-1 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(payment.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            {payment.customer?.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase opacity-70">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                            {payment.provider?.user?.name || "Service Provider"}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-sm font-black text-foreground tracking-tight">
                                                        {formatCurrency(payment.amount)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-sm font-bold text-primary font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                                        {formatCurrency(payment.platform_fee)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {getStatusBadge(payment.status)}
                                                </TableCell>
                                                <TableCell className="pr-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem>
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                                Strip Dashboard
                                                            </DropdownMenuItem>
                                                            {payment.status === 'completed' && (
                                                                <DropdownMenuItem className="text-red-500">
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    Initiate Refund
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-40 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                                    <CreditCard className="h-10 w-10 mb-2" />
                                                    <p className="text-sm font-bold uppercase tracking-widest leading-loose">No transactions found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            
                            {/* Pagination */}
                            {payments.links.length > 3 && (
                                <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Displaying {payments.from}-{payments.to} of {payments.total} payouts
                                    </span>
                                    <div className="flex gap-1">
                                        {payments.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={cn(
                                                    "h-8 px-3 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter transition-all",
                                                    link.active 
                                                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                    !link.url && "opacity-50 pointer-events-none"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
