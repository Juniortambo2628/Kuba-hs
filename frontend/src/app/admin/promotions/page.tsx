"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";

import { useState } from "react";
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Percent, 
  DollarSign, 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  TrendingUp,
  Users
} from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

interface PromoCode {
    id: number;
    code: string;
    discount_type: 'fixed' | 'percentage';
    discount_value: number;
    min_booking_amount: number | null;
    max_discount_amount: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    created_at: string;
}

export default function PromotionsPage() {
    const { data: promoData, isLoading, refetch } = useApiData<{data: PromoCode[]}>("/api/admin/promo-codes", { initialData: { data: [] } });
    const promoCodes = promoData?.data || [];
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentCode, setCurrentCode] = useState<Partial<PromoCode>>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const filtered = promoCodes.filter(p => 
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenSheet = (code?: PromoCode) => {
        if (code) {
            setCurrentCode({
                ...code,
                start_date: code.start_date.split('T')[0],
                end_date: code.end_date.split('T')[0]
            });
        } else {
            setCurrentCode({
                code: '',
                discount_type: 'percentage',
                discount_value: 0,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                is_active: true
            });
        }
        setIsSheetOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (currentCode.id) {
                await axiosInstance.put(`/api/admin/promo-codes/${currentCode.id}`, currentCode);
                toast.success("Voucher architecture updated");
            } else {
                await axiosInstance.post("/api/admin/promo-codes", currentCode);
                toast.success("Growth campaign initialized");
            }
            setIsSheetOpen(false);
            refetch();
        } catch (err) {
            toast.error("Campaign registration failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axiosInstance.delete(`/api/admin/promo-codes/${deleteId}`);
            toast.success("Campaign archived");
            refetch();
        } catch (err) {
            toast.error("Deletion failed");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            await axiosInstance.patch(`/api/admin/promo-codes/${id}/toggle-status`);
            toast.success("Signal updated");
            refetch();
        } catch (err) {
            toast.error("Status toggle failed");
        }
    };

    return (
        <DashboardPageContainer className="space-y-10">
            <DashboardPageHeader 
                title="Growth & Promotions" 
                subtitle="Engine for marketplace expansion, seasonal vouchers, and acquisition campaigns."
            >
                <Button 
                    onClick={() => handleOpenSheet()}
                    className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-lg shadow-primary/20 flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Campaign
                </Button>
            </DashboardPageHeader>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Active Campaigns", value: promoCodes.filter(p => p.is_active).length, icon: Zap, color: "text-amber-600 bg-amber-50" },
                    { label: "Total Usage", value: promoCodes.reduce((acc, p) => acc + p.used_count, 0), icon: TrendingUp, color: "text-primary bg-primary/10" },
                    { label: "Unique Vouchers", value: promoCodes.length, icon: Ticket, color: "text-blue-600 bg-blue-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-card/60 backdrop-blur-sm shadow-sm rounded-3xl">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-black text-foreground mt-2">{stat.value}</p>
                            </div>
                            <div className={cn("p-4 rounded-2xl", stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Find campaign by code..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 pl-12 bg-card/50 border-none rounded-2xl shadow-sm font-bold text-xs"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((promo) => (
                        <Card key={promo.id} className="group relative overflow-hidden border-none bg-card/40 backdrop-blur-md shadow-sm rounded-3xl hover:bg-card/60 transition-all duration-500">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-sm">
                                        {promo.discount_type === 'percentage' ? <Percent className="w-6 h-6" /> : <DollarSign className="w-6 h-6" />}
                                    </div>
                                    <Switch 
                                        checked={promo.is_active} 
                                        onCheckedChange={() => toggleStatus(promo.id)}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-foreground tracking-tight uppercase group-hover:text-primary transition-colors">{promo.code}</h3>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                        {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `$${promo.discount_value} FLAT DISCOUNT`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Velocity</p>
                                        <p className="text-sm font-black text-foreground">{promo.used_count} <span className="text-[10px] text-muted-foreground">claimed</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Cap</p>
                                        <p className="text-sm font-black text-foreground">{promo.usage_limit || '∞'} <span className="text-[10px] text-muted-foreground">max</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase">{new Date(promo.end_date).toLocaleDateString()} expiry</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleOpenSheet(promo)}
                                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setDeleteId(promo.id)}
                                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filtered.length === 0 && !isLoading && (
                        <div className="col-span-full py-32 text-center space-y-4 bg-muted/20 rounded-[3rem] border-4 border-dashed border-border/40">
                            <Ticket className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                            <div className="space-y-1">
                                <h4 className="text-xl font-black italic text-foreground/20 uppercase tracking-tighter">Campaign Void</h4>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Signal detected: No active vouchers found</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl bg-white dark:bg-[#0B0F19] border-l border-border/40 p-0 overflow-y-auto kuba-scroll">
                    <div className="p-10 border-b border-border/10 space-y-2">
                        <SheetTitle className="text-3xl font-black text-foreground tracking-tighter uppercase italic">
                            {currentCode.id ? 'Refine Strategy' : 'Initialize Campaign'}
                        </SheetTitle>
                        <SheetDescription className="font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
                            Define high-velocity growth signals and acquisition logic.
                        </SheetDescription>
                    </div>

                    <div className="p-10 space-y-10">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Promotion Code</Label>
                            <Input 
                                value={currentCode.code || ''} 
                                onChange={e => setCurrentCode(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                                placeholder="E.G. KUBAWELCOME2026"
                                className="h-16 rounded-2xl bg-muted border-none font-black text-lg text-primary uppercase placeholder:text-muted-foreground/30"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Logic Model</Label>
                                <Select 
                                    value={currentCode.discount_type} 
                                    onValueChange={(v: any) => setCurrentCode(prev => ({...prev, discount_type: v}))}
                                >
                                    <SelectTrigger className="h-16 rounded-2xl bg-muted border-none font-bold">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border bg-card">
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Yield Value</Label>
                                <Input 
                                    type="number"
                                    value={currentCode.discount_value || 0} 
                                    onChange={e => setCurrentCode(prev => ({...prev, discount_value: parseFloat(e.target.value)}))}
                                    className="h-16 rounded-2xl bg-muted border-none font-black text-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Activation Signal</Label>
                                <Input 
                                    type="date"
                                    value={currentCode.start_date || ''} 
                                    onChange={e => setCurrentCode(prev => ({...prev, start_date: e.target.value}))}
                                    className="h-16 rounded-2xl bg-muted border-none font-bold text-xs"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Termination Signal</Label>
                                <Input 
                                    type="date"
                                    value={currentCode.end_date || ''} 
                                    onChange={e => setCurrentCode(prev => ({...prev, end_date: e.target.value}))}
                                    className="h-16 rounded-2xl bg-muted border-none font-bold text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Volume Constraints</Label>
                            <Input 
                                type="number"
                                value={currentCode.usage_limit || ''} 
                                onChange={e => setCurrentCode(prev => ({...prev, usage_limit: parseInt(e.target.value)}))}
                                placeholder="Infinite usage if left empty"
                                className="h-16 rounded-2xl bg-muted border-none font-bold text-sm"
                            />
                        </div>

                        <div className="p-8 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight">Financial Safeguards</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground opacity-60">Apply strict boundary conditions.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Min. Cart Volume</Label>
                                    <Input 
                                        type="number"
                                        value={currentCode.min_booking_amount || ''} 
                                        onChange={e => setCurrentCode(prev => ({...prev, min_booking_amount: parseFloat(e.target.value)}))}
                                        className="h-12 rounded-xl bg-card border-none font-bold text-xs shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Max. Savings Clip</Label>
                                    <Input 
                                        type="number"
                                        value={currentCode.max_discount_amount || ''} 
                                        onChange={e => setCurrentCode(prev => ({...prev, max_discount_amount: parseFloat(e.target.value)}))}
                                        className="h-12 rounded-xl bg-card border-none font-bold text-xs shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="w-full h-16 bg-primary hover:bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : currentCode.id ? 'Synchronize Updates' : 'Launch Campaign'}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <ConfirmDeleteDialog 
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Archive Campaign signal?"
                description="This will permanently nullify the voucher logic and prevent further usage. All historical records will remain intact."
            />
        </DashboardPageContainer>
    );
}
