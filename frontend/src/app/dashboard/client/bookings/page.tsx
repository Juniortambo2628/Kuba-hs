"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Loader2,
  CreditCard,
  DownloadCloud
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";

export default function ClientBookings() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isStartingChat, setIsStartingChat] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<number | null>(null);
  
  // Base Paystack configuration (will be merged with access_code per transaction)
  const paystackConfig = {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_dummy",
    reference: "",
    email: user?.email || "",
    amount: 0, 
  };
  
  const initializePayment = usePaystackPayment(paystackConfig);

  useEffect(() => {
    if (!authLoading && user) {
      const delayDebounceFn = setTimeout(() => {
        fetchBookings(searchQuery, filterStatus);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [authLoading, user, searchQuery, filterStatus]);

  const fetchBookings = async (search = "", status = "") => {
    try {
      const res = await axiosInstance.get(`/api/client/bookings?search=${search}&status=${status}`);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageProvider = async (bookingId: number) => {
    setIsStartingChat(bookingId);
    try {
      await axiosInstance.post(`/api/chat/bookings/${bookingId}/conversation`);
      router.push('/dashboard/client/messages');
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversation");
    } finally {
      setIsStartingChat(null);
    }
  };

  const handlePayment = async (booking: any) => {
    setIsProcessingPayment(booking.id);
    try {
        // 1. Initialize on backend
        const initRes = await axiosInstance.post("/api/payments/paystack/initialize", {
            booking_id: booking.id
        });
        
        const { access_code, reference } = initRes.data;

        // 2. Open Paystack Inline
        initializePayment({
            config: {
                ...paystackConfig,
                reference: reference,
                email: user?.email || "",
                amount: Math.round(initRes.data.amount * 100), // Kobo (used just for display config if needed, backend holds truth)
            },
            onSuccess: async (referenceData: any) => {
                // 3. Verify on backend via callback
                try {
                    await axiosInstance.post("/api/payments/paystack/verify", {
                        reference: referenceData.reference
                    });
                    toast.success("Payment successful!");
                    fetchBookings(searchQuery, filterStatus);
                } catch (verifyErr: any) {
                    toast.error(verifyErr.response?.data?.message || "Payment verification failed.");
                } finally {
                    setIsProcessingPayment(null);
                }
            },
            onClose: () => {
                toast.info("Payment cancelled");
                setIsProcessingPayment(null);
            }
        });
        
    } catch (err: any) {
        console.error("Payment init error:", err);
        toast.error(err.response?.data?.message || "Failed to initialize payment");
        setIsProcessingPayment(null);
    }
  };

  const handleDownloadInvoice = async (bookingId: number) => {
    try {
        const response = await axiosInstance.get(`/api/invoices/${bookingId}/download`, {
            responseType: 'blob', // Important for downloading files
        });
        
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${bookingId}.pdf`); // Define filename
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        link.remove();
        
        toast.success("Invoice downloaded successfully");
    } catch (err) {
        console.error("Failed to download invoice:", err);
        toast.error("Failed to download invoice");
    }
  };

  const getTimeSession = (dateStr: string) => {
    const hour = new Date(dateStr).getHours();
    if (hour < 12) return "Morning Session";
    if (hour < 17) return "Afternoon Session";
    return "Evening Session";
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'cancelled': return 'text-sky-600 bg-sky-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'confirmed': return <Clock className="w-3.5 h-3.5" />;
      case 'pending': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Card className="rounded-[2.5rem] border-gray-100">
           <CardContent className="p-10">
              <Skeleton className="h-80 w-full rounded-2xl" />
           </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1E293B] tracking-tight uppercase">My Service History</h1>
          <p className="text-gray-400 font-bold text-sm italic">Track and manage your upcoming and past home services.</p>
        </div>
        <Link href="/services">
          <Button className="h-12 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-sky-600/20 transition-all uppercase tracking-widest text-[10px]">
            Book New Service
          </Button>
        </Link>
      </div>

      <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                    <ClipboardList className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-wider">All Bookings</h2>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID or Service..." 
                        className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-gray-300 placeholder:italic"
                    />
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-11 border border-gray-100 bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-widest text-gray-400">Booking Ref</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-widest text-gray-400">Service Details</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-widest text-gray-400">Scheduled For</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-widest text-gray-400">Price Estimate</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-widest text-gray-400">Status</TableHead>
                <TableHead className="h-16 pr-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest group-hover:scale-110 transition-transform inline-block">
                        #{booking.booking_number}
                    </span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                        <p className="font-black text-[#1E293B] text-sm group-hover:text-sky-600 transition-colors">{booking.service?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Professional Service</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1E293B]">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[11px] font-black text-[#1E293B]">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{getTimeSession(booking.scheduled_date)}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 font-black text-[#1E293B] text-sm">
                    ${booking.estimated_price}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusStyle(booking.status)} font-black text-[9px] uppercase tracking-widest`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                    </div>
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                           variant="ghost" 
                           onClick={() => handleMessageProvider(booking.id)}
                           disabled={isStartingChat === booking.id || isProcessingPayment === booking.id}
                           className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 h-8 rounded-lg px-3 flex items-center gap-1.5 transition-colors"
                        >
                           {isStartingChat === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                           <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Message</span>
                        </Button>

                        {booking.status === 'confirmed' && booking.payment_status !== 'paid' && (
                            <Button 
                               onClick={() => handlePayment(booking)}
                               disabled={isProcessingPayment === booking.id}
                               className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 rounded-lg px-4 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all font-black uppercase text-[10px] tracking-widest"
                            >
                               {isProcessingPayment === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                               Pay Now
                            </Button>
                        )}

                        {booking.payment_status === 'paid' && (
                            <Button 
                               variant="ghost" 
                               onClick={() => handleDownloadInvoice(booking.id)}
                               className="text-gray-500 hover:text-[#1E293B] hover:bg-gray-100 h-8 rounded-lg px-3 flex items-center gap-1.5 transition-colors ml-1"
                            >
                               <DownloadCloud className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Invoice</span>
                            </Button>
                        )}
                        
                        <button className="p-2 text-gray-300 hover:text-[#1E293B] transition-colors ml-1">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
                        <ClipboardList className="w-12 h-12 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest tracking-widest italic">No bookings found in your history</p>
                        <Button variant="link" className="text-sky-600 font-bold uppercase text-[9px] tracking-widest underline decoration-2 underline-offset-4">
                            Book your first service
                        </Button>
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
