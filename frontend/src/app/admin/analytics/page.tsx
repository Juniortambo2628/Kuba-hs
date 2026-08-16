"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Star,
  Activity,
  BarChart,
  PieChart as PieChartIcon,
  Download,
  DollarSign,
  UserCheck,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { useExport } from "@/hooks/useExport";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { ChartContainer } from "@/components/shared/ChartContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { MetricCard } from "@/components/shared/MetricCard";
import { useData } from "@/hooks/useData";

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

const CHART_COLORS = ['var(--foreground)', 'var(--muted-foreground)', 'var(--muted)', 'var(--border)', 'var(--accent)'];

export default function AdminAnalytics() {
  const { data, isLoading } = useData<AnalyticsData>("/api/admin/analytics", { initialData: null });
  const { exportToCSV } = useExport();

  if (isLoading) {
    return <DashboardPageSkeleton width="default" metrics={4} bodyHeight="h-80" />;
  }

  if (!data) return null;

  const userDistributionData = [
    { name: 'Customers', value: data.distribution.users.customers, fill: 'var(--foreground)' },
    { name: 'Providers', value: data.distribution.users.providers, fill: 'var(--muted-foreground)' },
    { name: 'Admins', value: data.distribution.users.admins, fill: 'var(--border)' },
  ].filter(d => d.value > 0);

  const serviceDistributionData = data.distribution.services.map((s, i) => ({
    name: s.name,
    count: s.provider_services_count,
    fill: CHART_COLORS[i % CHART_COLORS.length]
  }));

  const formatCurrency = (val: number) => `KES ${Number(val).toLocaleString()}`;

  const stats = [
    { label: "Total Revenue", value: formatCurrency(data.summary.platform_revenue), icon: DollarSign, trend: `${data.growth.revenue >= 0 ? '+' : ''}${data.growth.revenue}%`, trendUp: data.growth.revenue >= 0 },
    { label: "Total Bookings", value: data.summary.total_bookings.toLocaleString(), icon: Calendar, trend: `${data.growth.bookings >= 0 ? '+' : ''}${data.growth.bookings}%`, trendUp: data.growth.bookings >= 0 },
    { label: "Total Users", value: data.summary.total_users.toLocaleString(), icon: Users, trend: `${data.growth.users >= 0 ? '+' : ''}${data.growth.users}%`, trendUp: data.growth.users >= 0 },
    { label: "Avg Rating", value: Number(data.summary.avg_rating).toFixed(1), icon: Star, trend: "Platform avg", trendUp: true }
  ];

  const avgRevenuePerBooking = data.summary.total_bookings > 0 
    ? formatCurrency(data.summary.platform_revenue / data.summary.total_bookings) 
    : "KES 0";

  return (
    <DashboardPageContainer width="default">
      <DashboardPageHeader 
        title="Analytics Dashboard" 
        subtitle="Comprehensive platform insights and performance metrics."
      >
        <Button 
          onClick={() => { if (data) exportToCSV(data.trends.revenue, 'revenue_trends'); }}
          variant="outline" size="sm"
        >
          <Download className="w-4 h-4 mr-1.5" /> Export Report
        </Button>
      </DashboardPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <MetricCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Rev/Booking</p>
                <p className="text-lg font-black text-foreground">{avgRevenuePerBooking}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Provider/Client</p>
                <p className="text-lg font-black text-foreground">
                  {data.distribution.users.customers > 0 
                    ? (data.distribution.users.providers / data.distribution.users.customers).toFixed(2)
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Zap className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Services</p>
                <p className="text-lg font-black text-foreground">
                  {data.distribution.services.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Bookings/User</p>
                <p className="text-lg font-black text-foreground">
                  {data.summary.total_users > 0 
                    ? (data.summary.total_bookings / data.summary.total_users).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Revenue Trends</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Daily platform fee revenue (30 days)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer height={320}>
              <AreaChart data={data.trends.revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(val) => `KES ${val}`} tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }}
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="count" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">User Distribution</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Roles across the platform</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <ChartContainer height={280}>
              <PieChart>
                <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Bookings Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Daily bookings trend</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer height={280}>
              <RechartsBarChart data={data.trends.bookings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                <Bar dataKey="count" name="Bookings" fill="var(--muted-foreground)" radius={[3, 3, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">User Growth</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Daily new user registrations</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer height={280}>
              <LineChart data={data.trends.users} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                <Line type="monotone" dataKey="count" name="Users" stroke="var(--foreground)" strokeWidth={2} dot={{ fill: 'var(--foreground)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Popular Services</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Top services by provider count</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer height={250}>
            <RechartsBarChart data={serviceDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
              <YAxis dataKey="name" type="category" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" width={80} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
              <Bar dataKey="count" name="Providers" fill="var(--muted-foreground)" radius={[0, 3, 3, 0]} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground">Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User Growth</span>
              <div className="flex items-center gap-1">
                {data.growth.users >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-bold ${data.growth.users >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {data.growth.users >= 0 ? '+' : ''}{data.growth.users}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Booking Growth</span>
              <div className="flex items-center gap-1">
                {data.growth.bookings >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-bold ${data.growth.bookings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {data.growth.bookings >= 0 ? '+' : ''}{data.growth.bookings}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue Growth</span>
              <div className="flex items-center gap-1">
                {data.growth.revenue >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-bold ${data.growth.revenue >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {data.growth.revenue >= 0 ? '+' : ''}{data.growth.revenue}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="text-sm font-bold text-foreground">{data.summary.total_users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Total Bookings</span>
              <span className="text-sm font-bold text-foreground">{data.summary.total_bookings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Platform Revenue</span>
              <span className="text-sm font-bold text-foreground">{formatCurrency(data.summary.platform_revenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Avg Rating</span>
              <span className="text-sm font-bold text-foreground">{Number(data.summary.avg_rating).toFixed(1)} ⭐</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => { if (data) exportToCSV(data.trends.revenue, 'revenue_report'); }}
            >
              <Download className="w-4 h-4 mr-2" /> Export Revenue Data
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { if (data) exportToCSV(data.trends.bookings, 'bookings_report'); }}
            >
              <Download className="w-4 h-4 mr-2" /> Export Bookings Data
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { if (data) exportToCSV(data.trends.users, 'users_report'); }}
            >
              <Download className="w-4 h-4 mr-2" /> Export Users Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  );
}