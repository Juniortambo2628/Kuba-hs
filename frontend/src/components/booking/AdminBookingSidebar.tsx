"use client";

import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Star,
  Building,
  User as UserIcon,
  Mail,
  Phone,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OperationalLog } from "@/components/booking/OperationalLog";
import { Booking } from "@/types";

interface AdminBookingSidebarProps {
  booking: Booking & {
    payment_status?: string;
    payment_method?: string;
    customer?: Booking["customer"] & {
      membership_tier?: { name?: string };
      total_points?: number;
    };
    provider?: Booking["provider"] & { brand_name?: string };
  };
  logRefreshKey?: number;
  customerTierLabel: string;
}

export function AdminBookingSidebar({
  booking,
  logRefreshKey = 0,
  customerTierLabel,
}: AdminBookingSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-8">
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-white/10 text-white border-none text-[9px] font-black uppercase tracking-[0.15em] backdrop-blur-md">
              Transactional Audit
            </Badge>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registry Value</p>
          <h3 className="text-4xl font-black italic tracking-tighter mt-1 leading-none">
            KES {Number(booking.final_price || booking.estimated_price || 0).toLocaleString()}
          </h3>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</span>
              <Badge
                className={`${booking.payment_status === "paid" ? "bg-emerald-500" : "bg-amber-500"} text-white text-[9px] border-none font-bold uppercase tracking-wider`}
              >
                {booking.payment_status || "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
              <span className="text-xs font-bold">
                {booking.payment_method?.replace("_", " ") || "Marketplace Escrow"}
              </span>
            </div>
          </div>
          {booking.payment_status === "paid" ? (
            <Button
              asChild
              className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 transition-all"
            >
              <Link
                href={`/admin/payments?tab=transactions&search=${encodeURIComponent(booking.booking_number || booking.id)}`}
              >
                Payment Verified ✓
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              className="w-full h-12 bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
            >
              Awaiting Payment
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-premium rounded-[2.5rem] bg-white dark:bg-card border border-border/50 overflow-hidden">
        <div className="p-8 border-b border-border/40 bg-muted/20">
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" />
            Requester Profile
          </h3>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
              {booking.customer?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-foreground truncate">{booking.customer?.name}</h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Tier: {customerTierLabel}
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{booking.customer?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{booking.customer?.phone || "N/A"}</span>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-full h-11 rounded-xl border-border hover:bg-muted font-bold text-[10px] uppercase tracking-widest"
          >
            <Link
              href={`/admin/users?search=${encodeURIComponent(booking.customer?.email || booking.customer?.name || "")}`}
            >
              View customer profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-premium rounded-[2.5rem] bg-white dark:bg-card border border-border/50 overflow-hidden">
        <div className="p-8 border-b border-border/40 bg-muted/20">
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Provider Credential
          </h3>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              {booking.provider?.brand_name ? (
                <Building className="w-7 h-7" />
              ) : (
                <UserIcon className="w-7 h-7" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-foreground truncate">
                {booking.provider?.brand_name || booking.provider?.business_name || "Individual Provider"}
              </h4>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-emerald-500" /> Professional Verified
              </p>
            </div>
          </div>
          {booking.provider?.id && (
            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-xl border-border hover:bg-muted font-bold text-[10px] uppercase tracking-widest"
            >
              <Link href={`/admin/providers/${booking.provider.id}`}>View provider profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <OperationalLog bookingId={booking.id} refreshKey={logRefreshKey} />
    </div>
  );
}
