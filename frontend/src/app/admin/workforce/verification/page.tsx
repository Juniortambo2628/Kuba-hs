"use client";

import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Clock, 
  FileText,
  Filter,
  Search,
  Loader2,
  ShieldCheck,
  Building2,
  User,
  MoreHorizontal
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { toast } from "sonner";
import { useApiData } from "@/hooks/useApiData";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function AdminVerificationContent() {
  const { data: proposals, isLoading, refetch: fetchProposals } = useApiData<any[]>("/api/admin/workforce/verification", { initialData: [] });
  const [search, setSearch] = useState("");
  const [rejectionData, setRejectionData] = useState<{ id: number, reason: string } | null>(null);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', reason?: string) => {
    try {
      await axiosInstance.patch(`/api/admin/workforce/verification/${id}`, {
        status,
        rejection_reason: reason
      });
      toast.success(`Document ${status} successfully`);
      fetchProposals();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = proposals.filter(p => 
    p.provider?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.document_type?.toLowerCase().includes(search.toLowerCase())
  );

  const getPublicUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <DashboardPageHeader 
        title="Workforce Integrity" 
        subtitle="Review and validate provider credentials to maintain platform excellence."
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by merchant or doc type..." 
            className="pl-12 h-10 rounded-xl bg-card border-border shadow-sm text-xs font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-border bg-card text-[10px] uppercase font-bold tracking-widest text-muted-foreground gap-2">
                <Filter className="w-3.5 h-3.5" /> Pending Reviews: {proposals.filter(p => p.status === 'pending').length}
            </Badge>
        </div>
      </div>

      <Card className="border border-border overflow-hidden bg-card/50 backdrop-blur-md shadow-sm rounded-3xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border bg-muted/20">
                <TableHead className="pl-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Merchant Identity</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Class</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submission Date</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Status</TableHead>
                <TableHead className="pr-8 text-right h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest py-20 italic opacity-40">
                    No pending verification requests.
                  </TableCell>
                </TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id} className="group border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary border border-border">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">{p.provider?.business_name || 'Individual Pro'}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[180px]">{p.provider?.user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground capitalize">{p.document_type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(p.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {p.status === 'approved' && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest px-2.5 py-1">Verified</Badge>}
                        {p.status === 'rejected' && <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 rounded-lg text-[9px] font-black uppercase tracking-widest px-2.5 py-1">Declined</Badge>}
                        {p.status === 'pending' && <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 rounded-lg text-[9px] font-black uppercase tracking-widest px-2.5 py-1">Pending Review</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <a 
                          href={getPublicUrl(p.file_path)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all border border-transparent hover:border-primary/20"
                          title="View Document"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        
                        {p.status === 'pending' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
                              <DropdownMenuLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest p-2">Review Action</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateStatus(p.id, 'approved')} className="rounded-lg focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer py-2.5 font-bold text-xs gap-3">
                                <CheckCircle2 className="w-4 h-4" /> Approve Credential
                              </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => setRejectionData({ id: p.id, reason: "" })} className="rounded-lg focus:bg-red-50 focus:text-red-600 cursor-pointer py-2.5 font-bold text-xs gap-3">
                                <XCircle className="w-4 h-4" /> Decline & Notify
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
              <h3 className="font-black text-foreground tracking-tight text-lg italic">Platform Governance</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Approval of documents automates provider activation. If <strong>ID</strong> and <strong>License</strong> are both verified, the provider profile is automatically promoted to "Verified" status on the storefront.
              </p>
           </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={!!rejectionData} onOpenChange={(open) => !open && setRejectionData(null)}>
        <DialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic tracking-tight uppercase">Credential Rejection</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cause for Declining Verification</Label>
              <textarea 
                className="w-full min-h-[100px] p-4 rounded-xl bg-muted/50 border border-border font-medium text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                placeholder="Explain the document discrepancy..."
                value={rejectionData?.reason || ""}
                onChange={(e) => setRejectionData(prev => prev ? { ...prev, reason: e.target.value } : null)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold px-1 leading-relaxed italic border-l-2 border-primary/20 pl-4">
              Providing a clear reason helps the merchant correct their compliance status faster.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest" onClick={() => setRejectionData(null)}>Abort</Button>
            <Button 
                className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-100" 
                onClick={() => {
                    if (rejectionData) {
                        handleUpdateStatus(rejectionData.id, 'rejected', rejectionData.reason);
                        setRejectionData(null);
                    }
                }}
                disabled={!rejectionData?.reason}
            >
                Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminVerification() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <AdminVerificationContent />
    </Suspense>
  );
}
