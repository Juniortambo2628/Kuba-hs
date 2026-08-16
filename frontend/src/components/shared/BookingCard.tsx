"use client";

import { ReactNode } from "react";
import { Calendar, MapPin, Clock, User as UserIcon, Briefcase, Building2, Factory, Home, ImageIcon, ArrowUpRight, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBookingStatusAccentClass } from "@/lib/status-styles";
import { Booking } from "@/types";

function parseScheduledDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

interface BookingCardProps {
  booking: Booking;
  type: 'client' | 'provider' | 'admin';
  actions?: ReactNode;
  showProgress?: boolean;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function BookingCard({ 
  booking, 
  type, 
  actions, 
  showProgress = false,
  className,
  onClick,
  isSelected,
  onSelect
}: BookingCardProps) {
  const isProvider = type === 'provider';
  const isAdmin = type === 'admin';
  const scheduled = parseScheduledDate(booking.scheduled_date);

  const ServiceIcon = () => {
    if (booking.service_type === 'commercial') return <Building2 className="w-6 h-6" />;
    if (booking.service_type === 'large_scale') return <Factory className="w-6 h-6" />;
    return isProvider ? <Briefcase className="w-6 h-6" /> : <Home className="w-6 h-6" />;
  };

  return (
    <Card 
      className={cn(
        "border border-border bg-card/50 backdrop-blur-md group overflow-hidden border-none shadow-sm transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col md:flex-row h-full">
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Header: ID and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={(e) => { e.stopPropagation(); onSelect?.(); }}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                )}
                <span className="text-[10px] font-bold text-primary bg-muted px-2 py-1 rounded-md">
                  #{booking.booking_number || booking.id}
                </span>
                {isAdmin && (
                  <Badge variant="outline" className="text-[8px] font-bold tracking-tight h-5">
                    System View
                  </Badge>
                )}
              </div>
              <StatusBadge status={booking.status} type="booking" />
            </div>

            {/* Service Info */}
            <div className="flex items-start gap-4 md:gap-6">
              <div className={cn(
                "p-4 md:p-5 bg-muted rounded-2xl text-foreground group-hover:bg-background group-hover:shadow-sm transition-all duration-500 shrink-0",
                !isProvider && "w-14 h-14 p-0 flex flex-col items-center justify-center bg-muted/50 border border-border group-hover:border-primary/50"
              )}>
                {!isProvider ? (
                  <>
                    <span className="text-[9px] font-bold text-muted-foreground leading-none">
                      {scheduled
                        ? scheduled.toLocaleString("default", { month: "short" })
                        : "—"}
                    </span>
                    <span className="text-xl font-bold text-foreground leading-none mt-1">
                      {scheduled ? scheduled.getDate() : "—"}
                    </span>
                  </>
                ) : (
                  <ServiceIcon />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "font-bold text-foreground group-hover:text-primary transition-colors leading-none",
                    (isProvider || isAdmin) ? "text-xl tracking-tight" : "text-lg"
                  )}>
                    {booking.service?.name}
                  </h3>
                  {(isProvider || isAdmin) && booking.quantity && (
                    <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 tracking-normal text-[9px] font-bold">
                      {booking.quantity} {booking.service_type === 'commercial' ? 'Offices' : booking.service_type === 'large_scale' ? 'Units' : 'Rooms'}
                    </Badge>
                  )}
                </div>
                {!isProvider && <p className="text-[10px] font-bold text-muted-foreground tracking-tight">Professional Service</p>}
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] font-bold text-muted-foreground tracking-tight mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />{" "}
                    {scheduled ? scheduled.toLocaleDateString() : "Date TBD"}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-foreground">
                    <UserIcon className="w-3.5 h-3.5" /> {isProvider ? booking.customer?.name : isAdmin ? `Client: ${booking.customer?.name}` : booking.provider?.business_name || 'Assigned Pro'}
                  </span>
                  {(isProvider || isAdmin) && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {booking.address?.city || 'Location TBD'}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Content */}
          {showProgress && (
            <div className="px-6 py-4 -mx-8 bg-muted/30 border-y border-border/50">
              <p className="text-[9px] font-bold text-muted-foreground text-center">Progress Tracking Enabled</p>
            </div>
          )}

          {booking.rescheduled_at && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Rescheduled on {new Date(booking.rescheduled_at).toLocaleDateString()}</span>
            </div>
          )}

          {booking.status === 'cancelled' && booking.cancellation_reason && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl">
              <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">Cancellation Reason</span>
                <p className="text-[11px] text-red-500 font-medium italic">"{booking.cancellation_reason}"</p>
              </div>
            </div>
          )}

          {(isProvider || isAdmin) && booking.description && (
            <p className="text-xs text-muted-foreground max-w-xl line-clamp-2 italic">"{booking.description}"</p>
          )}

          {/* Status Indicator for Payment */}
          {booking.status === 'completed' && booking.payment_status !== 'paid' && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Pending Payment</span>
                <p className="text-[10px] text-amber-600/70 font-medium">Service completed. Please finalize your payment.</p>
              </div>
            </div>
          )}

          {/* Footer: Price and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border/50 mt-auto">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 flex-1">
              <div className="space-y-1 pr-4 border-r border-border/50 last:border-0">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Scheduled</p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/50" /> 
                  {booking.scheduled_time ||
                    (scheduled
                      ? scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "TBD")}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{(isProvider || isAdmin) ? 'Revenue' : 'Amount'}</p>
                <div className="flex items-center gap-1.5 text-base font-black text-foreground">
                  <span className="text-[10px] text-muted-foreground/70">KES</span>
                  {Number(booking.estimated_price || 0).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/30">
              {actions}
              {!actions && isProvider && (
                 <Button asChild variant="outline" className="h-9 w-9 p-0 rounded-xl border-border text-muted-foreground hover:text-primary hover:bg-muted transition-all shrink-0">
                  <Link href={`/dashboard/provider/bookings`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
