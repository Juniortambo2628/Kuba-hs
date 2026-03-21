"use client";

import { ReactNode } from "react";
import { Calendar, MapPin, Clock, User as UserIcon, Briefcase, Building2, Factory, Home, ImageIcon, ArrowUpRight, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Booking } from "@/types";

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
        {(isProvider || isAdmin) && (
          <div className={cn(
            "w-1 md:w-1.5 transition-all duration-500 shrink-0",
            booking.status === 'completed' ? 'bg-green-600' : booking.status === 'pending' ? 'bg-amber-400' : 'bg-blue-600',
            "group-hover:w-2 md:group-hover:w-3",
            isSelected && "bg-primary w-2 md:w-3"
          )} />
        )}
        
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
              <BookingStatusBadge status={booking.status} />
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
                      {new Date(booking.scheduled_date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-foreground leading-none mt-1">
                      {new Date(booking.scheduled_date).getDate()}
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
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
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
              {/* This assumes a BookingProgressTracker component exists or is passed as children */}
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

          {/* Footer: Price and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4 flex-1 w-full md:w-auto">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground tracking-tight">Scheduled Time</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground capitalize">
                  <Clock className="w-3 h-3 text-muted-foreground mb-0.5" /> 
                  {booking.scheduled_time || 'TBD'}
                </div>
              </div>
              <div className="space-y-1 pl-4 border-l border-border">
                <p className="text-[9px] font-bold text-muted-foreground tracking-tight">{(isProvider || isAdmin) ? 'Est. Revenue' : 'Price Est.'}</p>
                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  KES {Number(booking.estimated_price || 0).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
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
