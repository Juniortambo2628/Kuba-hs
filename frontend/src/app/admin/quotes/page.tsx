"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { dashboardUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Building2, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Clock,
  Mail,
  Phone,
  ArrowUpRight,
  FileText,
  Users,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { useSearchState } from "@/hooks/useSearchState";
import { CustomQuote } from "@/types";
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { toast } from "sonner";

export default function AdminQuotesPage() {
  const { search: searchTerm } = useSearchState();
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const { data: quotesData, isLoading, refetch: fetchQuotes } = useApiData<any>("/api/admin/quotes", { initialData: null });
  const quotes = (quotesData?.data || quotesData || []) as CustomQuote[];

  const updateStatus = async (id: string, status: string) => {
    try { 
      await axiosInstance.patch(`/api/admin/quotes/${id}/status`, { status }); 
      toast.success(`Status updated to ${status}`);
      fetchQuotes(); 
    }
    catch (error) { 
      console.error("Failed to update status", error); 
      toast.error("Failed to update status.");
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/quotes/${id}`);
      toast.success("Request deleted successfully");
      fetchQuotes();
    } catch (error) {
      toast.error("Failed to delete request.");
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOriginIcon = (type: string) => {
    switch (type) {
      case 'commercial': return <Briefcase className="w-4 h-4" />;
      case 'cooperative': return <Users className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const pendingCount = quotes.filter((q) => q.status === "pending").length;

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Commercial & cooperative quotes"
        subtitle="RFP-style requests from commercial, cooperative, and institutional pages."
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={Building2}
          label="Total requests"
          value={isLoading ? "—" : quotes.length}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={Clock}
          label="Pending"
          value={isLoading ? "—" : pendingCount}
          tone={pendingCount > 0 ? "warning" : "neutral"}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={CheckCircle}
          label="Contracted"
          value={isLoading ? "—" : quotes.filter((q) => q.status === "contracted").length}
          tone="success"
          isLoading={isLoading}
        />
      </DashboardFrostedStatGrid>

      {searchTerm && (
        <p className="text-xs text-muted-foreground">Results for &quot;{searchTerm}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search quotes"
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === 'list' ? (
        <DashboardDataCard>
            <Table>
              <TableHeader>
                <DashboardTableHeaderRow>
                  <DashboardTableHead position="first" className="!pl-10 h-16">Organization</DashboardTableHead>
                  <DashboardTableHead className="h-16">Contact Details</DashboardTableHead>
                  <DashboardTableHead className="h-16">Service Goal</DashboardTableHead>
                  <DashboardTableHead className="h-16">Status</DashboardTableHead>
                  <DashboardTableHead position="last" className="h-16">Action</DashboardTableHead>
                </DashboardTableHeaderRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="pl-6"><div className="flex items-center gap-3"><Skeleton className="w-9 h-9 rounded-lg" /><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-sm">No enterprise inquiries found.</TableCell>
                  </TableRow>
                ) : filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="group border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-primary border border-border">
                          {getOriginIcon(quote.organization_type)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{quote.organization_name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                            {quote.organization_type}
                            {quote.source ? ` · ${quote.source.replace(/_/g, " ")}` : ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold">{quote.contact_person}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {quote.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                       <p className="text-xs font-medium text-foreground max-w-[200px] truncate">{quote.service_category}</p>
                       <p className="text-[10px] text-muted-foreground">{new Date(quote.created_at).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                       <DashboardStatusBadge status={quote.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem onClick={() => updateStatus(quote.id, 'reviewed')} className="cursor-pointer text-xs font-medium">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" /> Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(quote.id, 'contacted')} className="cursor-pointer text-xs font-medium">
                            <Phone className="w-4 h-4 mr-2 text-indigo-500" /> Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(quote.id, 'contracted')} className="cursor-pointer text-xs font-medium text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" /> Contract
                          </DropdownMenuItem>
                          <ConfirmDeleteDialog
                            trigger={
                                <button className="w-full text-left px-2 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 flex items-center rounded-md">
                                    <XCircle className="w-4 h-4" /> Delete Request
                                </button>
                            }
                            title="Delete this quote request?"
                            description={`Permanently remove the request from ${quote.organization_name}.`}
                            onConfirm={() => deleteQuote(quote.id)}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)
          ) : filteredQuotes.length === 0 ? (
            <div className={cn("col-span-full py-16 text-center", dashboardUi.table.emptyDashed)}>
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-[10px] font-bold tracking-normal text-muted-foreground">No enterprise inquiries found.</p>
            </div>
          ) : filteredQuotes.map((quote) => (
            <Card key={quote.id} className="border border-border bg-card/50 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden border-none text-left">
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => updateStatus(quote.id, 'reviewed')} className="cursor-pointer text-xs font-medium">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" /> Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(quote.id, 'contacted')} className="cursor-pointer text-xs font-medium">
                      <Phone className="w-4 h-4 mr-2 text-indigo-500" /> Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(quote.id, 'contracted')} className="cursor-pointer text-xs font-medium text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Contract
                    </DropdownMenuItem>
                    <ConfirmDeleteDialog
                      trigger={
                          <button className="w-full text-left px-2 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 flex items-center rounded-md">
                              <XCircle className="w-4 h-4" /> Delete Request
                          </button>
                      }
                      title="Delete this quote request?"
                      description={`Permanently remove the request from ${quote.organization_name}.`}
                      onConfirm={() => deleteQuote(quote.id)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardContent className="p-5 pt-4">
                <div className="flex items-center gap-3 mb-4 pr-8">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary border border-border">
                    {getOriginIcon(quote.organization_type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{quote.organization_name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] h-4 py-0 font-bold uppercase tracking-tight">{quote.organization_type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{new Date(quote.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-3 bg-muted/50 rounded-xl border border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Contact Person</p>
                    <p className="text-sm font-semibold">{quote.contact_person}</p>
                    <div className="flex items-center gap-3 mt-1 underline-offset-2">
                       <a href={`mailto:${quote.email}`} className="text-[10px] text-primary flex items-center gap-1 hover:underline"><Mail className="w-3 h-3" /> Email</a>
                       {quote.phone && <a href={`tel:${quote.phone}`} className="text-[10px] text-primary flex items-center gap-1 hover:underline"><Phone className="w-3 h-3" /> Call</a>}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Inquiry Description</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-lg italic">
                    "{quote.description}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-foreground">Active Lead</span>
                   </div>
                  <DashboardStatusBadge status={quote.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPageContainer>
  );
}
