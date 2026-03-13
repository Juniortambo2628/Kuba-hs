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

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Payment {
  id: number;
  transaction_id: string;
  amount: number;
  platform_fee: number;
  status: string;
  created_at: string;
  customer?: { name: string };
  provider?: { business_name: string };
}

export default function AdminPayments() {
  const { search, setSearch, status, setStatus } = useSearchState();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Financial <span className="text-sky-600">Ledger</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Comprehensive oversight of platform revenue and merchant disbursements.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Button 
                onClick={() => exportToCSV(payments, 'payment_ledger')}
                variant="outline" 
                className="h-12 border-gray-100 bg-white text-[#1E293B] hover:text-sky-600 rounded-xl font-black px-6 transition-all uppercase tracking-widest text-[10px] gap-2"
            >
                <Download className="w-4 h-4" /> Export CSV
            </Button>
            <button 
                onClick={() => toast.info("Opening Payout Gateway Configuration...")}
                className="h-12 bg-[#1E293B] hover:bg-black text-white rounded-xl font-black px-8 shadow-lg shadow-gray-100 transition-all uppercase tracking-widest text-[10px]"
            >
                Payout Settings
            </button>
        </div>
      </div>
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Gross Volume", value: stats ? `$${Number(stats.total_volume).toLocaleString()}` : "$0", icon: Banknote, color: "text-[#1E293B]", bg: "bg-gray-50", trend: "Total processed" },
              { label: "Platform Fees", value: stats ? `$${Number(stats.total_fees).toLocaleString()}` : "$0", icon: Zap, color: "text-sky-600", bg: "bg-sky-50", trend: "Total earned" },
              { label: "Pending Funds", value: stats ? `$${Number(stats.pending_volume).toLocaleString()}` : "$0", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "Awaiting settlement" },
              { label: "Success Rate", value: stats ? `${stats.completed_count} Tx` : "0 Tx", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Fully settled" }
            ].map((stat, i) => (
              <Card key={i} className={`premium-card group border-none ${isLoading ? 'animate-pulse' : ''}`}>
                <CardContent className="p-8 flex items-center justify-between">
                  {isLoading ? (
                    <div className="space-y-3 w-full">
                       <Skeleton className="h-3 w-20" />
                       <Skeleton className="h-8 w-32" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors tracking-tight">{stat.value}</span>
                            <span className="text-[8px] font-black text-gray-300 uppercase italic whitespace-nowrap">{stat.trend}</span>
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

      <Card className="premium-card overflow-hidden border-none shadow-premium">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Transaction Registry</h2>
                <p className="text-xs font-bold text-gray-400 italic">Detailed audit log of all monetary movements within the Kuba ecosystem.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Transaction ID or Client..." 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-12 border-gray-100 bg-white hover:bg-gray-50 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest gap-2">
                            <Filter className="w-4 h-4" />
                            {status || "All Status"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-premium">
                        <DropdownMenuLabel className="text-[10px] uppercase font-black text-gray-400 p-2">Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatus(null)} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3">All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("completed")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-emerald-600">Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("pending")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-amber-600">Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("failed")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-red-600">Failed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("refunded")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-sky-600">Refunded</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Transaction Ref</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Identity</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Gross Amount</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Status</TableHead>
                <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Settled At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent border-gray-50">
                    <TableCell className="pl-10 py-6"><Skeleton className="h-4 w-32 rounded-lg" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-20 rounded-lg" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="pr-10 py-6 text-right"><Skeleton className="h-4 w-24 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : payments.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-gray-200 group-hover:text-sky-500 transition-colors" />
                        <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest font-mono group-hover:text-sky-600 transition-colors">
                            {p.transaction_id || `KBA-TX-${p.id}`}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5">
                        <p className="font-black text-[#1E293B] text-sm">{p.customer?.name || "Anonymous Client"}</p>
                        <p className="text-[9px] font-bold text-gray-300 italic uppercase">to {p.provider?.business_name || "Merchant"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5 font-black text-[#1E293B] text-base tracking-tight">
                        ${p.amount}
                        <p className="text-[8px] text-emerald-500 uppercase tracking-widest italic">{p.platform_fee ? `$${p.platform_fee} Platform Fee` : "Zero Fee Apply"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${p.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right font-black text-[#1E293B] text-[10px] uppercase italic text-gray-400">
                    {new Date(p.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-80 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-gray-200">
                            <Wallet className="h-16 w-16 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No financial activity recorded</p>
                        </div>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
