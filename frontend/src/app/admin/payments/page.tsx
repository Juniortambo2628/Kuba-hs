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

 /* 
   Initial loading state handled by skeleton. 
   We remove the early return to show the full layout with skeletons.
 */

 return (
  <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
   <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight uppercase">
        Financial <span className="text-primary">Ledger</span>
      </h1>
      <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        Comprehensive oversight of platform revenue and merchant disbursements.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <Button 
        onClick={() => exportToCSV(payments, 'payment_ledger')}
        variant="outline" 
        className="h-12 border-border bg-white text-foreground hover:text-primary rounded-xl font-semibold px-6 transition-all uppercase tracking-normal text-[10px] gap-2"
      >
        <Download className="w-4 h-4" /> Export CSV
      </Button>
      <button 
        onClick={() => toast.info("Opening Payout Gateway Configuration...")}
        className="h-12 bg-primary hover:bg-black text-white rounded-xl font-semibold px-8 shadow-lg shadow-gray-100 transition-all uppercase tracking-normal text-[10px]"
      >
        Payout Settings
      </button>
    </div>
   </div>
   
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
       { label: "Gross Volume", value: stats ? `KES ${Number(stats.total_volume).toLocaleString()}` : "KES 0", icon: Banknote, color: "text-foreground", bg: "bg-muted", trend: "Total processed" },
       { label: "Platform Fees", value: stats ? `KES ${Number(stats.total_fees).toLocaleString()}` : "KES 0", icon: Zap, color: "text-primary", bg: "bg-muted", trend: "Total earned" },
       { label: "Pending Funds", value: stats ? `KES ${Number(stats.pending_volume).toLocaleString()}` : "KES 0", icon: Clock, color: "text-amber-600", bg: "bg-muted", trend: "Awaiting settlement" },
       { label: "Success Rate", value: stats ? `${stats.completed_count} Tx` : "0 Tx", icon: CheckCircle, color: "text-foreground", bg: "bg-muted", trend: "Fully settled" }
      ].map((stat, i) => (
       <Card key={i} className={`border border-border group border-none ${isLoading ? 'animate-pulse' : ''}`}>
        <CardContent className="p-8 flex items-center justify-between">
         {isLoading ? (
          <div className="space-y-3 w-full">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
         ) : (
          <>
           <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-semibold text-muted-foreground uppercase whitespace-nowrap">{stat.trend}</span>
            </div>
           </div>
           <div className={`p-4 ${stat.bg} rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
            <stat.icon className="w-5 h-5" />
           </div>
          </>
         )}
        </CardContent>
       </Card>
      ))}
    </div>

   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 mt-4 px-1">
    <div>
     <h2 className="text-2xl font-bold text-foreground tracking-tight">Transaction Registry</h2>
     <p className="text-sm font-medium text-muted-foreground mt-1">Detailed audit log of all monetary movements within the Kuba ecosystem.</p>
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
         <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Transaction Ref</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Identity</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Gross Amount</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Status</TableHead>
         <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Settled At</TableHead>
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
             <span className="text-[10px] font-semibold text-foreground uppercase tracking-normal font-mono group-hover:text-primary transition-colors">
               {p.transaction_id || `KBA-TX-${p.id}`}
             </span>
           </div>
          </TableCell>
          <TableCell className="py-6">
           <div className="space-y-0.5">
             <p className="font-semibold text-foreground text-sm">{p.customer?.name || "Anonymous Client"}</p>
             <p className="text-[9px] font-bold text-muted-foreground uppercase">to {p.provider?.business_name || "Merchant"}</p>
           </div>
          </TableCell>
          <TableCell className="py-6">
           <div className="space-y-0.5 font-semibold text-foreground text-base tracking-tight">
             ${p.amount}
             <p className="text-[8px] text-muted-foreground uppercase tracking-normal ">{p.platform_fee ? `$${p.platform_fee} Platform Fee` : "Zero Fee Apply"}</p>
           </div>
          </TableCell>
          <TableCell className="py-6">
           <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold text-[8px] uppercase tracking-normal border ${p.status === 'completed' ? "bg-muted text-foreground border-border" : "bg-muted text-foreground border-border"}`}>
             {p.status}
           </Badge>
          </TableCell>
          <TableCell className="pr-10 py-6 text-right font-semibold text-foreground text-[10px] uppercase text-muted-foreground">
           {new Date(p.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
          </TableCell>
         </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow>
           <TableCell colSpan={5} className="h-80 text-center">
             <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
               <Wallet className="h-16 w-16 opacity-10" />
               <p className="text-[10px] font-semibold uppercase tracking-wide ">No financial activity recorded</p>
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
        <p className="text-[10px] font-semibold uppercase tracking-wide ">No financial activity recorded</p>
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
           <h3 className="text-[10px] font-semibold text-primary uppercase tracking-normal font-mono group-hover:text-primary transition-colors">
            {p.transaction_id || `KBA-TX-${p.id}`}
           </h3>
           <p className="text-[10px] text-muted-foreground uppercase">{new Date(p.created_at).toLocaleDateString()}</p>
          </div>
         </div>
         <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase border bg-muted text-foreground border-border`}>
          {p.status}
         </Badge>
        </div>
        
        <div className="space-y-3 mb-5">
         <div>
          <p className="text-sm font-semibold text-foreground truncate">{p.customer?.name || "Anonymous Client"}</p>
          <p className="text-xs text-muted-foreground truncate flex flex-col mt-1">
           <span><span className="font-medium text-foreground">Recipient:</span> {p.provider?.business_name || "Merchant"}</span>
          </p>
         </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div>
            <p className="text-lg font-bold text-foreground leading-none">${p.amount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mt-1">Gross Amount</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground leading-none">${p.platform_fee || '0.00'}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mt-1">Platform Fee</p>
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
