"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star,
  Activity,
  BarChart,
  PieChart as PieChartIcon,
  ShieldCheck,
  Zap,
  Download
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useExport } from "@/hooks/useExport";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  trends: {
    users: { date: string; count: number }[];
    bookings: { date: string; count: number }[];
    revenue: { date: string; count: number }[];
  };
  growth: {
    users: number;
    bookings: number;
    revenue: number;
  };
  distribution: {
    users: { customers: number; providers: number; admins: number };
    services: { name: string; provider_services_count: number }[];
  };
  summary: {
    total_users: number;
    total_bookings: number;
    platform_revenue: number;
    avg_rating: number;
  };
}

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { exportToCSV } = useExport();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/analytics");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Format data for Recharts Pie
  const userDistributionData = [
    { name: 'Customers', value: data.distribution.users.customers },
    { name: 'Providers', value: data.distribution.users.providers },
    { name: 'Admins', value: data.distribution.users.admins },
  ].filter(d => d.value > 0);

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-emerald-500 bg-emerald-50';
    if (growth < 0) return 'text-red-500 bg-red-50';
    return 'text-gray-500 bg-gray-50';
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Platform <span className="text-sky-600">Analytics</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                Comprehensive health and growth metrics of the Kuba ecosystem.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Button 
                onClick={() => {
                  if (data) exportToCSV(data.trends.revenue, 'revenue_trends');
                }}
                variant="outline" 
                className="h-14 border-gray-100 bg-white text-gray-500 hover:text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 px-6 shadow-sm"
            >
                <Download className="w-4 h-4" /> Export Report
            </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: "Total Revenue", value: formatCurrency(data.summary.platform_revenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", growth: data.growth.revenue },
          { label: "Total Bookings", value: data.summary.total_bookings.toLocaleString(), icon: Calendar, color: "text-sky-600", bg: "bg-sky-50", growth: data.growth.bookings },
          { label: "Active Users", value: data.summary.total_users.toLocaleString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", growth: data.growth.users },
          { label: "Avg Service Rating", value: Number(data.summary.avg_rating).toFixed(1), icon: Star, color: "text-amber-500", bg: "bg-amber-50", growth: 0 }
        ].map((stat, i) => (
          <Card key={i} className={`premium-card group border-none hover:shadow-2xl transition-all duration-300`}>
            <CardContent className="p-8 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.label !== "Avg Service Rating" && (
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getGrowthColor(stat.growth)}`}>
                    {stat.growth > 0 ? '+' : ''}{stat.growth}% MoM
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</h3>
                <p className="text-3xl font-black text-[#1E293B] tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <Card className="premium-card border-none shadow-premium overflow-hidden col-span-1 lg:col-span-2">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart className="w-4 h-4 text-sky-600" /> Revenue Growth (30 Days)
              </h2>
              <p className="text-xs font-bold text-gray-400 italic">Daily platform fee revenue collection.</p>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends.revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(val) => `$${val}`} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 900 }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookings & Users Trends */}
        <Card className="premium-card border-none shadow-premium overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" /> Activity Metrics
              </h2>
              <p className="text-xs font-bold text-gray-400 italic">User registrations vs bookings fulfilled.</p>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data.trends.bookings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" name="Bookings" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="premium-card border-none shadow-premium overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-sky-600" /> User Demographics
              </h2>
              <p className="text-xs font-bold text-gray-400 italic">Distribution of roles across the platform.</p>
            </div>
          </div>
          <CardContent className="p-8 flex justify-center items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
