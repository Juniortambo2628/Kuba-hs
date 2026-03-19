"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  XCircle,
  FileText
} from "lucide-react";
import { format } from "date-fns";

import { useState } from "react";
import { ChatUI } from "@/components/chat/ChatUI";
import { ServiceProgress } from "./ServiceProgress";

interface BookingDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onUpdateStatus?: (status: string) => void;
}

export function BookingDetailDialog({ isOpen, onClose, booking, onUpdateStatus }: BookingDetailDialogProps) {
  const [showChat, setShowChat] = useState(false);
  
  if (!booking) return null;

  const handleClose = () => {
    setShowChat(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-sky-600 bg-sky-50 border-sky-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2rem] shadow-premium transition-all duration-500 ${showChat ? "sm:max-w-[700px]" : ""}`}>
        {showChat ? (
            <div className="p-4 bg-white dark:bg-zinc-950">
                <div className="flex items-center justify-between mb-4 px-4">
                    <Button variant="ghost" onClick={() => setShowChat(false)} className="text-sky-600 font-black uppercase tracking-widest text-[10px]">
                        ← Back to Details
                    </Button>
                    <h2 className="font-black text-[#1E293B] dark:text-white uppercase tracking-tighter">Booking Chat</h2>
                </div>
                <ChatUI bookingId={booking.id} />
            </div>
        ) : (
            <>
                <div className="bg-[#1E293B] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileText className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Booking Reference</p>
                                <h2 className="text-3xl font-black italic tracking-tighter">#{booking.booking_number}</h2>
                            </div>
                            <Badge variant="outline" className={`rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </Badge>
                        </div>
                        
                        {/* Service Tracking Progress */}
                        <ServiceProgress status={booking.status} />
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-white">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Scheduled Time
                            </p>
                            <p className="font-black text-[#1E293B]">
                                {booking.scheduled_date ? format(new Date(booking.scheduled_date), 'PPP p') : 'TBD'}
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <User className="w-3 h-3" /> Provider
                            </p>
                            <p className="font-black text-[#1E293B]">
                                {booking.provider?.business_name || booking.provider?.user?.name || 'Assigned Pro'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Service Location
                        </p>
                        <p className="font-bold text-sm text-[#1E293B] leading-relaxed">
                            {booking.address ? `${booking.address.street_address}, ${booking.address.city}` : 'On-site Service'}
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Service Item</span>
                            <span>Cost Breakdown</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-black text-[#1E293B]">{booking.service?.name}</p>
                            <p className="font-black text-lg text-sky-600 italic tracking-tighter">
                                KES {booking.final_price || booking.estimated_price || '0.00'}
                            </p>
                        </div>
                    </div>

                    {booking.description && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specific Requirements</p>
                            <p className="text-xs font-bold text-gray-500 italic leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                "{booking.description}"
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {booking.status === 'pending' && (
                            <Button 
                                onClick={() => onUpdateStatus?.('cancelled')}
                                variant="outline" 
                                className="flex-1 h-14 border-gray-100 bg-white text-sky-600 hover:bg-sky-50 hover:border-sky-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel Request
                            </Button>
                        )}
                        <Button 
                            onClick={() => setShowChat(true)}
                            className="flex-[2] h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-gray-100 gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Message Provider
                        </Button>
                    </div>
                </div>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
