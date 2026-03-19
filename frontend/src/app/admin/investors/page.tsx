"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Briefcase, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Clock,
  Mail,
  Building2,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DataToolbar } from "@/components/shared/DataToolbar";
import { InvestorInquiry } from "@/types";

export default function AdminInvestorsPage() {
  const [inquiries, setInquiries] = useState<InvestorInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try { const { data } = await axiosInstance.get("/api/admin/investors"); setInquiries(data); }
    catch (error) { console.error("Failed to fetch inquiries", error); }
    finally { setIsLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try { await axiosInstance.patch(`/api/admin/investors/${id}/status`, { status }); fetchInquiries(); }
    catch (error) { console.error("Failed to update status", error); }
  };

  const filteredInquiries = inquiries.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-muted text-foreground border-border",
      reviewed: "bg-muted text-foreground border-border",
      contacted: "bg-muted text-foreground border-border",
      rejected: "bg-muted text-foreground border-border",
    };
    return (
      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${styles[status] || ""}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Investor Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage potential investment outreach and lead status.</p>
        </div>
      </div>

      <DataToolbar 
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, email or company..."
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Content area: Grid or List */}
      {viewMode === 'list' ? (
        <Card className="border border-border overflow-hidden bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="pl-6 uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Investor</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Details</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Status</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Date</TableHead>
                  <TableHead className="pr-6 text-right uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="pl-6"><div className="flex items-center gap-3"><Skeleton className="w-9 h-9 rounded-lg" /><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-18 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-sm">No investor inquiries found.</TableCell>
                  </TableRow>
                ) : filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className="group border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-primary font-semibold text-xs uppercase overflow-hidden border border-border">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{inquiry.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> {inquiry.company || 'N/A'}</p>
                        <p className="text-xs font-semibold text-primary flex items-center gap-1"><DollarSign className="w-3 h-3" /> {inquiry.investment_range || 'General'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inquiry.status)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'reviewed')} className="cursor-pointer text-xs font-medium">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" /> Mark Reviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'contacted')} className="cursor-pointer text-xs font-medium">
                            <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" /> Mark Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'rejected')} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50">
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </DropdownMenuItem>
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
            [1,2,3].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)
          ) : filteredInquiries.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-muted/30 rounded-xl border border-dashed border-border">
              <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No investor inquiries found.</p>
            </div>
          ) : filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="border border-border relative group bg-card hover:shadow-md transition-all">
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'reviewed')} className="cursor-pointer text-xs font-medium">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" /> Mark Reviewed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'contacted')} className="cursor-pointer text-xs font-medium">
                      <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" /> Mark Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'rejected')} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardContent className="p-5 pt-4">
                <div className="flex items-center gap-3 mb-4 pr-8">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary border border-border">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{inquiry.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {inquiry.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Company</span>
                    <span className="text-xs font-medium text-foreground">{inquiry.company || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Range</span>
                    <span className="text-xs font-medium text-primary">{inquiry.investment_range || 'General'}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  "{inquiry.message}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                  {getStatusBadge(inquiry.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
