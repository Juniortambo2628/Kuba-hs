"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { MetricCard } from "@/components/shared/MetricCard";
import { ChartContainer } from "@/components/shared/ChartContainer";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useData } from "@/hooks/useData";

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

export function FinanceOverview() {
  const { data: financeData, isLoading } = useData<{ stats: FinanceStats; recent_payments: Payment[] }>(
    "/api/admin/financials/charts"
  );
  const stats = financeData?.stats;
  const recentPayments = financeData?.recent_payments || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  const monthlyData = [...(stats?.monthly_revenue || [])].reverse();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Transaction Volume"
          value={`KES ${Number(stats?.total_volume || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="Gross platform flow"
        />
        <MetricCard
          label="Platform Profit"
          value={`KES ${Number(stats?.total_platform_fees || 0).toLocaleString()}`}
          icon={TrendingUp}
          trend="System commission"
        />
        <MetricCard
          label="Merchant Payouts"
          value={`KES ${Number(stats?.total_provider_payouts || 0).toLocaleString()}`}
          icon={Wallet}
          trend="Settled accounts"
        />
        <MetricCard
          label="Escrow Capital"
          value={`KES ${Number(stats?.pending_payouts || 0).toLocaleString()}`}
          icon={ShieldCheck}
          trend="Pending verification"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Revenue Dynamics</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Monthly volume and platform fees</p>
              </div>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer height={280}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="financeRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(val) => `KES ${val}`}
                  />
                  <Tooltip contentStyle={{ borderRadius: "1rem", border: "none" }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#financeRev)"
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
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Payment Channels</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">By transaction count</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <ChartContainer height={220}>
                <PieChart>
                  <Pie
                    data={stats?.payment_methods || []}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={6}
                    dataKey="count"
                    nameKey="payment_method"
                  >
                    {(stats?.payment_methods || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <DashboardDataCard variant="base" className="overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border">
          <CardTitle className="text-base font-bold tracking-tight">Recent Transactions</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Latest 10 — use the Transactions tab for full search and export.</p>
        </CardHeader>
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-6">TX / Date</DashboardTableHead>
                <DashboardTableHead>Participants</DashboardTableHead>
                <DashboardTableHead>Amount</DashboardTableHead>
                <DashboardTableHead>Status</DashboardTableHead>
                <DashboardTableHead position="last" className="!pr-6 text-right">Booking</DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {recentPayments.map((payment) => (
                <TableRow key={payment.id} className="border-border hover:bg-muted/30">
                  <TableCell className="pl-6 py-3">
                    <p className="text-xs font-bold font-mono">#{payment.transaction_id?.slice(-8)}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-xs">
                    <p className="font-medium">{payment.customer?.name}</p>
                    <p className="text-muted-foreground">{payment.provider?.user?.name}</p>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-sm font-bold">KES {Number(payment.amount).toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      Fee: KES {Number(payment.platform_fee).toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-3 text-right font-mono text-[10px]">
                    {payment.booking?.booking_number}
                  </TableCell>
                </TableRow>
              ))}
              {recentPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm font-medium">
                    No transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </DashboardDataCard>
    </div>
  );
}
