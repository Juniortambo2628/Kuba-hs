"use client";

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
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { CustomQuote } from "@/types";
import { toast } from "sonner";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  useEffect(() => { fetchQuotes(); }, []);

  const fetchQuotes = async () => {
    try { 
      const { data } = await axiosInstance.get("/api/admin/quotes"); 
      setQuotes(data.data || data); 
    }
    catch (error) { 
      console.error("Failed to fetch quotes", error); 
      toast.error("Failed to load quote requests.");
    }
    finally { setIsLoading(false); }
  };

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

  return (
    <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-500 pb-12">
      <DashboardPageHeader 
          title="Enterprise Pipeline" 
          subtitle="Manage high-volume service inquiries from commercial entities, cooperatives, and institutional partners."
      />

      <DataToolbar 
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by organization, contact or email..."
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === 'list' ? (
        <Card className="border border-border overflow-hidden bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold text-muted-foreground pl-10 h-16">Organization</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground h-16">Contact Details</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground h-16">Service Goal</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground h-16">Status</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground pr-10 text-right h-16">Action</TableHead>
                </TableRow>
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
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{quote.organization_type}</p>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600">
                                <XCircle className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Purge Enterprise Inquiry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the inquiry from <span className="font-bold text-foreground">{quote.organization_name}</span>? This action will remove the lead from the enterprise pipeline permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest text-foreground">Abort</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteQuote(quote.id)}
                                  className="rounded-xl font-bold text-xs uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-none shadow-md"
                                >
                                  Confirm Purge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)
          ) : filteredQuotes.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-muted/30 rounded-xl border border-dashed border-border">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No enterprise inquiries found.</p>
            </div>
          ) : filteredQuotes.map((quote) => (
            <Card key={quote.id} className="border border-border relative group bg-card hover:shadow-md transition-all">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600">
                          <XCircle className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Execute Deletion Protocol?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirming this will purge the inquiry from <span className="font-bold text-foreground">{quote.organization_name}</span>. This is an irreversible removal from the Kuba enterprise registry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest text-foreground">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteQuote(quote.id)}
                            className="rounded-xl font-bold text-xs uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-none shadow-md"
                          >
                            Purge Asset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
    </div>
  );
}
