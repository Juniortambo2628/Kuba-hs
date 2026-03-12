import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Users, Calendar, CreditCard, Star, TrendingUp, 
    Zap, Target, Activity, PieChart, BarChart3, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardShell from '@/Components/DashboardShell';
import StatsCard from '@/Components/StatsCard';
import { Progress } from '@/Components/ui/progress';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function AnalyticsIndex({ trends, distribution, summary }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Prepare data for Recharts
    const chartData = trends.users.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: item.count
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Performance Analytics" />

            <DashboardShell
                title="Performance Analytics"
                subtitle="High-level insights into platform growth, user engagement, and financial health."
            >
                <div className="space-y-10 max-w-7xl mx-auto pb-20">
                    {/* Executive Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Users"
                            value={summary.total_users.toString()}
                            icon={Users}
                            description="Platform base"
                        />
                        <StatsCard
                            title="Total Bookings"
                            value={summary.total_bookings.toString()}
                            icon={Calendar}
                            description="Market activity"
                        />
                        <StatsCard
                            title="Platform Revenue"
                            value={formatCurrency(summary.platform_revenue)}
                            icon={CreditCard}
                            description="Gross commission"
                            className="bg-primary/5 border-primary/20"
                        />
                        <StatsCard
                            title="Average Rating"
                            value={summary.avg_rating.toFixed(1)}
                            icon={Star}
                            description="Customer satisfaction"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Area Chart: Growth Performance */}
                        <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Growth Performance</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">30-Day User Acquisition Trend</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">+12% vs LY</Badge>
                                </div>
                            </div>
                            <div className="p-6 h-[350px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                                cursor={{ stroke: '#0D9488', strokeWidth: 1 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#0D9488" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorCount)" 
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed rounded-xl">
                                        <TrendingUp className="h-10 w-10 mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Insufficient trend data</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Composition: User Distribution */}
                        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <PieChart className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Composition</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Market Share by Role</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Customers', count: distribution.users.customers, total: summary.total_users, color: 'bg-teal-500' },
                                        { label: 'Service Providers', count: distribution.users.providers, total: summary.total_users, color: 'bg-blue-500' },
                                        { label: 'Administrators', count: distribution.users.admins, total: summary.total_users, color: 'bg-slate-500' },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                                                    <h4 className="text-lg font-black text-foreground">{item.count}</h4>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold border-transparent bg-muted/50">
                                                    {((item.count / item.total) * 100).toFixed(1)}%
                                                </Badge>
                                            </div>
                                            <Progress 
                                                value={(item.count / item.total) * 100} 
                                                className="h-2"
                                                indicatorClassName={item.color}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t bg-muted/10">
                                <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest h-10 border-dashed">
                                    View Detailed Demographics
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Popular Services Section */}
                    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Top Performing Categories</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Service Adoption Metrics</p>
                                </div>
                            </div>
                            <BarChart3 className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {distribution.services.map((service, i) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ y: -4 }}
                                        className="bg-muted/20 border-2 border-white rounded-2xl p-6 flex flex-col items-center text-center shadow-sm"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center font-black text-primary mb-4 shadow-sm text-xs">
                                            #{i + 1}
                                        </div>
                                        <p className="text-xs font-black text-foreground uppercase tracking-tight mb-1">{service.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mt-1">
                                            <Users className="h-3 w-3" />
                                            {service.provider_services_count} Active
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}

// Visual feedback/Badge helper for this page layout specifically
function Badge({ children, variant = "default", className }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0",
            variant === "outline" ? "border-muted-foreground/20 text-muted-foreground" : "bg-primary text-white border-primary",
            className
        )}>
            {children}
        </span>
    );
}
