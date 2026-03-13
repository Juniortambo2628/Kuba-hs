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
      {/* Loyalty Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2 text-glow-red">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Loyalty <span className="text-sky-600">Architect</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Configuring platform reward tiers and tracking point velocity.
            </p>
        </div>
        <Button onClick={() => handleOpenSheet()} className="h-14 bg-[#1E293B] hover:bg-black text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Define New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tiers Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Platform Reward Tiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiers.map((tier) => (
              <Card key={tier.id} className="premium-card group border-none overflow-hidden hover:bg-amber-50/5 transition-all duration-700">
                <CardContent className="p-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors uppercase italic tracking-tight">{tier.name}</h3>
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 font-black text-[8px] uppercase tracking-widest border ${tier.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400"}`}>
                            {tier.is_active ? "Active Status" : "Offline"}
                        </Badge>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] rounded-2xl text-[#1E293B] group-hover:rotate-12 transition-transform shadow-sm">
                        <Gift className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Requirement</p>
                    <p className="text-3xl font-black text-[#1E293B] tracking-tighter">
                        {tier.min_points.toLocaleString()} <span className="text-xs text-gray-300 font-bold uppercase tracking-normal ml-1">Kuba Points</span>
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest mb-4">Elite Benefits</p>
                    {tier.benefits?.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 group/item">
                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-full group-hover/item:scale-150 transition-transform" />
                        <span className="text-xs font-bold text-[#1E293B] italic">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => handleOpenSheet(tier)} variant="outline" className="w-full h-12 border-gray-100 text-[#1E293B] hover:text-sky-600 hover:bg-white hover:border-sky-100 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all">
                    Modify Tier Attributes
                  </Button>
                </CardContent>
              </Card>
            ))}
            {tiers.length === 0 && (
                <Card className="premium-card p-20 flex flex-col items-center justify-center col-span-2 text-gray-200 border-none">
                    <Trophy className="w-16 h-16 mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No rewards defined in the registry</p>
                </Card>
            )}
          </div>
        </div>

        {/* Global Activity Ledger */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Live Point Velocity</h2>
          </div>

          <Card className="premium-card border-none overflow-hidden shadow-premium">
            <Table>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                    <TableCell className="pl-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#1E293B] group-hover:text-sky-600 transition-colors">{t.user?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 italic line-clamp-1">{t.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 py-6 text-right">
                      <div className="space-y-1">
                        <p className={`text-sm font-black tabular-nums ${t.transaction_type === 'earn' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            {t.transaction_type === 'earn' ? '+' : '-'}{t.points}
                        </p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase italic">
                            {new Date(t.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                    <TableRow>
                        <TableCell className="text-center py-20 text-gray-200 italic">
                            <Zap className="h-10 w-10 mx-auto mb-2 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Zero activity detected</p>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="p-8 border-t border-gray-50 bg-gray-50/10 flex justify-center">
                <button 
                  onClick={() => setIsLedgerOpen(true)}
                  className="text-[10px] font-black text-[#1E293B] hover:text-sky-600 transition-all uppercase tracking-widest flex items-center gap-2 group"
                >
                    Full Ledger View
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
          </Card>
        </div>
      </div>

      <Sheet open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-[#F8FAFC]">
          <SheetHeader>
            <SheetTitle className="text-2xl font-black uppercase text-[#1E293B] tracking-tight">Full Transaction Ledger</SheetTitle>
            <SheetDescription className="font-bold text-gray-400 italic text-xs">
              Complete history of all loyalty point movements across the platform.
            </SheetDescription>
          </SheetHeader>
          <div className="py-8 space-y-6">
            <Card className="premium-card border-none overflow-hidden shadow-premium">
              <Table>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                      <TableCell className="pl-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#1E293B]">{t.user?.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 italic line-clamp-1">{t.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="space-y-1">
                          <p className={`text-xs font-black tabular-nums ${t.transaction_type === 'earn' ? 'text-emerald-600' : 'text-sky-600'}`}>
                              {t.transaction_type === 'earn' ? '+' : '-'}{t.points}
                          </p>
                          <p className="text-[8px] font-bold text-gray-300 uppercase italic">
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
                className="h-10 text-[9px] font-black uppercase tracking-widest rounded-xl"
              >
                Previous
              </Button>
              <span className="text-[10px] font-black text-[#1E293B]">Page {ledgerPage} of {totalPages}</span>
              <Button 
                variant="outline" 
                disabled={ledgerPage === totalPages}
                onClick={() => setLedgerPage(prev => Math.min(totalPages, prev + 1))}
                className="h-10 text-[9px] font-black uppercase tracking-widest rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-[#F8FAFC]">
          <SheetHeader>
            <SheetTitle className="text-2xl font-black uppercase text-[#1E293B] tracking-tight">
                {currentTier.id ? 'Modify Tier' : 'Define New Tier'}
            </SheetTitle>
            <SheetDescription className="font-bold text-gray-400 italic text-xs">
                Configure the reward tier attributes and threshold.
            </SheetDescription>
          </SheetHeader>
          <div className="py-8 space-y-6">
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tier Designation</Label>
                <Input 
                    value={currentTier.name || ''} 
                    onChange={e => setCurrentTier(prev => ({...prev, name: e.target.value}))}
                    className="h-14 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-black text-[#1E293B]" 
                    placeholder="e.g. Elite Partner"
                />
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entry Threshold (Points)</Label>
                <Input 
                    type="number"
                    value={currentTier.min_points || 0} 
                    onChange={e => setCurrentTier(prev => ({...prev, min_points: parseInt(e.target.value)}))}
                    className="h-14 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-black text-[#1E293B]" 
                />
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Benefits</Label>
                {(currentTier.benefits || ['']).map((benefit, idx) => (
                    <Input 
                        key={idx}
                        value={benefit} 
                        onChange={e => {
                            const newBenefits = [...(currentTier.benefits || [])];
                            newBenefits[idx] = e.target.value;
                            setCurrentTier(prev => ({...prev, benefits: newBenefits}));
                        }}
                        className="h-14 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-bold text-sm mb-2" 
                        placeholder="e.g. 15% off all services"
                    />
                ))}
                <button 
                    onClick={() => setCurrentTier(prev => ({...prev, benefits: [...(prev.benefits || []), '']}))}
                    className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:text-[#1E293B] transition-colors mt-2 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Benefit
                </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                <div className="space-y-0.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#1E293B]">Active Status</Label>
                    <p className="text-[9px] font-bold text-gray-400 italic">Toggle visibility across the platform.</p>
                </div>
                <Switch 
                    checked={currentTier.is_active || false} 
                    onCheckedChange={c => setCurrentTier(prev => ({...prev, is_active: c}))}
                />
            </div>

            <Button onClick={handleSaveTier} disabled={isSaving} className="w-full h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Tier Configuration'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
