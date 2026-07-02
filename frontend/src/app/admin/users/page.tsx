"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "@/types";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreHorizontal, 
  Mail,
  Download,
  Trash2
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { toast } from "sonner";
import { UserDialog } from "@/components/admin/UserDialog";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import {
  DashboardAlertCancel,
  DashboardAlertAction,
} from "@/components/shared/DashboardAlertActions";
import { dashboardUi } from "@/lib/dashboard-ui";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function AdminUsersContent() {
  const { search, setSearch } = useSearchState();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const { data: users, isLoading, refetch: fetchUsers } = useData<User[]>(
    userId ? `/api/admin/users?id=${userId}` : `/api/admin/users?search=${search}`,
    { initialData: [] }
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [statusId, setStatusId] = useState<{ id: string, active: boolean } | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const { exportToCSV } = useExport();

  const toggleStatus = async (id: string) => {
    try {
        await axiosInstance.patch(`/api/admin/users/${id}/toggle-status`);
        toast.success("User status updated");
        fetchUsers();
    } catch (err) {
        toast.error("Failed to update status");
    }
  };

  const handleSaveUser = async (data: any) => {
    try {
      if (selectedUser) {
        await axiosInstance.put(`/api/admin/users/${selectedUser.id}`, data);
        toast.success("User updated successfully");
      } else {
        await axiosInstance.post("/api/admin/users", data);
        toast.success("User created successfully");
      }
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save user");
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
        await axiosInstance.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openCreateDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <DashboardPageContainer width="default">
      <DashboardPageHeader 
        title="Personnel Registry" 
        subtitle="Manage platform participants: high-fidelity profiles for clients, providers, and executive staff."
      />

      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search users"
        viewMode={viewMode}
        onViewChange={setViewMode}
        bulkActions={[
          {
            label: 'Export All',
            icon: <Download className="w-4 h-4" />,
            onClick: () => exportToCSV(users, 'platform_users')
          }
        ]}
      />

      {viewMode === 'list' ? (
        <DashboardDataCard className="overflow-x-auto kuba-scroll">
              <Table>
              <TableHeader>
                <DashboardTableHeaderRow>
                  <DashboardTableHead position="first" className="!pl-10 h-16">System Identity</DashboardTableHead>
                  <DashboardTableHead className="h-16">Access Architecture</DashboardTableHead>
                  <DashboardTableHead className="h-16">Account Status</DashboardTableHead>
                  <DashboardTableHead className="h-16">Onboarding Phase</DashboardTableHead>
                  <DashboardTableHead position="last" className="h-16">Operations</DashboardTableHead>
                </DashboardTableHeaderRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="pl-6"><div className="flex items-center gap-3"><Skeleton className="w-9 h-9 rounded-lg" /><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-18 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <EmptyState
                        variant="dashboard"
                        title="No users found"
                        description="Try adjusting your search or filters to find what you're looking for."
                      />
                    </TableCell>
                  </TableRow>
                ) : users.map((u) => (
                  <TableRow key={u.id} className="group border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-border shadow-sm">
                          {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" /> : u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{u.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.role} type="dashboard" dashboardType="role" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.is_active ? "Active" : "Suspended"} type="dashboard" />
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 rounded-xl">
                          <DropdownMenuLabel className={dashboardUi.dropdown.labelAlt}>User Operations</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(u)} className="cursor-pointer text-xs font-medium text-foreground">Edit User</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setStatusId({ id: u.id, active: u.is_active })} className={`cursor-pointer text-xs font-medium ${u.is_active ? 'text-amber-500 focus:text-amber-600 focus:bg-amber-50' : 'text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50'}`}>
                            {u.is_active ? "Suspend" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setDeleteUserId(u.id)} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50 gap-2">
                            <Trash2 className="w-3.5 h-3.5" /> Permanently Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
          ) : users.length === 0 ? (
            <EmptyState
              variant="dashboard"
              title="No users found"
              className="col-span-full"
            />
          ) : users.map((u) => (
            <Card key={u.id} className="border border-border border-none bg-card/50 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary font-bold text-xl overflow-hidden border border-border/60 shadow-inner group-hover:border-primary/20 transition-all">
                    {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" /> : u.name[0]}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent -mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 rounded-xl">
                      <DropdownMenuItem onClick={() => openEditDialog(u)} className="cursor-pointer text-xs font-medium text-foreground">Edit User</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => setStatusId({ id: u.id, active: u.is_active })} className={`cursor-pointer text-xs font-medium ${u.is_active ? 'text-amber-500 focus:text-amber-600 focus:bg-amber-50' : 'text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50'}`}>
                        {u.is_active ? "Suspend User" : "Activate User"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setDeleteUserId(u.id)} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50 gap-2">
                        <Trash2 className="w-3.5 h-3.5" /> Purge Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1 mb-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{u.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 flex-shrink-0" /> {u.email}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <StatusBadge status={u.role} type="dashboard" dashboardType="role" showIcon={false} />
                  <StatusBadge status={u.is_active ? "Active" : "Suspended"} type="dashboard" showIcon={false} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

       <UserDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />


      {/* Status Toggle Confirmation */}
      <AlertDialog open={!!statusId} onOpenChange={(open) => !open && setStatusId(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic tracking-tight">Modify Access Rights?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              Are you sure you want to {statusId?.active ? "suspend" : "activate"} this personnel's marketplace access?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 pt-4">
            <DashboardAlertCancel>Dismiss</DashboardAlertCancel>
            <DashboardAlertAction
                className={statusId?.active ? "!bg-amber-600 hover:!bg-amber-700" : "!bg-emerald-600 hover:!bg-emerald-700"}
                onClick={() => {
                    if (statusId) {
                        toggleStatus(statusId.id);
                        setStatusId(null);
                    }
                }}
            >
                Confirm Mutation
            </DashboardAlertAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AppConfirmDialog
        open={deleteUserId !== null}
        onOpenChange={() => setDeleteUserId(null)}
        onConfirm={async () => { if (deleteUserId) { await deleteUser(deleteUserId); setDeleteUserId(null); } }}
        title="Purge User Identity?"
        description="This action will permanently remove this participant from the registry. This cannot be undone."
      />
    </DashboardPageContainer>
  );
}

export default function AdminUsers() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <AdminUsersContent />
    </Suspense>
  );
}
