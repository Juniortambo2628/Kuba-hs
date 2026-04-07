"use client";

import { useState } from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { 
  CreditCard, 
  DownloadCloud, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Receipt,
  FileText,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { toast } from "sonner";

export default function ClientBillingPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: paymentsData, isLoading } = useSWR(
    user ? "/api/payments/client/transactions" : null,
    (url) => axiosInstance.get(url).then(res => res.data)
  );

  const payments = paymentsData?.data || [];

  const handleDownloadInvoice = async (bookingId: string) => {
    try {
      const response = await axiosInstance.get(`/api/invoices/${bookingId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      console.error("Failed to download invoice:", err);
      toast.error("Failed to download invoice");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Successful</Badge>;
      case 'pending':
      case 'processing':
        return <Badge className="bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Failed</Badge>;
      default:
        return <Badge variant="outline" className="font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Billing & Payments</h1>
              <p className="text-muted-foreground font-semibold">
                Manage your service invoices and payment history
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-11 h-11 w-64 md:w-80 bg-background border-none focus-visible:ring-2 focus-visible:ring-primary/50 font-semibold text-xs rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-border/50 bg-background hover:bg-muted font-bold px-5 flex items-center gap-2 group shadow-sm transition-all duration-300">
            <Filter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] uppercase tracking-widest">Filter</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden group hover:shadow-md transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Spent</p>
                  <h3 className="text-3xl font-black mt-1">KES {payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0).toLocaleString()}</h3>
                </div>
              </div>
              <div className="h-full flex items-end">
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                  All Time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden group hover:shadow-md transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Bookings</p>
                  <h3 className="text-3xl font-black mt-1">{payments.filter((p: any) => p.status === 'pending').length}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-600 overflow-hidden group hover:shadow-xl transition-all duration-500 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <CreditCard className="w-24 h-24 text-white" />
          </div>
          <CardContent className="p-8 relative">
            <div className="space-y-4">
              <div className="p-3 bg-white/20 rounded-2xl w-fit">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em]">Saved Method</p>
                <h3 className="text-xl font-black text-white mt-1">Paystack Checkout</h3>
                <p className="text-[10px] text-white/50 font-bold mt-2">SECURE & INSTANT PAYMENTS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="px-10 py-8 border-b border-border/50">
          <div className="flex justify-between items-center text-foreground">
            <div>
              <CardTitle className="text-xl font-black tracking-tight">Transaction History</CardTitle>
              <CardDescription className="text-xs font-semibold mt-1">Detailed records of all your payments</CardDescription>
            </div>
            <Button variant="outline" className="h-9 px-4 rounded-xl border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-foreground">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Fetching your records...</p>
            </div>
          ) : payments.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-5 pl-10 h-auto font-black uppercase text-[10px] tracking-widest text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="py-5 h-auto font-black uppercase text-[10px] tracking-widest text-muted-foreground">Service</TableHead>
                  <TableHead className="py-5 h-auto font-black uppercase text-[10px] tracking-widest text-muted-foreground">Date</TableHead>
                  <TableHead className="py-5 h-auto font-black uppercase text-[10px] tracking-widest text-muted-foreground">Amount</TableHead>
                  <TableHead className="py-5 h-auto font-black uppercase text-[10px] tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="py-5 pr-10 h-auto text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: any) => (
                  <TableRow key={payment.id} className="hover:bg-muted/20 transition-colors border-border/50 group">
                    <TableCell className="pl-10 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                          #{payment.transaction_id || payment.id.substring(0, 8)}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">via {payment.payment_method || 'Paystack'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">{payment.booking?.service?.name || "Home Service"}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mt-1">Booking #{payment.booking?.booking_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 font-bold text-muted-foreground text-xs uppercase">
                      {new Date(payment.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-1 font-black text-sm text-foreground">
                        <span className="text-[10px] text-muted-foreground font-bold">KES</span>
                        {Number(payment.amount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="pr-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-9 px-4 rounded-xl text-primary font-black hover:bg-primary/5 transition-all flex items-center gap-2 border border-transparent hover:border-primary/20"
                          onClick={() => handleDownloadInvoice(payment.booking_id)}
                        >
                          <DownloadCloud className="w-4 h-4" />
                          <span className="text-[10px] uppercase tracking-widest">Invoice</span>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                          <Link href={`/dashboard/client/bookings/${payment.booking_id}`}>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <DashboardEmptyState
              title="No payment history found"
              className="py-24"
            >
              <p className="text-sm text-muted-foreground font-semibold max-w-sm mx-auto mb-8">
                You haven't made any payments yet. All your future service transactions will appear here.
              </p>
              <Button asChild className="rounded-2xl h-12 px-8 font-black uppercase text-[11px] tracking-[0.1em] shadow-lg shadow-primary/20">
                <Link href="/services">Discover Services</Link>
              </Button>
            </DashboardEmptyState>
          )}
        </CardContent>
      </Card>

      {/* Tips / Help */}
      <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="p-5 bg-primary/10 rounded-3xl shrink-0">
          <HelpCircle className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-4 flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black text-foreground tracking-tight">Need assistance with your payments?</h3>
          <p className="text-muted-foreground font-semibold max-w-2xl">
            If you have questions about a specific transaction or need a formal tax invoice, our support team is available 24/7. 
            All payments are processed securely through Paystack and protected by our 100% satisfaction guarantee.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <Button variant="outline" className="h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest border-border/50 bg-background hover:bg-muted font-black">Contact Support</Button>
            <Button asChild variant="link" className="h-11 font-bold text-primary group uppercase text-[10px] tracking-widest">
              <Link href="/privacy-policy" className="flex items-center">
                Read Refund Policy
                <ArrowUpRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
