"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
 Banknote, 
 TrendingUp, 
 Wallet, 
 Clock, 
 CheckCircle, 
 ShieldCheck, 
 ArrowUpRight,
 Filter,
 Search,
 Zap,
 CreditCard,
 Download
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { toast } from "sonner";
import { DataToolbar } from "@/components/shared/DataToolbar";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Payment, User, Provider } from "@/types";

export default function AdminPayments() {
  const { search, setSearch, status, setStatus } = useSearchState();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const { exportToCSV } = useExport();
  
  useEffect(() => {
    fetchPayments(search, status);
  }, [search, status]);

  const fetchPayments = async (search = "", status = "") => {
    try {
      const res = await axiosInstance.get(`/api/admin/payments?search=${search}&status=${status}`);
      setPayments(res.data.payments.data || []);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatKES = (val: number) => `KES ${Number(val).toLocaleString()}`;

  const kpiStats = [
    { label: "Gross Volume", value: stats ? formatKES(stats.total_volume) : "KES 0", icon: Banknote, trend: "Total processed" },
    { label: "Platform Fees", value: stats ? formatKES(stats.total_fees) : "KES 0", icon: Zap, trend: "Total earned" },
    { label: "Pending Funds", value: stats ? formatKES(stats.pending_volume) : "KES 0", icon: Clock, trend: "Awaiting settlement" },
    { label: "Success Rate", value: stats ? `${stats.completed_count} Tx` : "0 Tx", icon: CheckCircle, trend: "Fully settled" }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <DashboardPageHeader 
        title="Financial Ledger" 
        subtitle="Comprehensive oversight of platform revenue and merchant disbursements."
      >
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => exportToCSV(payments, 'payment_ledger')}
            variant="outline" 
            size="sm"
            className="rounded-xl font-bold gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button 
            onClick={() => toast.info("Opening Payout Gateway Configuration...")}
            size="sm"
            className="rounded-xl font-bold px-6"
          >
            Payout Settings
          </Button>
        </div>
      </DashboardPageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, i) => (
          <MetricCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 mt-4 px-1">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Transaction Registry</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">Detailed audit log of all monetary movements within the ecosystem.</p>
        </div>
      </div>

      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by Transaction ID or Client..."
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status || '',
            onChange: (val) => setStatus(val || null),
            options: [
              { label: 'All Status', value: '' },
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
              { label: 'Failed', value: 'failed' },
              { label: 'Refunded', value: 'refunded' }
            ]
          }
        ]}
      />

      {viewMode === 'list' ? (
        <Card className="border border-border overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="pl-10 h-16 text-[11px] font-bold tracking-tight text-muted-foreground">Transaction Ref</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold tracking-tight text-muted-foreground">Identity</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold tracking-tight text-muted-foreground">Gross Amount</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold tracking-tight text-muted-foreground">Status</TableHead>
                  <TableHead className="h-16 pr-10 text-right text-[11px] font-bold tracking-tight text-muted-foreground">Settled At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent border-border">
                      <TableCell className="pl-10 py-6"><Skeleton className="h-4 w-32 rounded-lg" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-4 w-20 rounded-lg" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="pr-10 py-6 text-right"><Skeleton className="h-4 w-24 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/50 transition-colors border-border group">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold text-foreground tracking-tight font-mono group-hover:text-primary transition-colors">
                          {p.transaction_id || `KBA-TX-${p.id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-sm">{p.customer?.name || "Anonymous Client"}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">to {p.provider?.business_name || "Merchant"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-0.5 font-bold text-foreground text-base tracking-tight">
                        {formatKES(p.amount)}
                        <p className="text-[9px] text-muted-foreground tracking-tight ">{p.platform_fee ? `${formatKES(p.platform_fee)} Platform Fee` : "Zero Fee Applied"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold text-[9px] tracking-tight border ${p.status === 'completed' ? "bg-muted text-foreground border-border" : "bg-muted text-foreground border-border"}`}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-10 py-6 text-right font-bold text-muted-foreground text-[11px]">
                      {new Date(p.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-80 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                        <Wallet className="h-16 w-16 opacity-10" />
                        <p className="text-[11px] font-bold tracking-tight ">No financial activity recorded</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
          ) : payments.length === 0 ? (
            <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 text-muted-foreground border border-dashed border-border rounded-xl">
              <Wallet className="h-16 w-16 opacity-10" />
              <p className="text-[11px] font-bold tracking-tight ">No financial activity recorded</p>
            </div>
          ) : payments.map((p) => (
            <Card key={p.id} className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary border border-border">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-tight font-mono group-hover:text-primary transition-colors">
                        {p.transaction_id || `KBA-TX-${p.id}`}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-tight border bg-muted text-foreground border-border`}>
                    {p.status}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-sm font-bold text-foreground truncate">{p.customer?.name || "Anonymous Client"}</p>
                    <p className="text-xs text-muted-foreground truncate flex flex-col mt-1">
                      <span><span className="font-bold text-foreground">Recipient:</span> {p.provider?.business_name || "Merchant"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div>
                    <p className="text-lg font-bold text-foreground leading-none">{formatKES(p.amount)}</p>
                    <p className="text-[10px] font-bold tracking-tight text-muted-foreground mt-1">Gross Amount</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground leading-none">{formatKES(p.platform_fee || 0)}</p>
                    <p className="text-[10px] font-bold tracking-tight text-muted-foreground mt-1">Platform Fee</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
