"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApiData } from "@/hooks/useApiData";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ShieldCheck,
  AlertTriangle,
  FileBadge,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  RefreshCw,
  X,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getMediaUrl, cn } from "@/lib/utils";

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "expiring_soon" | "non_compliant">("all");
  
  const { data: overview, isLoading: loadingOverview, refetch: refetchOverview } = useApiData<any>('/api/admin/compliance/overview');
  
  const { data: providersResponse, isLoading: loadingProviders, refetch: refetchProviders } = useApiData<any>(
    `/api/admin/compliance/providers${activeTab !== 'all' ? `?status=${activeTab}` : ''}`
  );

  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const { data: documentsResponse, isLoading: loadingDocs, refetch: refetchDocs } = useApiData<any>(
    selectedProvider ? `/api/admin/compliance/providers/${selectedProvider.id}/documents` : ''
  );

  const [reviewingDoc, setReviewingDoc] = useState<any | null>(null);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = overview?.data || {
    pending_document_reviews: 0,
    providers_expiring_soon: 0,
    providers_non_compliant: 0,
    providers_compliant: 0,
    providers_pending: 0,
  };

  const providers = providersResponse?.data?.data || [];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingDoc || !reviewAction) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/api/admin/compliance/documents/${reviewingDoc.id}/review`, {
        status: reviewAction,
        rejection_reason: reviewAction === 'rejected' ? rejectionReason : null,
        expires_at: expiresAt || null
      });
      
      toast.success(`Document ${reviewAction} successfully`);
      setReviewingDoc(null);
      setReviewAction(null);
      setRejectionReason("");
      setExpiresAt("");
      
      refetchDocs();
      refetchProviders();
      refetchOverview();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Compliant</span>;
      case 'non_compliant':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">Non-Compliant</span>;
      case 'expiring_soon':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">Expiring Soon</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">Pending Review</span>;
    }
  };

  const getDocStatusBadge = (doc: any) => {
    if (doc.is_expired) {
      return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">Expired</span>;
    }
    switch (doc.status) {
      case 'approved':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">Pending</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Compliance & Audits</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage provider verification, documents, and quality scores.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Reviews", value: stats.pending_document_reviews, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Non-Compliant Pros", value: stats.providers_non_compliant, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
          { label: "Expiring Soon", value: stats.providers_expiring_soon, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
          { label: "Compliant Pros", value: stats.providers_compliant, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0B0F19] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{metric.label}</p>
                <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                  {loadingOverview ? <RefreshCw className="w-6 h-6 animate-spin text-gray-300" /> : metric.value}
                </div>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", metric.bg)}>
                <metric.icon className={cn("w-6 h-6", metric.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {[
              { id: "all", label: "All Providers" },
              { id: "pending", label: "Pending" },
              { id: "expiring_soon", label: "Expiring Soon" },
              { id: "non_compliant", label: "Non-Compliant" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search providers..." 
              className="pl-9 bg-white dark:bg-[#0B0F19] border-gray-200 dark:border-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {loadingProviders ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FileBadge className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-semibold">No providers found in this category.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quality Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {providers.map((provider: any) => (
                  <tr key={provider.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 relative overflow-hidden border border-gray-200 dark:border-white/10">
                          {provider.user?.avatar ? (
                            <Image src={getMediaUrl(provider.user.avatar, 'avatar')} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                              {provider.business_name?.substring(0,2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{provider.business_name}</p>
                          <p className="text-xs text-gray-500">{provider.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(provider.compliance_status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              provider.quality_score >= 80 ? "bg-emerald-500" :
                              provider.quality_score >= 50 ? "bg-amber-500" : "bg-rose-500"
                            )}
                            style={{ width: `${Math.max(0, Math.min(100, provider.quality_score))}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                          {Number(provider.quality_score).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <FileBadge className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {provider.total_docs}
                        </span>
                        {provider.pending_docs > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black">
                            {provider.pending_docs}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedProvider(provider)}
                        className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
                      >
                        Audit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Audit Drawer Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSelectedProvider(null); setReviewingDoc(null); }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#0B0F19] z-[101] shadow-2xl border-l border-gray-200 dark:border-white/10 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Compliance Audit</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reviewing {selectedProvider.business_name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedProvider(null); setReviewingDoc(null); }}
                  className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Provider Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <p className="text-xs font-bold text-gray-400 uppercase">Quality Score</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{Number(selectedProvider.quality_score).toFixed(1)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <p className="text-xs font-bold text-gray-400 uppercase">Current Status</p>
                    <div className="mt-2">{getStatusBadge(selectedProvider.compliance_status)}</div>
                  </div>
                </div>

                {/* Documents List */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/5 pb-2">Uploaded Documents</h3>
                  
                  {loadingDocs ? (
                    <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>
                  ) : documentsResponse?.data?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No documents uploaded by this provider yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {documentsResponse?.data?.map((doc: any) => (
                        <div key={doc.id} className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0F19] hover:border-primary/50 transition-colors shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20">
                                <FileBadge className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white capitalize">{doc.document_type.replace('_', ' ')}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  {getDocStatusBadge(doc)}
                                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(doc.created_at), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                
                                {doc.expires_at && (
                                  <p className={cn(
                                    "text-xs font-bold mt-2 flex items-center gap-1",
                                    doc.is_expired ? "text-rose-500" : "text-amber-500"
                                  )}>
                                    <Calendar className="w-3 h-3" />
                                    {doc.is_expired ? "Expired on" : "Expires on"} {format(new Date(doc.expires_at), 'MMM d, yyyy')}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {/* TODO: Implement secure view file */}
                              <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs font-bold w-full bg-white dark:bg-white/5">
                                <Eye className="w-3 h-3 mr-1.5" /> View File
                              </Button>
                              <Button 
                                size="sm" 
                                className="rounded-xl h-8 text-xs font-bold w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                onClick={() => {
                                  setReviewingDoc(doc);
                                  setReviewAction('approved');
                                  setExpiresAt(doc.expires_at ? doc.expires_at.split('T')[0] : "");
                                }}
                              >
                                Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Review Action Modal */}
      <AnimatePresence>
        {reviewingDoc && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
              onClick={() => setReviewingDoc(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/10"
              >
                <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize">Audit {reviewingDoc.document_type.replace('_', ' ')}</h3>
                  <p className="text-sm text-gray-500 mt-1">Determine the compliance status for this document.</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
                  
                  {/* Action Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewAction('approved')}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        reviewAction === 'approved' 
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-500 hover:border-emerald-200"
                      )}
                    >
                      <CheckCircle2 className="w-8 h-8" />
                      <span className="font-bold text-sm">Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewAction('rejected')}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        reviewAction === 'rejected' 
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" 
                          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-500 hover:border-rose-200"
                      )}
                    >
                      <XCircle className="w-8 h-8" />
                      <span className="font-bold text-sm">Reject</span>
                    </button>
                  </div>

                  {reviewAction === 'approved' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Set Expiration Date (Optional)</label>
                      <Input 
                        type="date" 
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-12 rounded-xl px-4"
                      />
                      <p className="text-[10px] text-gray-400">If left empty, this document will never automatically expire.</p>
                    </div>
                  )}

                  {reviewAction === 'rejected' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Rejection Reason Verification</label>
                      <textarea 
                        required
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a clear reason for the provider..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none min-h-[100px]"
                      />
                    </div>
                  )}

                  <div className="pt-4 flex items-center gap-3 border-t border-gray-100 dark:border-white/5">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full rounded-xl h-12 font-bold"
                      onClick={() => setReviewingDoc(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!reviewAction || isSubmitting}
                      className={cn(
                        "w-full rounded-xl h-12 font-bold text-white",
                        reviewAction === 'approved' ? "bg-emerald-500 hover:bg-emerald-600" :
                        reviewAction === 'rejected' ? "bg-rose-500 hover:bg-rose-600" : "bg-primary"
                      )}
                    >
                      {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Confirm Verification"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
