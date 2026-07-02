"use client";

import { Suspense, useMemo } from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Receipt,
  DownloadCloud,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { PaymentTransactionBadge } from "@/components/shared/PaymentTransactionBadge";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-ui";

function ClientBillingContent() {
  const { user } = useAuth();
  const { search } = useSearchState();

  const { data: paymentsData, isLoading } = useSWR(
    user ? "/api/payments/client/transactions" : null,
    (url) => axiosInstance.get(url).then((res) => res.data)
  );

  const payments = paymentsData?.data || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p: Record<string, unknown>) => {
      const booking = p.booking as Record<string, unknown> | undefined;
      const service = booking?.service as { name?: string } | undefined;
      return (
        String(p.transaction_id || p.id).toLowerCase().includes(q) ||
        String(service?.name || "").toLowerCase().includes(q) ||
        String(booking?.booking_number || "").toLowerCase().includes(q)
      );
    });
  }, [payments, search]);

  const totalSpent = payments.reduce((acc: number, p: { amount: number }) => acc + Number(p.amount), 0);
  const pendingCount = payments.filter((p: { status: string }) => p.status === "pending").length;

  const handleDownloadInvoice = async (bookingId: string) => {
    try {
      const response = await axiosInstance.get(`/api/invoices/${bookingId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  if (!user) return null;

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Billing & payments"
        subtitle="Invoices and payment history. Use ⌘K in the header to search transactions."
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={CheckCircle2}
          label="Total spent"
          value={`KES ${totalSpent.toLocaleString()}`}
          tone="success"
          hint="All time"
        />
        <DashboardFrostedStatCard
          icon={Clock}
          label="Pending payments"
          value={pendingCount}
          tone={pendingCount > 0 ? "warning" : "neutral"}
        />
        <DashboardFrostedStatCard
          icon={CreditCard}
          label="Payment method"
          value="Paystack"
          tone="primary"
          hint="Secure checkout"
        />
      </DashboardFrostedStatGrid>

      {search && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} transaction{filtered.length === 1 ? "" : "s"} for &quot;{search}&quot;
        </p>
      )}

      <DashboardPanelCard
        title="Transaction history"
        description="Download invoices or open the related booking"
        icon={Receipt}
        padding={false}
        contentClassName="p-0"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        ) : filtered.length > 0 ? (
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-6">
                  Transaction
                </DashboardTableHead>
                <DashboardTableHead>Service</DashboardTableHead>
                <DashboardTableHead>Date</DashboardTableHead>
                <DashboardTableHead>Amount</DashboardTableHead>
                <DashboardTableHead>Status</DashboardTableHead>
                <DashboardTableHead position="last" className="!pr-6 text-right">
                  Actions
                </DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment: Record<string, unknown>) => {
                const booking = payment.booking as Record<string, unknown> | undefined;
                const service = booking?.service as { name?: string } | undefined;
                const bookingId = String(payment.booking_id ?? booking?.id ?? "");
                return (
                  <TableRow key={String(payment.id)} className="hover:bg-muted/20 border-border/40">
                    <TableCell className="pl-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        #{String(payment.transaction_id || payment.id).slice(0, 12)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        via {String(payment.payment_method || "Paystack")}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{service?.name || "Service"}</p>
                          <p className="text-xs text-muted-foreground">
                            Booking {String(booking?.booking_number || "—")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {new Date(String(payment.created_at)).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold tabular-nums">
                      KES {Number(payment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <PaymentTransactionBadge status={String(payment.status)} />
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {bookingId && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-xs"
                              onClick={() => handleDownloadInvoice(bookingId)}
                            >
                              <DownloadCloud className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full" asChild>
                              <Link href={`/dashboard/client/bookings/${bookingId}`}>
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState variant="dashboard" title="No payments yet" className="py-20">
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Completed booking payments will appear here with downloadable invoices.
            </p>
            <Button asChild className="rounded-full">
              <Link href="/services">Browse services</Link>
            </Button>
          </EmptyState>
        )}
      </DashboardPanelCard>

      <DashboardPanelCard title="Need help?" icon={HelpCircle}>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Questions about a charge or need a formal invoice? Contact support — payments are processed
          securely through Paystack.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/contact">Contact support</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/legal/privacy">Refund policy</Link>
          </Button>
        </div>
      </DashboardPanelCard>
    </DashboardPageContainer>
  );
}

export default function ClientBillingPage() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <ClientBillingContent />
    </Suspense>
  );
}
