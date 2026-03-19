"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus,
  Mail,
  Download,
  Trash2
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { UserDialog } from "@/components/admin/UserDialog";
import { toast } from "sonner";

export default function AdminUsers() {
  const { search, setSearch } = useSearchState();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const { exportToCSV } = useExport();

  useEffect(() => {
    fetchUsers(search);
  }, [search]);

  const fetchUsers = async (s = "") => {
    try {
      const res = await axiosInstance.get(`/api/admin/users?search=${s}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
        await axiosInstance.patch(`/api/admin/users/${id}/toggle-status`);
        toast.success("User status updated");
        fetchUsers(search);
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
      fetchUsers(search);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save user");
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
        await axiosInstance.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers(search);
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform participants: clients, providers, and staff.</p>
        </div>
      </div>
      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
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

      {/* Content area: Grid or List */}
      {viewMode === 'list' ? (
        <Card className="border border-border overflow-hidden bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="pl-6 uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">User</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Role</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Status</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Joined</TableHead>
                  <TableHead className="pr-6 text-right uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Actions</TableHead>
                </TableRow>
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
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-sm">No users found</TableCell>
                  </TableRow>
                ) : users.map((u) => (
                  <TableRow key={u.id} className="group border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-primary font-semibold text-xs uppercase overflow-hidden border border-border">
                          {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" /> : u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{u.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase border ${u.role === 'admin' ? 'bg-muted text-foreground border-border' : 'bg-muted text-muted-foreground'}`}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase border bg-muted text-foreground border-border`}>
                        {u.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 rounded-xl">
                          <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-muted-foreground">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(u)} className="cursor-pointer text-xs font-medium">Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(u.id)} className={`cursor-pointer text-xs font-medium ${u.is_active ? 'text-amber-500 focus:text-amber-600 focus:bg-amber-50' : 'text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50'}`}>
                            {u.is_active ? "Suspend" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteUser(u.id)} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50 gap-2">
                             <Trash2 className="w-3.5 h-3.5" /> Permanently Delete
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
          ) : users.length === 0 ? (
            <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No users found</div>
          ) : users.map((u) => (
            <Card key={u.id} className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary font-bold text-lg uppercase overflow-hidden border border-border shadow-sm group-hover:border-primary/20 transition-colors">
                    {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" /> : u.name[0]}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent -mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 rounded-xl">
                      <DropdownMenuItem onClick={() => openEditDialog(u)} className="cursor-pointer text-xs font-medium">Edit User</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(u.id)} className={`cursor-pointer text-xs font-medium ${u.is_active ? 'text-amber-500 focus:text-amber-600 focus:bg-amber-50' : 'text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50'}`}>
                        {u.is_active ? "Suspend User" : "Activate User"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteUser(u.id)} className="cursor-pointer text-xs font-medium text-red-500 focus:text-red-600 focus:bg-red-50 gap-2">
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
                  <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase border ${u.role === 'admin' ? 'bg-muted text-foreground border-border' : 'bg-muted text-muted-foreground'}`}>
                    {u.role}
                  </Badge>
                  <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase border bg-muted text-foreground border-border`}>
                    {u.is_active ? "Active" : "Suspended"}
                  </Badge>
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
    </div>
  );
}
