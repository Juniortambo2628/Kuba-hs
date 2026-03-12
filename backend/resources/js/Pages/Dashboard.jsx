import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ReviewModal from '@/Components/ReviewModal';
import DashboardShell from '@/Components/DashboardShell';
import StatsCard from '@/Components/StatsCard';
import DataCard from '@/Components/DataCard';
import { cn } from '@/lib/utils';
import { 
  CreditCard, Calendar, MapPin, User, Building2, Star, Award, 
  ClipboardList, CheckCircle, Clock, ArrowRight, ChevronRight,
  Sparkles, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Separator } from '@/Components/ui/separator';

export default function Dashboard({ auth, bookings, userRole }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleStatusUpdate = (bookingId, status) => {
        if (confirm(`Are you sure you want to ${status} this booking?`)) {
            router.patch(route('booking.update-status', bookingId), { status });
        }
    };

    const openReviewModal = (booking) => {
        setSelectedBooking(booking);
        setIsReviewModalOpen(true);
    };

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

    // Compute stats
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
    const totalSpent = bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + parseFloat(b.estimated_price || 0), 0);

    // Provider stats
    const providerRevenue = bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + parseFloat(b.estimated_price || 0), 0);
    const providerPending = bookings.filter(b => b.status === 'pending').length;

    const isProvider = userRole === 'provider';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <DashboardShell
                title={isProvider ? "Provider Overview" : "Portal Overview"}
                subtitle={`Welcome back, ${auth.user.first_name || auth.user.name}!`}
                action={isProvider ? null : {
                    label: "New Booking",
                    href: route('marketplace.search'),
                    icon: Calendar,
                }}
            >
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {isProvider ? (
                        <>
                            <StatsCard label="Total Bookings" value={bookings.length} icon={ClipboardList} iconClassName="bg-blue-50 text-blue-600" />
                            <StatsCard label="Pending Requests" value={providerPending} icon={Clock} iconClassName="bg-amber-50 text-amber-600" />
                            <StatsCard label="Completed" value={completedBookings} icon={CheckCircle} iconClassName="bg-emerald-50 text-emerald-600" />
                            <StatsCard label="Revenue" value={`$${providerRevenue.toLocaleString()}`} icon={CreditCard} iconClassName="bg-primary/10 text-primary" />
                        </>
                    ) : (
                        <>
                            <StatsCard label="Loyalty Points" value="0" icon={Star} iconClassName="bg-amber-50 text-amber-600" />
                            <StatsCard label="Total Bookings" value={bookings.length} icon={ClipboardList} iconClassName="bg-blue-50 text-blue-600" />
                            <StatsCard label="Completed Services" value={completedBookings} icon={CheckCircle} iconClassName="bg-emerald-50 text-emerald-600" />
                            <StatsCard label="Membership" value="Bronze" icon={Award} iconClassName="bg-primary/10 text-primary" />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Appointments / Bookings - spans 2 cols */}
                    <div className="lg:col-span-2">
                        <DataCard
                            title={isProvider ? "Incoming Bookings" : "Upcoming Appointments"}
                            icon={Clock}
                            action={{ label: "View All", href: route('dashboard') }}
                        >
                            {upcomingBookings.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingBookings.slice(0, 5).map((booking) => (
                                        <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{booking.service?.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {isProvider ? (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {booking.customer?.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            {booking.provider?.business_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-medium text-primary flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(booking.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {new Date(booking.scheduled_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className="shrink-0">
                                                <p className="text-sm font-bold">${booking.estimated_price}</p>
                                            </div>
                                            <div className="shrink-0">
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <div className="shrink-0">
                                                {isProvider && booking.status === 'pending' && (
                                                    <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                                                        Accept
                                                    </Button>
                                                )}
                                                {isProvider && booking.status === 'confirmed' && (
                                                    <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => handleStatusUpdate(booking.id, 'completed')}>
                                                        Complete
                                                    </Button>
                                                )}
                                                {!isProvider && booking.status === 'confirmed' && booking.payment_status !== 'paid' && (
                                                    <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700">
                                                        <Link href={route('payment.show', booking.id)}>
                                                            <CreditCard className="h-3 w-3 mr-1" />
                                                            Pay
                                                        </Link>
                                                    </Button>
                                                )}
                                                {!isProvider && booking.status === 'completed' && !booking.review && (
                                                    <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => openReviewModal(booking)}>
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Rate
                                                    </Button>
                                                )}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Calendar className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wider">
                                        No upcoming bookings found
                                    </p>
                                    <p className="text-xs text-muted-foreground max-w-xs">
                                        {isProvider 
                                            ? "Your schedule is clear. Customer requests will appear here." 
                                            : "Book a service to get started."
                                        }
                                    </p>
                                </div>
                            )}
                        </DataCard>
                    </div>

                    {/* Sidebar Cards */}
                    <div className="space-y-6">
                        {/* Loyalty Card (Clients only) */}
                        {!isProvider && (
                            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <Star className="h-8 w-8 text-amber-300" fill="currentColor" />
                                    </div>
                                    <h3 className="text-lg font-bold uppercase tracking-wider mb-1">
                                        Loyalty Rewards
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold">0</span>
                                        <span className="text-sm font-medium opacity-80 uppercase">Points</span>
                                    </div>
                                    <Separator className="bg-white/20 mb-4" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Current Tier</p>
                                            <p className="text-sm font-bold text-amber-300">Bronze</p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-semibold uppercase">
                                            Redeem Rewards
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Completed (for providers) */}
                        {isProvider && (
                            <DataCard title="Quick Stats" icon={TrendingUp} iconClassName="bg-emerald-50 text-emerald-600">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                                        <span className="text-sm font-bold">
                                            {bookings.length ? Math.round((completedBookings / bookings.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <Progress value={bookings.length ? (completedBookings / bookings.length) * 100 : 0} className="h-2" />
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Avg. Rating</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                                            <span className="text-sm font-bold">N/A</span>
                                        </div>
                                    </div>
                                </div>
                            </DataCard>
                        )}

                        {/* Quick Actions */}
                        <DataCard title="Quick Actions" icon={Sparkles}>
                            <div className="space-y-2">
                                {isProvider ? (
                                    <>
                                        <Link href={route('schedule.index')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">Manage Schedule</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                        <Link href={route('provider.edit')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">Update Services</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                        <Link href={route('chat.index')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">View Messages</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('marketplace.search')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">Find Services</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                        <Link href={route('chat.index')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">View Messages</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                        <Link href={route('profile.edit')} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-sm font-medium">Profile Settings</span>
                                            <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </DataCard>
                    </div>
                </div>

                {/* Completed Bookings Section */}
                {bookings.filter(b => b.status === 'completed').length > 0 && (
                    <div className="mt-8">
                        <DataCard
                            title="Completed Services"
                            icon={CheckCircle}
                            iconClassName="bg-emerald-50 text-emerald-600"
                        >
                            <div className="space-y-3">
                                {bookings.filter(b => b.status === 'completed').slice(0, 3).map((booking) => (
                                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border bg-background">
                                        <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{booking.service?.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(booking.scheduled_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold">${booking.estimated_price}</p>
                                            {booking.payment_status === 'paid' && (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] mt-1">Paid</Badge>
                                            )}
                                        </div>
                                        {booking.review ? (
                                            <div className="flex items-center gap-1 text-amber-600 px-2 py-1 bg-amber-50 rounded-md text-sm font-semibold shrink-0">
                                                <Star className="h-3.5 w-3.5" fill="currentColor" />
                                                {booking.review.rating}/5
                                            </div>
                                        ) : (
                                            !isProvider && (
                                                <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 shrink-0" onClick={() => openReviewModal(booking)}>
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Rate
                                                </Button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </DataCard>
                    </div>
                )}
            </DashboardShell>

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                booking={selectedBooking}
            />
        </AuthenticatedLayout>
    );
}
