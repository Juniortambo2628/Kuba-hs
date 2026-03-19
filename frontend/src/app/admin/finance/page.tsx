"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    DollarSign, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    PieChart as PieChartIcon, 
    Calendar,
    BarChart3,
    ArrowRightLeft,
    Wallet,
    ShieldCheck,
    Download
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface MonthData {
    month: string;
    revenue: number;
    profit: number;
}

interface Payment {
    id: string;
    transaction_id: string;
    amount: number;
    platform_fee: number;
    provider_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    customer: { name: string };
    provider: { user: { name: string } };
    booking: { booking_number: string };
}

interface FinanceStats {
    total_volume: number;
    total_platform_fees: number;
    total_provider_payouts: number;
    pending_payouts: number;
    monthly_revenue: MonthData[];
    payment_methods: { payment_method: string; count: number }[];
}

export default function AdminFinance() {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/finance");
            setStats(res.data.stats);
            setRecentPayments(res.data.recent_payments);
        } catch (err) {
            console.error("Failed to fetch finance data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-[400px] rounded-[2.5rem] lg:col-span-2" />
                    <Skeleton className="h-[400px] rounded-[2.5rem]" />
                </div>
                <Skeleton className="h-[400px] rounded-[2.5rem]" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-10 pb-12"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Finance Audit</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor platform revenue, payouts, and transactional integrity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 border border-border transition-all">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="Volume" 
                    value={`$${Number(stats?.total_volume || 0).toLocaleString()}`} 
                    icon={DollarSign} 
                    trend="Gross Transaction Value"
                />
                <MetricCard 
                    label="Platform Profit" 
                    value={`$${Number(stats?.total_platform_fees || 0).toLocaleString()}`} 
                    icon={TrendingUp} 
                    trend="10% Applied Fee"
                />
                <MetricCard 
                    label="Merchant Payouts" 
                    value={`$${Number(stats?.total_provider_payouts || 0).toLocaleString()}`} 
                    icon={Wallet} 
                    trend="Distributed Capital"
                />
                <MetricCard 
                    label="In Escrow" 
                    value={`$${Number(stats?.pending_payouts || 0).toLocaleString()}`} 
                    icon={ShieldCheck} 
                    trend="Verification Pending"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Revenue Overview Chart */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
                    <CardHeader className="p-8 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold tracking-tight">Revenue Dynamics</CardTitle>
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-1">Fiscal Performance Overview</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.monthly_revenue?.reverse() || []}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 600}} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 600}}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="hsl(var(--primary))" 
                                        fillOpacity={1} 
                                        fill="url(#colorRev)" 
                                        strokeWidth={3}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="profit" 
                                        stroke="hsl(var(--foreground))" 
                                        fillOpacity={0} 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods Breakdown */}
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
                    <CardHeader className="p-8 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold tracking-tight">Channel Audit</CardTitle>
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-1">Transaction Mediums</p>
                            </div>
                            <div className="p-3 bg-muted rounded-2xl">
                                <PieChartIcon className="w-5 h-5 text-foreground" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.payment_methods || []}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="count"
                                        nameKey="payment_method"
                                    >
                                        {(stats?.payment_methods || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                            {(stats?.payment_methods || []).map((method, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground opacity-30'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider truncate">{method.payment_method}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transaction Log */}
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="p-8 border-b border-border/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Financial Ledger</CardTitle>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-1">Deep-audit of platform capital flow</p>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="pl-8 uppercase text-[10px] font-bold tracking-[0.2em] h-14">TXID / Date</TableHead>
                                <TableHead className="uppercase text-[10px] font-bold tracking-[0.2em] h-14">Participants</TableHead>
                                <TableHead className="uppercase text-[10px] font-bold tracking-[0.2em] h-14">Gross / Profit</TableHead>
                                <TableHead className="uppercase text-[10px] font-bold tracking-[0.2em] h-14">Status</TableHead>
                                <TableHead className="pr-8 text-right uppercase text-[10px] font-bold tracking-[0.2em] h-14">Order</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayments.map((payment) => (
                                <TableRow key={payment.id} className="group border-border/50 hover:bg-muted/20 transition-colors">
                                    <TableCell className="pl-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-foreground tabular-nums">#{payment.transaction_id.slice(-8)}</p>
                                            <p className="text-[9px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(payment.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-7 h-7 rounded-sm bg-muted border border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">{payment.customer.name[0]}</div>
                                                <div className="w-7 h-7 rounded-sm bg-primary border border-card flex items-center justify-center text-[9px] font-bold text-white">{payment.provider.user.name[0]}</div>
                                            </div>
                                            <div className="text-[10px] font-medium leading-tight">
                                                <p className="text-foreground">{payment.customer.name}</p>
                                                <p className="text-primary">{payment.provider.user.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-foreground tabular-nums">${payment.amount}</p>
                                            <p className="text-[9px] font-bold text-emerald-600 tabular-nums">Net: +${payment.platform_fee}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-widest border-border bg-muted/50 text-foreground font-bold">
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">#{payment.booking.booking_number}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
}
