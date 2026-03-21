"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, History, Plus, ShieldCheck, Zap, Star, TrendingUp, ChevronRight, Gift, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";

interface Tier {
 id: number;
 name: string;
 min_points: number;
 benefits: string[];
 is_active: boolean;
}

interface Transaction {
 id: number;
 user: { name: string };
 points: number;
 description: string;
 transaction_type: 'earn' | 'redeem';
 created_at: string;
}

export default function AdminLoyalty() {
 const [tiers, setTiers] = useState<Tier[]>([]);
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [currentTier, setCurrentTier] = useState<Partial<Tier>>({});
 const [isSaving, setIsSaving] = useState(false);
 const [isLedgerOpen, setIsLedgerOpen] = useState(false);
 const [ledgerPage, setLedgerPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  fetchData();
 }, [ledgerPage]);

 const handleOpenSheet = (tier?: Tier) => {
  if (tier) {
   setCurrentTier(tier);
  } else {
   setCurrentTier({ name: '', min_points: 0, benefits: [''], is_active: true });
  }
  setIsSheetOpen(true);
 };

 const handleSaveTier = async () => {
  setIsSaving(true);
  try {
   if (currentTier.id) {
    await axiosInstance.put(`/api/admin/loyalty/tiers/${currentTier.id}`, currentTier);
    toast.success("Tier updated successfully");
   } else {
    await axiosInstance.post("/api/admin/loyalty/tiers", currentTier);
    toast.success("Tier created successfully");
   }
   setIsSheetOpen(false);
   fetchData();
  } catch (error) {
   toast.error("Failed to save tier");
  } finally {
   setIsSaving(false);
  }
 };

 const fetchData = async () => {
  try {
   const [tiersRes, transRes] = await Promise.all([
    axiosInstance.get("/api/admin/loyalty/tiers"),
    axiosInstance.get(`/api/admin/loyalty/transactions?page=${ledgerPage}`)
   ]);
   setTiers(tiersRes.data.data || []);
   setTransactions(transRes.data.data || []);
   setTotalPages(transRes.data.meta?.last_page || 1);
  } catch (err) {
   console.error("Failed to fetch loyalty data:", err);
  } finally {
   setIsLoading(false);
  }
 };

 if (isLoading) {
  return (
   <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-12 w-64 rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-[2rem]" />)}
      </div>
      <Skeleton className="h-[600px] rounded-[2rem]" />
    </div>
   </div>
  );
 }

 return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
        {/* Standard Dashboard Header */}
        <DashboardPageHeader 
            title="Loyalty Architecture" 
            subtitle="Configure platform reward tiers, benefit structures, and track point velocity."
        >
            <Button 
                onClick={() => handleOpenSheet()} 
                className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Define Reward Tier
            </Button>
        </DashboardPageHeader>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
    {/* Tiers Management */}
            <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">System Reward Tiers</h2>
                        <p className="text-xs font-bold text-muted-foreground">Manage user progression and elite benefits.</p>
                    </div>
                </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {tiers.map((tier) => (
       <Card key={tier.id} className="border border-border group border-none overflow-hidden hover:bg-muted/5 transition-all duration-700">
        <CardContent className="p-10 space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1.5">
                                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{tier.name}</h3>
                                            <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold text-[9px] border-none shadow-sm ${tier.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                                                {tier.is_active ? "Live Status" : "Offline"}
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-2xl text-foreground group-hover:scale-110 group-hover:rotate-12 transition-all shadow-sm border border-border/40">
                                            <Gift className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-muted-foreground">Entry Requirement</p>
                                        <p className="text-3xl font-bold text-foreground tracking-tighter">
                                            {tier.min_points.toLocaleString()} <span className="text-xs text-muted-foreground font-bold ml-1">Kuba Points</span>
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-border/50">
                                        <p className="text-[11px] font-bold text-primary mb-4">Core Benefits Portfolio</p>
          {tier.benefits?.map((benefit, i) => (
           <div key={i} className="flex items-center gap-3 group/item">
            <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover/item:scale-150 transition-transform" />
            <span className="text-xs font-bold text-foreground ">{benefit}</span>
           </div>
          ))}
         </div>

                                    <Button 
                                        onClick={() => handleOpenSheet(tier)} 
                                        variant="outline" 
                                        className="w-full h-12 border-border/60 text-foreground hover:text-white hover:bg-black hover:border-black rounded-xl font-bold text-xs transition-all shadow-sm"
                                    >
                                        Modify Tier Architecture
                                    </Button>
        </CardContent>
       </Card>
      ))}
                    <Card className="border border-dashed border-border p-20 flex flex-col items-center justify-center col-span-2 text-muted-foreground bg-muted/10 rounded-[2.5rem]">
                        <Trophy className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-xs font-bold text-muted-foreground">No reward architectures in the registry</p>
                    </Card>
     </div>
    </div>

    {/* Global Activity Ledger */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Point Velocity</h2>
                            <p className="text-xs font-bold text-muted-foreground">Live movement audit.</p>
                        </div>
                    </div>

     <Card className="border border-border border-none overflow-hidden shadow-sm">
      <Table>
       <TableBody>
        {transactions.map((t) => (
         <TableRow key={t.id} className="hover:bg-muted/50 transition-colors border-border group">
          <TableCell className="pl-8 py-6">
           <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.user?.name}</p>
            <p className="text-[10px] font-bold text-muted-foreground line-clamp-1">{t.description}</p>
           </div>
          </TableCell>
          <TableCell className="pr-8 py-6 text-right">
                                            <div className="space-y-1">
                                                <p className={`text-sm font-bold tabular-nums ${t.transaction_type === 'earn' ? 'text-foreground' : 'text-primary'}`}>
                                                    {t.transaction_type === 'earn' ? '+' : '-'}{t.points}
                                                </p>
                                                <p className="text-[10px] font-bold text-muted-foreground">
                                                    {new Date(t.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short' })}
                                                </p>
                                            </div>
          </TableCell>
         </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell className="text-center py-20 text-muted-foreground ">
              <Zap className="h-10 w-10 mx-auto mb-2 opacity-10" />
              <p className="text-[10px] font-semibold uppercase tracking-normal">Zero activity detected</p>
            </TableCell>
          </TableRow>
        )}
       </TableBody>
      </Table>
                    <div className="p-8 border-t border-border bg-muted/10 flex justify-center">
                        <button 
                            onClick={() => setIsLedgerOpen(true)}
                            className="text-xs font-bold text-foreground hover:text-primary transition-all flex items-center gap-2 group"
                        >
                            Full Ledger Audit
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
     </Card>
    </div>
   </div>

            <Sheet open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl bg-white dark:bg-zinc-950 border-l border-border/40 p-0">
                    <div className="p-8 border-b border-border/10">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-2xl font-bold text-foreground tracking-tight">Financial Ledger</SheetTitle>
                            <SheetDescription className="font-bold text-muted-foreground text-xs mt-1">
                                Complete history of platform reward movements.
                            </SheetDescription>
                        </SheetHeader>
                    </div>
     <div className="py-8 space-y-6">
      <Card className="border border-border border-none overflow-hidden shadow-sm">
       <Table>
        <TableBody>
         {transactions.map((t) => (
          <TableRow key={t.id} className="hover:bg-muted/50 transition-colors border-border">
           <TableCell className="pl-6 py-4">
            <div className="space-y-1">
             <p className="text-xs font-semibold text-foreground">{t.user?.name}</p>
             <p className="text-[9px] font-bold text-muted-foreground line-clamp-1">{t.description}</p>
            </div>
           </TableCell>
           <TableCell className="pr-6 py-4 text-right">
            <div className="space-y-1">
             <p className={`text-xs font-semibold tabular-nums ${t.transaction_type === 'earn' ? 'text-foreground' : 'text-primary'}`}>
               {t.transaction_type === 'earn' ? '+' : '-'}{t.points}
             </p>
             <p className="text-[8px] font-bold text-muted-foreground uppercase ">
               {new Date(t.created_at).toLocaleDateString()}
             </p>
            </div>
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </Card>

      <div className="flex items-center justify-between px-2">
       <Button 
        variant="outline" 
        disabled={ledgerPage === 1}
        onClick={() => setLedgerPage(prev => Math.max(1, prev - 1))}
        className="h-10 text-[9px] font-semibold uppercase tracking-normal rounded-xl"
       >
        Previous
       </Button>
       <span className="text-[10px] font-semibold text-foreground">Page {ledgerPage} of {totalPages}</span>
       <Button 
        variant="outline" 
        disabled={ledgerPage === totalPages}
        onClick={() => setLedgerPage(prev => Math.min(totalPages, prev + 1))}
        className="h-10 text-[9px] font-semibold uppercase tracking-normal rounded-xl"
       >
        Next
       </Button>
      </div>
     </div>
    </SheetContent>
   </Sheet>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl bg-white dark:bg-zinc-950 border-l border-border/40 p-0">
                    <div className="p-8 border-b border-border/10">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-2xl font-bold text-foreground tracking-tight">
                                {currentTier.id ? 'Modify Architecture' : 'Define New Strategy'}
                            </SheetTitle>
                            <SheetDescription className="font-bold text-muted-foreground text-xs mt-1">
                                Configure progression thresholds and incentive structures.
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground">Tier Designation</Label>
                                <Input 
                                    value={currentTier.name || ''} 
                                    onChange={e => setCurrentTier(prev => ({...prev, name: e.target.value}))}
                                    className="h-14 rounded-2xl bg-muted border-none font-bold text-foreground" 
                                    placeholder="e.g. Platinum Partner"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground">Entry Threshold (Kuba Points)</Label>
                                <Input 
                                    type="number"
                                    value={currentTier.min_points || 0} 
                                    onChange={e => setCurrentTier(prev => ({...prev, min_points: parseInt(e.target.value)}))}
                                    className="h-14 rounded-2xl bg-muted border-none font-bold text-foreground" 
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground">Core Incentive Portfolio</Label>
                                {(currentTier.benefits || ['']).map((benefit, idx) => (
                                    <Input 
                                        key={idx}
                                        value={benefit} 
                                        onChange={e => {
                                            const newBenefits = [...(currentTier.benefits || [])];
                                            newBenefits[idx] = e.target.value;
                                            setCurrentTier(prev => ({...prev, benefits: newBenefits}));
                                        }}
                                        className="h-14 rounded-2xl bg-muted border-none font-bold text-sm mb-3" 
                                        placeholder="e.g. Priority dispatch & premium support"
                                    />
                                ))}
                                <button 
                                    onClick={() => setCurrentTier(prev => ({...prev, benefits: [...(prev.benefits || []), '']}))}
                                    className="text-xs font-bold text-primary hover:text-black transition-colors mt-2 flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" /> Add Incentive Variable
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-dashed border-border">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-foreground">Operational Status</Label>
                                    <p className="text-[10px] font-bold text-muted-foreground">Toggle visibility across the platform.</p>
                                </div>
                                <Switch 
                                    checked={currentTier.is_active || false} 
                                    onCheckedChange={c => setCurrentTier(prev => ({...prev, is_active: c}))}
                                />
                            </div>

                            <Button 
                                onClick={handleSaveTier} 
                                disabled={isSaving} 
                                className="w-full h-14 bg-primary hover:bg-black text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save reward structure'}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
    );
}
