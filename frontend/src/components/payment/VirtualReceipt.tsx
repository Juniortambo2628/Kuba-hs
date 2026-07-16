"use client";

import { useRef } from "react";
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  Shield, 
  Calendar, 
  MapPin, 
  User, 
  Briefcase,
  Hash,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Booking } from "@/types";

interface VirtualReceiptProps {
  booking: Booking;
  onClose: () => void;
  transactionId?: string;
  paymentMethod?: string;
}

export function VirtualReceipt({ booking, onClose, transactionId, paymentMethod }: VirtualReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const amount = booking.final_price || booking.estimated_price || 0;
  const platformFee = Math.round(amount * 0.10 * 100) / 100;
  const total = amount + platformFee;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Kuba Receipt - ${booking.booking_number}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
            .receipt { max-width: 500px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
            .divider { border: none; border-top: 1px dashed #e0e0e0; margin: 16px 0; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
            .row-label { color: #888; }
            .row-value { font-weight: 600; }
            .total-row { font-size: 18px; font-weight: 800; padding: 12px 0; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            .footer { text-align: center; margin-top: 32px; font-size: 11px; color: #aaa; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="logo">KUBA</div>
              <p style="font-size: 11px; color: var(--muted-foreground, #475569); text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">Payment Receipt</p>
              <div style="margin-top: 12px;"><span class="badge">✓ PAID</span></div>
            </div>
            <hr class="divider" />
            <div class="row"><span class="row-label">Receipt #</span><span class="row-value">${booking.booking_number || 'N/A'}</span></div>
            <div class="row"><span class="row-label">Transaction ID</span><span class="row-value">${transactionId || 'N/A'}</span></div>
            <div class="row"><span class="row-label">Date</span><span class="row-value">${format(new Date(), 'PPP')}</span></div>
            <div class="row"><span class="row-label">Method</span><span class="row-value">${(paymentMethod || 'paystack').toUpperCase()}</span></div>
            <hr class="divider" />
            <div class="row"><span class="row-label">Service</span><span class="row-value">${booking.service?.name || 'Service'}</span></div>
            <div class="row"><span class="row-label">Customer</span><span class="row-value">${booking.customer?.name || 'Customer'}</span></div>
            <hr class="divider" />
            <div class="row"><span class="row-label">Service Amount</span><span class="row-value">KES ${amount.toLocaleString()}</span></div>
            <div class="row"><span class="row-label">Platform Fee (10%)</span><span class="row-value">KES ${platformFee.toLocaleString()}</span></div>
            <hr class="divider" />
            <div class="row total-row"><span>Total Paid</span><span>KES ${total.toLocaleString()}</span></div>
            <div class="footer">
              <p>Thank you for choosing Kuba.</p>
              <p style="margin-top: 4px;">This receipt serves as proof of payment.</p>
              <p style="margin-top: 12px;">support@kuba.co.ke • kuba.co.ke</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-background rounded-[2.5rem] shadow-2xl border border-border max-w-md w-full overflow-hidden relative"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Banner */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Payment Confirmed</h2>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Transaction Verified</p>
          </div>
        </div>

        {/* Receipt Body */}
        <div ref={receiptRef} className="p-8 space-y-6">
          {/* Amount */}
          <div className="text-center py-4 border-b border-dashed border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-4xl font-black text-foreground tracking-tighter italic">
              KES {total.toLocaleString()}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Hash className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Receipt No.</span>
              </div>
              <span className="text-xs font-bold text-foreground">{booking.booking_number || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Transaction</span>
              </div>
              <span className="text-xs font-bold text-foreground font-mono">{transactionId?.slice(0, 16) || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Date</span>
              </div>
              <span className="text-xs font-bold text-foreground">{format(new Date(), 'PPP')}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Method</span>
              </div>
              <span className="text-xs font-bold text-foreground uppercase">{paymentMethod || 'Paystack'}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-muted/30 rounded-2xl p-5 space-y-3 border border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Service</span>
              <span className="font-bold text-foreground">{booking.service?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Amount</span>
              <span className="font-bold text-foreground">KES {amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Platform Fee</span>
              <span className="font-bold text-foreground">KES {platformFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer & Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Customer</span>
              </div>
              <p className="text-xs font-bold text-foreground truncate">{booking.customer?.name || 'N/A'}</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Provider</span>
              </div>
              <p className="text-xs font-bold text-foreground truncate">{booking.provider?.brand_name || booking.provider?.business_name || 'Provider'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="flex-1 h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-[10px] uppercase tracking-widest"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
