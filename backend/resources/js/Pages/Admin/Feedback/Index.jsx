import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { 
    Search, Star, MessageSquare, ShieldAlert, CheckCircle2, 
    MoreHorizontal, Flag, Eye, Filter, RotateCcw, User, 
    ArrowRight, Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import DashboardShell from '@/Components/DashboardShell';
import StatsCard from '@/Components/StatsCard';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/Components/ui/dropdown-menu';

export default function FeedbackIndex({ reviews, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('admin.feedback.index'), { ...filters, search: value }, {
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
        router.get(route('admin.feedback.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feedback & Quality Control" />

            <DashboardShell
                title="Feedback & Quality"
                subtitle="Monitor service standards, investigate disputes, and analyze platform satisfaction."
            >
                <div className="space-y-10 max-w-7xl mx-auto pb-20">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card p-8 rounded-2xl border shadow-sm relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute -right-4 -top-4 opacity-5">
                                <Star size={120} />
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Average Satisfaction</p>
                            <div className="flex items-center gap-4">
                                <h3 className="text-5xl font-black text-foreground">{stats.avg.toFixed(1)}</h3>
                                <div className="space-y-1">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.round(stats.avg) ? "currentColor" : "none"} strokeWidth={2.5} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Based on {stats.total} total reviews</p>
                                </div>
                            </div>
                        </div>

                        <StatsCard
                            title="Critical Alerts"
                            value={stats.poor_ratings.toString()}
                            icon={ShieldAlert}
                            description="Ratings under 3 stars"
                            className="border-red-100 bg-red-50/30"
                        />

                        <StatsCard
                            title="Recent Reviews"
                            value={reviews.data.length.toString()}
                            icon={MessageSquare}
                            description="Feedback from this period"
                        />
                    </div>

                    <div className="space-y-6">
                        {/* Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                            <div className="relative w-full lg:w-96">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search comments or customer names..." 
                                    className="pl-9"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <select 
                                    value={filters.rating || ''}
                                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                                    className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary w-full sm:w-44"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                                
                                {(filters.search || filters.rating) && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => router.get(route('admin.feedback.index'), {})}
                                        className="text-muted-foreground"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Filters
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Feedback List */}
                        <div className="grid grid-cols-1 gap-4">
                            {reviews.data.length > 0 ? (
                                reviews.data.map((review) => (
                                    <div key={review.id} className="bg-card rounded-2xl border shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Review Content */}
                                            <div className="flex-1 p-8 relative">
                                                <Quote className="absolute top-6 left-6 h-12 w-12 text-muted-foreground/5 -z-0" />
                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-1 text-amber-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={3} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded">
                                                            {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-foreground text-base font-medium leading-relaxed italic pr-4">
                                                        "{review.comment || 'The customer did not leave a written comment for this rating.'}"
                                                    </p>
                                                    
                                                    {review.rating <= 2 && (
                                                        <div className="flex items-center gap-2 text-red-500 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                                                            <ShieldAlert className="h-3.5 w-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Critical: High Priority Investigation</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sidebar Info */}
                                            <div className="lg:w-80 bg-muted/10 border-t lg:border-t-0 lg:border-l p-8 space-y-6">
                                                <div className="space-y-5">
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Customer Account</p>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-7 w-7 border">
                                                                <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                                                                    {review.booking.customer?.first_name?.[0]}{review.booking.customer?.last_name?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs font-bold text-foreground">{review.booking.customer?.name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Service Provider</p>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-7 w-7 border">
                                                                <AvatarFallback className="text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                                                    {review.booking.provider?.user?.first_name?.[0]}{review.booking.provider?.user?.last_name?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs font-bold text-foreground">{review.booking.provider?.user?.name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Booked Service</p>
                                                        <Badge variant="outline" className="font-bold text-[10px] uppercase truncate max-w-full block text-center py-1">
                                                            {review.booking.service?.name}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest bg-foreground hover:bg-primary">
                                                        Full Details
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="icon" className="h-10 w-10">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" /> View Booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Flag className="mr-2 h-4 w-4" /> Flag for Concern
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-500">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Remove Feedback
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center text-muted-foreground opacity-50 bg-card rounded-2xl border border-dashed">
                                    <MessageSquare className="h-12 w-12 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest leading-loose">No feedback entries found</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {reviews.links.length > 3 && (
                            <div className="px-6 py-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {reviews.total} total feedback records
                                </span>
                                <div className="flex gap-1">
                                    {reviews.links.map((link, i) => (
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
            </DashboardShell>
        </AuthenticatedLayout>
    );
}

// Minimal Trash icon for the dropdown
function Trash2({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
    )
}
