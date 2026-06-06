"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Banknote, Clock, CheckCircle, Zap, Wallet, AlertCircle } from "lucide-react";
import { FinanceOverview } from "@/components/admin/FinanceOverview";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { toast } from "sonner";
import { useApiData } from "@/hooks/useApiData";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import { MetricCard } from "@/components/shared/MetricCard";
import { PaymentTransactionBadge } from "@/components/shared/PaymentTransactionBadge";
import { PayoutStatusBadge } from "@/components/shared/PayoutStatusBadge";
import { PaymentDetailSheet } from "@/components/admin/PaymentDetailSheet";
import axiosInstance from "@/lib/axios";

// --- TYPES ---
interface Payment {
  id: string;
  transaction_id: string;
  amount: number;
  platform_fee: number;
  status: string;
  created_at: string;
  customer?: { name: string };
  provider?: { business_name: string };
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  processed_at?: string;
  created_at: string;
  provider?: {
    business_name: string;
    balance: number;
    total_earned: number;
    user?: { name: string, email: string, phone: string };
  };
}

const VALID_TABS = ["overview", "transactions", "payouts"] as const;
type FinanceTab = (typeof VALID_TABS)[number];

function AdminPaymentsContent() {
  const { exportToCSV } = useExport();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab: FinanceTab = VALID_TABS.includes(tabParam as FinanceTab)
    ? (tabParam as FinanceTab)
    : "overview";

  const setTab = (tab: FinanceTab) => {
    router.replace(`/admin/payments?tab=${tab}`, { scroll: false });
  };

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="Finance & Payments"
        subtitle="Revenue overview, transaction registry, and provider payout processing."
      />

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as FinanceTab)} className="w-full">
        <TabsList className="mb-6 bg-transparent space-x-2 border-b border-border w-full justify-start rounded-none h-auto p-0 pb-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-full px-6 py-2 transition-all font-bold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-full px-6 py-2 transition-all font-bold"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-full px-6 py-2 transition-all font-bold"
          >
            Provider Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <FinanceOverview />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6 mt-0">
          <TransactionsView exportToCSV={exportToCSV} formatKES={formatKES} />
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6 mt-0">
          <PayoutsView exportToCSV={exportToCSV} formatKES={formatKES} />
        </TabsContent>
      </Tabs>
    </DashboardPageContainer>
  );
}

export default function AdminPayments() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback bodyHeight="h-64" />}>
      <AdminPaymentsContent />
    </Suspense>
  );
}

// --- HELPERS ---
const formatKES = (val: number | string) => `KES ${Number(val || 0).toLocaleString()}`;

