"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Provider } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  MoreVertical,
  Plus,
  Star,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { ProviderCreateFormDialog } from "@/components/admin/ProviderCreateFormDialog";

interface PaginatedProviders {
  data: Provider[];
  meta?: { current_page: number; last_page: number; total: number };
}

function AdminProvidersContent() {
  const { search, page, setPage } = useSearchState();
  const [applicationFilter, setApplicationFilter] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [meta, setMeta] = useState<PaginatedProviders["meta"]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (applicationFilter) params.set("application_status", applicationFilter);
    if (complianceFilter) params.set("compliance_status", complianceFilter);
    params.set("page", String(page));
    return params.toString();
  }, [search, applicationFilter, complianceFilter, page]);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/admin/providers?${buildQuery()}`);
      const payload = res.data;
      setProviders(payload.data ?? []);
      setMeta(payload.meta);
    } catch {
      toast.error("Failed to load providers");
    } finally {
      setIsLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const patchStatus = async (id: string, payload: Record<string, unknown>) => {
    try {
      await axiosInstance.patch(`/api/admin/providers/${id}/status`, payload);
      toast.success("Status updated");
      fetchProviders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/providers/${id}`);
      toast.success("Provider deactivated");
      setDeleteId(null);
      fetchProviders();
    } catch {
      toast.error("Failed to deactivate provider");
    }
  };

  return (
    <DashboardPageContainer width="narrow" className="space-y-10">
      <DashboardPageHeader
        title="Workforce Providers"
        subtitle="Manage provider profiles, verification, compliance, and availability."
      >
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-12 rounded-2xl font-bold px-6 gap-2"
        >
          <Plus className="w-5 h-5" /> Add Provider
        </Button>
      </DashboardPageHeader>

      <div className="flex flex-wrap gap-3">
        <select
          value={applicationFilter}
          onChange={(e) => { setApplicationFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold"
        >
          <option value="">All application statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={complianceFilter}
          onChange={(e) => { setComplianceFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold"
        >
          <option value="">All compliance</option>
          <option value="pending">Pending</option>
          <option value="compliant">Compliant</option>
          <option value="non_compliant">Non-compliant</option>
          <option value="expiring_soon">Expiring soon</option>
        </select>
      </div>

      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search providers"
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === "list" ? (
        <DashboardDataCard variant="base">
            <Table>
              <TableHeader>
                <DashboardTableHeaderRow>
                  <DashboardTableHead position="first" className="!pl-6">Provider</DashboardTableHead>
                  <DashboardTableHead>Application</DashboardTableHead>
                  <DashboardTableHead>Compliance</DashboardTableHead>
                  <DashboardTableHead>Rating</DashboardTableHead>
                  <DashboardTableHead>Bookings</DashboardTableHead>
                  <DashboardTableHead position="last" className="text-right">Actions</DashboardTableHead>
                </DashboardTableHeaderRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No providers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  providers.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/40">
                      <TableCell className="pl-6">
                        <div>
                          <p className="font-semibold text-foreground">{p.business_name}</p>
                          <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.application_status || "pending"} type="dashboard" />
                      </TableCell>
                      <TableCell>
<StatusBadge status={p.compliance_status || "pending"} type="compliance" />
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm font-bold">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {(p.rating ?? 0).toFixed(1)} ({p.review_count ?? 0})
                        </span>
                      </TableCell>
                      <TableCell className="font-bold tabular-nums">{p.bookings_count ?? 0}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/providers/${p.id}`}>View & edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => patchStatus(p.id, { application_status: "active", is_verified: true })}>
                              Mark active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => patchStatus(p.id, { application_status: "suspended" })}>
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(p.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <Card key={p.id} className="border border-border">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <StatusBadge status={p.application_status || "pending"} type="dashboard" />
                </div>
                <div>
                  <h3 className="font-bold">{p.business_name}</h3>
                  <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                </div>
                <StatusBadge status={p.compliance_status || "pending"} type="compliance" />
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href={`/admin/providers/${p.id}`}>
                    Manage <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Page {meta.current_page} of {meta.last_page} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ProviderCreateFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchProviders}
      />

      <AppConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeactivate(deleteId)}
        title="Deactivate provider?"
        description="This suspends the provider account and sets availability to offline. Bookings history is preserved."
        confirmLabel="Deactivate"
      />
    </DashboardPageContainer>
  );
}

export default function AdminProvidersPage() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <AdminProvidersContent />
    </Suspense>
  );
}
