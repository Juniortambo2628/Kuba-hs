import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Briefcase, Calendar, DollarSign, TrendingUp, 
    Activity, ArrowUpRight, CheckCircle2, AlertCircle,
    ArrowRight, MapPin, Search, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { 
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import DashboardShell from '@/Components/DashboardShell';
import StatsCard from '@/Components/StatsCard';

export default function AdminDashboard({ stats, recentBookings }) {
    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            confirmed: "bg-blue-50 text-blue-700 border-blue-200",
            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            cancelled: "bg-red-50 text-red-600 border-red-200",
        };
        return (
            <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest", styles[status.toLowerCase()] || "bg-muted text-muted-foreground")}>
                {status}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Command Center" />

            <DashboardShell
                title="Command Center"
                subtitle="High-level operational overview of the Home Service platform."
            >
                <div className="space-y-8 max-w-7xl mx-auto pb-12">
                    {/* Stats Row */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                        <StatsCard 
                            title="Base Users" 
                            value={stats.users.toString()} 
                            icon={Users} 
                            description="Registered accounts"
                        />
                        <StatsCard 
                            title="Providers" 
                            value={stats.providers.toString()} 
                            icon={Briefcase} 
                            description="Active specialists"
                        />
                        <StatsCard 
                            title="Bookings" 
                            value={stats.bookings.toString()} 
                            icon={Calendar} 
                            description="Total reservations"
                        />
                        <StatsCard 
                            title="Success Rate" 
                            value={`${((stats.completed_bookings / (stats.bookings || 1)) * 100).toFixed(0)}%`} 
                            icon={TrendingUp} 
                            description="Completion ratio"
                        />
                        <StatsCard 
                            title="Revenue" 
                            value={`$${stats.revenue.toLocaleString()}`} 
                            icon={DollarSign} 
                            description="Platform turnover"
                            className="bg-primary/5 border-primary/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity Table */}
                        <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Live Activity</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Most recent service requests</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <Link href={route('admin.bookings.index')}>
                                        View Full Ledger <ArrowRight className="h-3 w-3 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="flex-1">
                                {recentBookings.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/10 hover:bg-muted/10">
                                                <TableHead className="pl-6 py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Service / Client</TableHead>
                                                <TableHead className="py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground text-center">Provider</TableHead>
                                                <TableHead className="py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Scheduled</TableHead>
                                                <TableHead className="pr-6 py-3 text-right uppercase text-[10px] font-black tracking-widest text-muted-foreground">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentBookings.map((booking) => (
                                                <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-sm text-foreground leading-tight">{booking.service?.name}</span>
                                                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-1">
                                                                <User className="h-3 w-3" />
                                                                {booking.customer?.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center">
                                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter bg-muted group-hover:bg-background px-2 py-1 rounded border transition-colors">
                                                            {booking.provider?.user?.name || "Multiple"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-foreground">
                                                                {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'ASAP'}
                                                            </span>
                                                            <span className="text-[9px] text-muted-foreground font-bold uppercase">Requested Date</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-4 text-right">
                                                        {getStatusBadge(booking.status)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                        <Calendar className="h-10 w-10 mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No recent platform activity</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions & Tips */}
                        <div className="space-y-6">
                            <Card className="rounded-2xl shadow-sm border overflow-hidden">
                                <CardHeader className="bg-muted/30 p-6 border-b">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">Platform Actions</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-tighter">Emergency & Maintenance</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                                        <Plus className="h-4 w-4 mr-3" /> Manual Booking Entry
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-11">
                                        <Users className="h-4 w-4 mr-3" /> Broadcast Notification
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-11 border-red-100 text-red-500 hover:bg-red-50">
                                        <AlertCircle className="h-4 w-4 mr-3" /> Platform Lockdown
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="bg-primary p-8 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                    <TrendingUp size={160} />
                                </div>
                                <div className="relative z-10">
                                    <Badge className="bg-white/20 text-white border-transparent mb-4 font-black">Admin Tip</Badge>
                                    <h4 className="text-white font-black text-xl mb-2 italic pr-8">Maximize platform engagement.</h4>
                                    <p className="text-white/70 text-xs font-medium leading-relaxed mb-6">
                                        Regularly updated blog posts increase customer retention and search visibility.
                                    </p>
                                    <Button className="bg-white text-primary hover:bg-white/90 font-black text-[10px] uppercase tracking-widest w-full">
                                        Go to Blog Manager
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