// --- TRANSACTIONS VIEW (Existing Logic) ---
function TransactionsView({ exportToCSV, formatKES }: { exportToCSV: any, formatKES: any }) {
  const { search, setSearch, status, setStatus } = useSearchState();
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [detailPaymentId, setDetailPaymentId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data: paymentData, isLoading } = useApiData<any>(
    `/api/admin/payments?search=${search}&status=${status || ''}`,
    { initialData: null }
  );

  const payments = (paymentData?.payments?.data || []) as Payment[];
  const stats = paymentData?.stats;

  const kpiStats = [
    { label: "Gross Volume", value: stats ? formatKES(stats.total_volume) : "KES 0", icon: Banknote, trend: "Total processed" },
    { label: "Platform Fees", value: stats ? formatKES(stats.total_fees) : "KES 0", icon: Zap, trend: "Total earned" },
    { label: "Pending Funds", value: stats ? formatKES(stats.pending_volume) : "KES 0", icon: Clock, trend: "Awaiting settlement" },
    { label: "Success Rate", value: stats ? `${stats.completed_count} Tx` : "0 Tx", icon: CheckCircle, trend: "Fully settled" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, i) => (
          <MetricCard key={i} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <div className="flex justify-end px-1">
        <Button onClick={() => exportToCSV(payments, "transactions")} variant="outline" size="sm" className="rounded-xl font-bold gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search payments"
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
              { label: 'Failed', value: 'failed' }
            ]
          }
        ]}
      />

      <DashboardDataCard variant="base">
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-6 h-14 text-xs">Transaction Ref</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Identity</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Gross Amount</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Status</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Settled At</DashboardTableHead>
                <DashboardTableHead position="last" className="h-14 text-xs text-right">Action</DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell className="p-6" colSpan={6}><Skeleton className="h-4 w-full" /></TableCell></TableRow>
                ))
              ) : payments.map((p) => (
                <TableRow
                  key={p.id}
                  className="hover:bg-muted/50 border-border cursor-pointer"
                  onClick={() => {
                    setDetailPaymentId(String(p.id));
                    setDetailOpen(true);
                  }}
                >
                  <TableCell className="pl-6 py-4">
                    <div className="font-mono text-sm font-bold">{p.transaction_id || `KBA-TX-${p.id}`}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-sm">{p.customer?.name || "Anonymous Client"}</div>
                    <div className="text-xs text-muted-foreground">to {p.provider?.business_name}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-black text-sm">{formatKES(p.amount)}</div>
                    <div className="text-[10px] text-muted-foreground">{formatKES(p.platform_fee)} Platform Fee</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <PaymentTransactionBadge status={p.status} />
                  </TableCell>
                  <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailPaymentId(String(p.id));
                        setDetailOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-muted-foreground font-bold text-sm">No transactions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </DashboardDataCard>

      <PaymentDetailSheet
        paymentId={detailPaymentId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

// --- PAYOUTS VIEW (New Phase 25 Logic) ---
function PayoutsView({ exportToCSV, formatKES }: { exportToCSV: any, formatKES: any }) {
  const { search, setSearch, status, setStatus } = useSearchState();

  const { data: overview, isLoading: loadingOverview } = useApiData<any>('/api/admin/financials/overview');
  const { data: payoutsData, isLoading, refetch } = useApiData<any>(
    `/api/admin/financials/payouts?search=${search}&status=${status || 'all'}`,
    { initialData: null }
  );

  const payouts = (payoutsData?.data || []) as Payout[];

  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [resolveDrawerOpen, setResolveDrawerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [processStatus, setProcessStatus] = useState<'paid'|'rejected'>('paid');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const kpiStats = [
    { label: "Total Platform Revenue", value: overview ? formatKES(overview.total_revenue) : "KES 0", icon: Banknote, trend: "Lifetime Earnings" },
    { label: "Global Provider Balance", value: overview ? formatKES(overview.global_provider_balance) : "KES 0", icon: Wallet, trend: "Held in platform" },
    { label: "Pending Payout Amount", value: overview ? formatKES(overview.pending_payouts_amount) : "KES 0", icon: AlertCircle, trend: "Requires action" },
    { label: "Pending Requests", value: overview ? `${overview.pending_payouts_count} Requests` : "0", icon: Clock, trend: "In queue" }
  ];

  const handleProcess = async () => {
    if (!selectedPayout) return;
    setIsProcessing(true);
    try {
      await axiosInstance.post(`/api/admin/financials/payouts/${selectedPayout.id}/process`, {
        status: processStatus,
        reference_number: reference,
        notes: notes
      });
      toast.success(`Payout successfully marked as ${processStatus}.`);
      setResolveDrawerOpen(false);
      setSelectedPayout(null);
      setReference('');
      setNotes('');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process payout");
    } finally {
      setIsProcessing(false);
    }
  };

  const openDrawer = (p: Payout) => {
    setSelectedPayout(p);
    setProcessStatus('paid');
    setReference('');
    setNotes('');
    setResolveDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, i) => (
          <MetricCard key={i} {...stat} isLoading={loadingOverview} />
        ))}
      </div>

      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search payouts"
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status || 'all',
            onChange: (val) => setStatus(val || 'all'),
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Processing', value: 'processing' },
              { label: 'Paid', value: 'paid' },
              { label: 'Rejected', value: 'rejected' }
            ]
          }
        ]}
      />

      <DashboardDataCard variant="base">
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-6 h-14 text-xs">Provider</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Payout Amount</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Method</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Status</DashboardTableHead>
                <DashboardTableHead className="h-14 text-xs">Requested At</DashboardTableHead>
                <DashboardTableHead position="last" className="h-14 text-xs text-right">Action</DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell className="p-6" colSpan={6}><Skeleton className="h-4 w-full" /></TableCell></TableRow>
                ))
              ) : payouts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/50 border-border group cursor-pointer" onClick={() => p.status === 'pending' && openDrawer(p)}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold text-sm tracking-tight">{p.provider?.business_name}</div>
                    <div className="text-xs text-muted-foreground">{p.provider?.user?.email}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-black text-sm">{formatKES(p.amount)}</div>
                    <div className="text-[10px] text-muted-foreground">Current Bal: {formatKES(p.provider?.balance || 0)}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="capitalize text-[10px] bg-background/50 border-border">{p.payment_method?.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <PayoutStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="py-4 text-xs font-bold text-muted-foreground whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    {p.status === 'pending' || p.status === 'processing' ? (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); openDrawer(p); }} className="rounded-xl px-4 font-bold text-xs h-8">
                        Process
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setResolveDrawerOpen(true); setSelectedPayout(p); }} className="rounded-xl px-4 font-bold text-xs h-8">
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payouts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-muted-foreground font-bold text-sm">No payout requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </DashboardDataCard>

      {/* PROCESS PAYOUT DRAWER */}
      <Sheet open={resolveDrawerOpen} onOpenChange={setResolveDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-card p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border bg-muted/30">
            <SheetTitle className="text-xl font-black tracking-tight">Process Payout</SheetTitle>
            <SheetDescription className="text-xs font-medium">Verify provider details and finalize the bank transfer or mobile money manual disbursement.</SheetDescription>
          </SheetHeader>
          
          {selectedPayout && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Provider Details</h4>
                <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-bold text-muted-foreground">Business Name</span>
                    <span className="text-sm font-black text-foreground">{selectedPayout.provider?.business_name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-bold text-muted-foreground">Contact Phone</span>
                    <span className="text-sm font-bold text-foreground">{selectedPayout.provider?.user?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-bold text-muted-foreground">Requested Amount</span>
                    <span className="text-lg font-black text-primary">{formatKES(selectedPayout.amount)}</span>
                  </div>
                </div>
              </div>

              {(selectedPayout.status === 'pending' || selectedPayout.status === 'processing') ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Action</Label>
                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant={processStatus === 'paid' ? 'default' : 'outline'} 
                        className={`flex-1 rounded-xl h-12 font-bold ${processStatus === 'paid' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20' : ''}`}
                        onClick={() => setProcessStatus('paid')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
                      </Button>
                      <Button 
                        type="button"
                        variant={processStatus === 'rejected' ? 'destructive' : 'outline'} 
                        className={`flex-1 rounded-xl h-12 font-bold`}
                        onClick={() => setProcessStatus('rejected')}
                      >
                        Reject & Refund
                      </Button>
                    </div>
                  </div>

                  {processStatus === 'paid' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <Label className="text-sm font-bold">Transaction Reference ID</Label>
                      <Input 
                        placeholder="e.g. MPESA-QWX123456" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="rounded-xl h-12 font-mono font-bold"
                      />
                      <p className="text-[11px] text-muted-foreground font-medium">Please enter the actual bank/M-Pesa transaction reference for auditing.</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Admin Notes (Optional)</Label>
                    <Textarea 
                      placeholder={processStatus === 'rejected' ? "Reason for rejection..." : "Any additional notes..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-xl min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resolution Details</h4>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-3">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-xs font-bold text-muted-foreground">Final Status</span>
                      <PayoutStatusBadge status={selectedPayout.status} />
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-xs font-bold text-muted-foreground">Reference</span>
                      <span className="text-sm font-mono font-bold text-foreground">{selectedPayout.reference_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs font-bold text-muted-foreground">Processed On</span>
                      <span className="text-sm font-bold text-foreground">
                        {selectedPayout.processed_at ? new Date(selectedPayout.processed_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  {selectedPayout.notes && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                      <p className="text-xs font-bold text-muted-foreground mb-1">Admin Notes:</p>
                      <p className="text-sm text-foreground font-medium leading-relaxed">{selectedPayout.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <SheetFooter className="p-6 border-t border-border bg-background">
            {(selectedPayout?.status === 'pending' || selectedPayout?.status === 'processing') && (
              <Button 
                onClick={handleProcess} 
                disabled={isProcessing || (processStatus === 'paid' && !reference)} 
                className="w-full rounded-xl h-12 font-black text-base"
              >
                {isProcessing ? "Processing..." : `Confirm ${processStatus === 'paid' ? 'Payout' : 'Rejection'}`}
              </Button>
            )}
            {selectedPayout?.status !== 'pending' && selectedPayout?.status !== 'processing' && (
              <Button onClick={() => setResolveDrawerOpen(false)} variant="outline" className="w-full rounded-xl h-12 font-bold">
                Close
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
