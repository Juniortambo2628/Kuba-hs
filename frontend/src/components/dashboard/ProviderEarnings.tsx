"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowDownRight, ArrowUpRight, Loader2, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        return <Skeleton className="h-64 w-full rounded-3xl" />;
    }

    return (
        <Card className="border-none bg-white dark:bg-white/5 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black tracking-tight text-foreground">Earning History</CardTitle>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Payouts & Transactions</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="pl-8 h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference</TableHead>
                            <TableHead className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Service</TableHead>
                            <TableHead className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                            <TableHead className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Fee</TableHead>
                            <TableHead className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Payout</TableHead>
                            <TableHead className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground pr-8">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors border-border/50">
                                <TableCell className="pl-8 py-4">
                                    <span className="text-[10px] font-bold uppercase text-primary">#{tx.transaction_id || 'N/A'}</span>
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
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Wallet className="w-8 h-8 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest ">No transactions yet</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
