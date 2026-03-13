"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldCheck, 
  UserPlus,
  Mail,
  UserCheck,
  UserX,
  ChevronRight,
  Download
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
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

// interface User removed

export default function AdminUsers() {
  const { search, setSearch } = useSearchState();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const openCreateDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  /* 
     Initial loading state handled by skeleton. 
     We remove the early return to show the full layout with skeletons.
  */

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                User <span className="text-sky-600">Base</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Managing marketplace participants: Clients, Merchants, and Staff.
            </p>
        </div>
        <button 
            onClick={openCreateDialog}
            className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] flex items-center gap-2"
        >
            <UserPlus className="w-4 h-4" />
            Provision New Account
        </button>
        <Button 
            onClick={() => exportToCSV(users, 'platform_users')}
            variant="outline" 
            className="h-14 border-gray-100 bg-white text-gray-500 hover:text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 px-6"
        >
            <Download className="w-4 h-4" /> Export Directory
        </Button>
      </div>

      <Card className="premium-card overflow-hidden border-none shadow-premium">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Platform Directory</h2>
                <p className="text-xs font-bold text-gray-400 italic">Manage account statuses and membership roles across Kuba.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Name or Email..." 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>
                <button className="h-12 border border-gray-100 bg-white hover:bg-gray-50 p-3 rounded-xl transition-all">
                    <Filter className="w-5 h-5" />
                </button>
            </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Account Identity</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">System Role</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Status</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Join Date</TableHead>
                <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Access Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent border-gray-50">
                    <TableCell className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="py-6"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="pr-10 py-6 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.map((u) => (
                <TableRow key={u.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#1E293B] font-black text-xs uppercase group-hover:bg-sky-50 group-hover:text-sky-600 transition-all overflow-hidden">
                        {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                            u.name[0]
                        )}
                    </div>
                        <div className="space-y-1">
                            <p className="font-black text-[#1E293B] text-sm group-hover:text-sky-600 transition-colors">{u.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 italic flex items-center gap-1.5"><Mail className="w-3 h-3" /> {u.email}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-500'}`}>
                        {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${u.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-sky-50 text-sky-600 border-sky-100"}`}>
                        {u.is_active ? "Authorized" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 font-black text-[#1E293B] text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right space-x-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 text-gray-200 hover:text-sky-600 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-premium">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-gray-400 p-2">Audit Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(u)} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3">
                                Edit Credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(u.id)} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3">
                                {u.is_active ? "Suspend Access" : "Revive Access"}
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

      <UserDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
