import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { 
    Search, UserPlus, MoreHorizontal, Shield, Mail, 
    Calendar, Filter, RotateCcw, UserCheck, UserX, Edit2, Trash2,
    Building2, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import DashboardShell from '@/Components/DashboardShell';
import { 
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";

export default function UsersIndex({ users, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('admin.users.index'), { ...filters, search: value }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 300),
        [filters]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.users.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const toggleStatus = (user) => {
        if (confirm(`Are you sure you want to ${user.is_active ? 'suspend' : 'activate'} this user?`)) {
            router.patch(route('admin.users.toggle-status', user.id), {}, {
                preserveScroll: true
            });
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: "bg-purple-50 text-purple-700 border-purple-200",
            provider: "bg-blue-50 text-blue-700 border-blue-200",
            customer: "bg-teal-50 text-teal-700 border-teal-200",
        };
        return (
            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", styles[role] || "bg-muted text-muted-foreground")}>
                {role}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />

            <DashboardShell
                title="User Management"
                subtitle="Oversee all platform participants, verify identities, and manage access."
                action={{
                    label: "Add New User",
                    href: route('admin.users.create'),
                    icon: UserPlus,
                }}
            >
                <div className="space-y-4">
                    {/* Filters Row */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or email..." 
                                className="pl-9"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <select 
                                value={filters.role || ''}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary w-full sm:w-40"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="provider">Providers</option>
                                <option value="customer">Customers</option>
                            </select>

                            <select 
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary w-full sm:w-40"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Suspended</option>
                            </select>
                            
                            {(filters.search || filters.role || filters.status) && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index'), {})}
                                    className="text-muted-foreground"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="pl-6 py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">User Profile</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Role</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Verification</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Joined At</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Status</TableHead>
                                    <TableHead className="pr-6 py-3 text-right uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground leading-tight">{user.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        user.is_verified ? "bg-emerald-500" : "bg-muted-foreground/30"
                                                    )} />
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
                                                        {user.is_verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    user.is_active ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
                                                )}>
                                                    {user.is_active ? 'Active' : 'Suspended'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.users.edit', user.id)}>
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                Edit Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => toggleStatus(user)}
                                                            className={cn(user.is_active ? "text-red-500" : "text-emerald-600")}
                                                        >
                                                            {user.is_active ? (
                                                                <><UserX className="mr-2 h-4 w-4" /> Suspend User</>
                                                            ) : (
                                                                <><UserCheck className="mr-2 h-4 w-4" /> Activate User</>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this user?')) {
                                                                    router.delete(route('admin.users.destroy', user.id));
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Permanently Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                                <Shield className="h-10 w-10 mb-2" />
                                                <p className="text-sm font-bold uppercase tracking-widest">No users found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        
                        {/* Pagination */}
                        {users.links.length > 3 && (
                            <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Displaying {users.from}-{users.to} of {users.total} entries
                                </span>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={cn(
                                                "h-8 px-3 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter transition-all",
                                                link.active 
                                                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                !link.url && "opacity-50 pointer-events-none"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
