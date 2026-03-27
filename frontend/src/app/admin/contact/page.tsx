"use client";

import { useEffect, useState, Suspense } from "react";
import { ContactMessage } from "@/types";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreHorizontal, 
  Mail,
  Trash2,
  Eye,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function AdminContactContent() {
  const { search, setSearch } = useSearchState();
  const { data: messagesData, isLoading, refetch: fetchMessages } = useApiData<any>(`/api/admin/contact?search=${search}`, { initialData: null });
  const messages = (messagesData?.data || []) as ContactMessage[];
  const [statusUpdate, setStatusUpdate] = useState<{ id: string | number, status: string } | null>(null);
  
  // Define default values
  const viewMode = 'list';


  const updateStatus = async (id: string | number, status: string) => {
    try {
        await axiosInstance.patch(`/api/admin/contact/${id}/status`, { status });
        toast.success(`Message marked as ${status}`);
        fetchMessages();
    } catch (err) {
        toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id: string | number) => {
    try {
        await axiosInstance.delete(`/api/admin/contact/${id}`);
        toast.success("Message deleted successfully");
        fetchMessages();
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete message");
    }
  };

  const markAsRead = async (msg: ContactMessage) => {
    if (msg.status === 'new') {
      try {
        await axiosInstance.get(`/api/admin/contact/${msg.id}`);
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <DashboardPageHeader 
        title="Contact Messages" 
        subtitle="Review and manage inquiries directly from the landing page contact form."
      />

      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        viewMode={viewMode}
        onViewChange={() => {}}
      />

      <Card className="border border-border overflow-hidden bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-10 h-16 text-[11px] font-bold text-muted-foreground">Sender</TableHead>
                <TableHead className="h-16 text-[11px] font-bold text-muted-foreground">Subject</TableHead>
                <TableHead className="h-16 text-[11px] font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="h-16 text-[11px] font-bold text-muted-foreground">Date Received</TableHead>
                <TableHead className="pr-10 text-right h-16 text-[11px] font-bold text-muted-foreground">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="pl-6"><Skeleton className="h-10 w-48 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-18 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <DashboardEmptyState 
                      title="No messages found" 
                      description="You do not have any new inquiries."
                    />
                  </TableCell>
                </TableRow>
              ) : messages.map((m) => (
                <TableRow key={m.id} className={`group border-border hover:bg-muted/50 transition-colors ${m.status === 'new' ? 'bg-blue-50/10' : ''}`}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs overflow-hidden border shadow-sm ${m.status === 'new' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-muted text-primary border-border'}`}>
                        {m.name[0]}
                      </div>
                      <div>
                        <p className={`text-sm tracking-tight transition-colors ${m.status === 'new' ? 'font-bold text-blue-900 dark:text-blue-100' : 'font-semibold text-foreground group-hover:text-primary'}`}>
                          {m.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm truncate max-w-[200px]">{m.subject}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{m.message}</p>
                  </TableCell>
                  <TableCell>
                    <DashboardStatusBadge 
                        status={m.status === 'new' ? 'Pending' : m.status === 'read' ? 'Reviewed' : 'Completed'} 
                    />
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu onOpenChange={(open) => {
                       if (open) markAsRead(m);
                    }}>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl">
                        <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground tracking-tight">Message Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusUpdate({ id: m.id, status: 'read'})} className="cursor-pointer text-xs font-medium text-foreground gap-2">
                           <Eye className="w-3.5 h-3.5" /> Mark as Read
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setStatusUpdate({ id: m.id, status: 'replied'})} className="cursor-pointer text-xs font-medium text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 gap-2">
                           <CheckCircle className="w-3.5 h-3.5" /> Mark as Replied
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = `mailto:${m.email}?subject=RE: ${m.subject}`} className="cursor-pointer text-xs font-medium text-blue-600 focus:text-blue-700 focus:bg-blue-50 gap-2">
                           <MessageSquare className="w-3.5 h-3.5" /> Reply to Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmDeleteDialog
                            trigger={
                                <button className="w-full text-left px-2 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 flex items-center rounded-md">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Message
                                </button>
                            }
                            title="Purge Message?"
                            description="This action will permanently delete this contact inquiry. This cannot be undone."
                            onConfirm={() => deleteMessage(m.id)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/* Status Update Confirmation */}
      <AlertDialog open={!!statusUpdate} onOpenChange={(open) => !open && setStatusUpdate(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic tracking-tight">Update Status?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              Are you sure you want to mark this message as {statusUpdate?.status}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 pt-4">
            <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction 
                className="rounded-xl font-bold text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md"
                onClick={() => {
                    if (statusUpdate) {
                        updateStatus(statusUpdate.id, statusUpdate.status);
                        setStatusUpdate(null);
                    }
                }}
            >
                Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminContact() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-8"><Skeleton className="h-[600px] w-full rounded-2xl" /></div>}>
      <AdminContactContent />
    </Suspense>
  );
}
