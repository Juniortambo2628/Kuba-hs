"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Search, 
  Filter, 
  ArrowUpRight, 
  MoreHorizontal,
  Briefcase,
  User as UserIcon,
  ShieldCheck,
  Zap,
  AlertCircle,
  Download,
  Trash2,
  Check
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { Checkbox } from "@/components/ui/checkbox";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Booking {
  id: number;
  booking_number: string;
  status: string;
  payment_status: string;
  service?: { id: number; name: string };
  customer?: { id: number; name: string; email: string };
  provider?: { id: number; business_name: string; user: { id: number; name: string } };
  scheduled_date: string;
  estimated_price?: number;
  final_price?: number;
}

export default function AdminBookings() {
  const { search, setSearch, status, setStatus } = useSearchState();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { exportToCSV } = useExport();

  useEffect(() => {
    fetchBookings(search, status);
  }, [search, status]);

  const fetchBookings = async (search = "", status = "") => {
    try {
      const res = await axiosInstance.get(`/api/admin/bookings?search=${search}&status=${status}`);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, statusToUpdate: string) => {
    try {
        await axiosInstance.patch(`/api/bookings/${id}/status`, { status: statusToUpdate });
        fetchBookings(search, status);
    } catch (err) {
        console.error("Failed to update status:", err);
    }
  };

  const handleBatchUpdate = async (newStatus: string) => {
    try {
        await Promise.all(selectedIds.map(id => 
            axiosInstance.patch(`/api/bookings/${id}/status`, { status: newStatus })
        ));
        toast.success(`Updated ${selectedIds.length} bookings`);
        setSelectedIds([]);
        fetchBookings(search, status);
    } catch (err) {
        toast.error("Batch update failed");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(prev => 
        prev.length === bookings.length ? [] : bookings.map(b => b.id)
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-sky-50 text-sky-600 border-sky-100"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${styles[status] || "bg-gray-50 text-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Order <span className="text-sky-600">Registry</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Managing all Kuba Marketplace transactions and service fulfillment.
            </p>
        </div>
        <div className="flex items-center gap-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-sky-50 dark:bg-sky-500/10 rounded-2xl border border-sky-100 animate-in fade-in slide-in-from-top-4">
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest px-3">
                        {selectedIds.length} Selected
                    </span>
                    <Button onClick={() => handleBatchUpdate('confirmed')} variant="ghost" size="sm" className="text-[9px] font-black uppercase text-emerald-600 hover:bg-emerald-50 rounded-xl px-4">
                        <Check className="w-3 h-3 mr-2" /> Confirm All
                    </Button>
                    <Button onClick={() => handleBatchUpdate('cancelled')} variant="ghost" size="sm" className="text-[9px] font-black uppercase text-sky-600 hover:bg-sky-50 rounded-xl px-4">
                        <Trash2 className="w-3 h-3 mr-2" /> Void All
                    </Button>
                </div>
            )}
            <Button 
                onClick={() => exportToCSV(bookings, 'all_bookings')}
                variant="outline" 
                className="h-14 border-gray-100 bg-white text-gray-500 hover:text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 px-6"
            >
                <Download className="w-4 h-4" /> Export CSV
            </Button>
        </div>
      </div>

      <Card className="premium-card overflow-hidden border-none shadow-premium">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Transaction Logs</h2>
                <p className="text-xs font-bold text-gray-400 italic">Filter and oversee the complete platform booking history.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Booking ID..." 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-12 border-gray-100 bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 px-6 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest gap-2">
                            <Filter className="w-4 h-4" />
                            {status || "All Status"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-premium">
                        <DropdownMenuLabel className="text-[10px] uppercase font-black text-gray-400 p-2">Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatus(null)} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3">All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("pending")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-amber-600">Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("confirmed")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-blue-600">Confirmed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("completed")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-emerald-600">Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("cancelled")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-3 text-sky-600">Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 w-12">
                    <Checkbox checked={selectedIds.length === bookings.length} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Reference</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Service / Merchant</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Client Info</TableHead>
                <TableHead className="h-16 uppercase text-[10px} font-black tracking-[0.2em] text-gray-400">Value</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Status</TableHead>
                <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className={`hover:bg-gray-50/50 transition-colors border-gray-50 group ${selectedIds.includes(booking.id) ? "bg-sky-50/30" : ""}`}>
                  <TableCell className="pl-10 py-6">
                    <Checkbox checked={selectedIds.includes(booking.id)} onCheckedChange={() => toggleSelect(booking.id)} />
                  </TableCell>
                  <TableCell className="py-6">
                        #{booking.booking_number}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                        <p className="font-black text-[#1E293B] text-sm group-hover:text-sky-600 transition-colors">{booking.service?.name || "—"}</p>
                        <p className="text-[10px] font-bold text-gray-300 italic">via {booking.provider?.business_name || "Merchant"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 font-black text-[#1E293B] text-xs">
                    {booking.customer?.name}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5 font-black text-[#1E293B] text-xs">
                        ${booking.final_price || booking.estimated_price || '0.00'}
                        <p className="text-[8px] text-gray-300 uppercase">{booking.final_price ? 'Final Value' : 'Est. Market Value'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right space-x-3">
                    {booking.status === 'pending' && (
                        <button 
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="text-[9px] font-black text-emerald-600 hover:text-black uppercase tracking-widest transition-colors"
                        >
                            Confirm
                        </button>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <button 
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="text-[9px] font-black text-sky-600 hover:text-black uppercase tracking-widest transition-colors"
                        >
                            Void
                        </button>
                    )}
                    <button className="p-2 text-gray-200 hover:text-sky-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-200">
                        <Zap className="h-16 w-16 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No active bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
