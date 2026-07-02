"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit, ShieldCheck, Globe } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { Switch } from "@/components/ui/switch";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";

interface TrustPartner {
    id: string;
    name: string;
    logo_path: string;
    is_active: boolean;
}

export default function TrustPartnersPage() {
    const { data: partners, isLoading, refetch: fetchPartners } = useData<TrustPartner[]>("/api/admin/trust-partners", { initialData: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<TrustPartner | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', logo_path: '', is_active: true });
    const [deleteTarget, setDeleteTarget] = useState<TrustPartner | null>(null);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (selectedPartner) {
                await axiosInstance.put(`/api/admin/trust-partners/${selectedPartner.id}`, form);
                toast.success("Partner updated");
            } else {
                await axiosInstance.post("/api/admin/trust-partners", form);
                toast.success("Partner added");
            }
            fetchPartners();
            setIsOpen(false);
            setForm({ name: '', logo_path: '', is_active: true });
            setSelectedPartner(null);
        } catch (err: any) { toast.error(handleApiError(err)); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { 
            await axiosInstance.delete(`/api/admin/trust-partners/${id}`); 
            toast.success("Partner removed"); 
            fetchPartners(); 
        } catch (err: any) { toast.error(handleApiError(err)); }
    };

    const openEdit = (partner: TrustPartner) => { 
        setSelectedPartner(partner); 
        setForm({ name: partner.name, logo_path: partner.logo_path, is_active: partner.is_active }); 
        setIsOpen(true); 
    };

    if (isLoading) {
        return <DashboardPageSkeleton width="narrow" metrics={0} bodyHeight="h-64" />;
    }

    return (
        <DashboardPageContainer width="narrow" className="space-y-10">
            <DashboardPageHeader 
                title="Trust Ecosystem" 
                subtitle="Manage brand logos and corporate partners displayed on the landing page."
            >
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => { setSelectedPartner(null); setForm({ name: '', logo_path: '', is_active: true }); }} 
                            className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Add Partner
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {selectedPartner ? "Edit Partner" : "New Partner"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground">Partner Name</Label>
                                <Input 
                                    value={form.name} 
                                    onChange={(e) => setForm({...form, name: e.target.value})} 
                                    placeholder="e.g. Safaricom"
                                    className="h-12 bg-muted border-none rounded-xl font-bold" 
                                />
                            </div>
                            <DashboardImageUpload 
                                value={form.logo_path}
                                onChange={(url) => setForm({...form, logo_path: url})}
                                type="logo"
                                label="Partner Brand Logo"
                            />
                            <p className="text-[10px] text-muted-foreground ml-1">Upload a high-quality PNG or SVG with transparency if possible.</p>
                            <div className="flex items-center justify-between py-2">
                                <Label className="text-xs font-bold text-muted-foreground">Visibility Status</Label>
                                <Switch 
                                    checked={form.is_active} 
                                    onCheckedChange={(val) => setForm({...form, is_active: val})} 
                                />
                            </div>
                            <Button 
                                onClick={handleSave} 
                                disabled={isSubmitting || !form.name || !form.logo_path} 
                                className="w-full h-12 bg-primary hover:bg-black text-white font-bold rounded-xl mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Partner"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </DashboardPageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                    <Card key={partner.id} className="border-none bg-card/50 backdrop-blur-md shadow-sm rounded-[2rem] overflow-hidden group">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center justify-between">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${partner.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {partner.is_active ? 'Active' : 'Hidden'}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(partner)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => setDeleteTarget(partner)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 flex flex-col items-center gap-4">
                            <div className="w-full h-24 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/5 relative group-hover:bg-white/10 transition-colors">
                                {partner.logo_path ? (
                                    <img 
                                        src={partner.logo_path.startsWith('http') ? partner.logo_path : partner.logo_path} 
                                        alt={partner.name} 
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                ) : (
                                    <Globe className="w-10 h-10 text-muted-foreground/20" />
                                )}
                            </div>
                            <h3 className="text-base font-bold text-foreground">{partner.name}</h3>
                        </CardContent>
                    </Card>
                ))}

                {partners.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-card/30 rounded-[2rem] border-2 border-dashed border-border/50">
                        <ShieldCheck className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No partners registered yet.</p>
                    </div>
                )}
            </div>
            <AppConfirmDialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
                onConfirm={async () => { if (deleteTarget) { await handleDelete(deleteTarget.id); setDeleteTarget(null); } }}
                title="Remove Partner?"
                description={<>Are you sure you want to delete <span className="font-bold text-foreground">{deleteTarget?.name}</span>? This will hide them from the landing page.</>}
            />
        </DashboardPageContainer>
    );
}
