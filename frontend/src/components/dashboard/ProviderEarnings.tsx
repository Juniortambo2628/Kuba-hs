"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { uiPrimitives } from "@/lib/ui-primitives";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";

export function ProviderEarnings() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/api/payments/provider/transactions");
        setTransactions(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  return (
    <DashboardDataCard variant="elevated" className="overflow-hidden">
      <CardHeader className="p-8 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Earning History
            </CardTitle>
            <p className={uiPrimitives.label.caps}>Recent Payouts & Transactions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <DashboardTableHeaderRow>
            <DashboardTableHead position="first">Reference</DashboardTableHead>
            <DashboardTableHead>Service</DashboardTableHead>
            <DashboardTableHead>Amount</DashboardTableHead>
            <DashboardTableHead>Platform Fee</DashboardTableHead>
            <DashboardTableHead>Net Payout</DashboardTableHead>
            <DashboardTableHead position="last">Date</DashboardTableHead>
          </DashboardTableHeaderRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors border-border/50">
              <TableCell className="pl-8 py-4">
                <span className={uiPrimitives.label.capsPrimary}>
                  #{tx.transaction_id || "N/A"}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <p className="text-sm font-semibold">{tx.booking?.service?.name || "Service"}</p>
              </TableCell>
              <TableCell className="py-4 font-bold text-sm tabular-nums text-foreground">
                KES {Number(tx.amount).toLocaleString()}
              </TableCell>
              <TableCell className="py-4 text-xs font-medium text-primary">
                - KES {Number(tx.platform_fee).toLocaleString()}
              </TableCell>
              <TableCell className="py-4 font-black text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
                KES {Number(tx.provider_amount).toLocaleString()}
              </TableCell>
              <TableCell className="pr-8 py-4 text-xs font-medium text-muted-foreground">
                {new Date(tx.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-48 p-0 border-0">
                <DashboardEmptyState
                  icon={Wallet}
                  title="No transactions yet"
                  description="Completed bookings will appear here once payouts are processed."
                  className="min-h-[12rem] border-0 shadow-none rounded-none"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DashboardDataCard>
  );
}
