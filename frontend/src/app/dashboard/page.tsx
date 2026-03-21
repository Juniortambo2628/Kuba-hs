"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, User as UserIcon, Building2, CreditCard, Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: number;
  booking_number: string;
  status: string;
  scheduled_date: string;
  estimated_price: string;
  payment_status: string;
  service: { id: number; name: string };
  customer?: { id: number; name: string };
  provider?: { id: number; business_name: string; user: { name: string } };
  address?: { city: string };
  review?: { id: number; rating: number };
  payment?: { status: string };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-muted dark:bg-muted/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">Pending</Badge>;
    case "confirmed":
      return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">Confirmed</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-muted dark:bg-muted/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        window.location.href = "/login";
      } else if (user.role === 'admin') {
        window.location.href = "/admin";
      } else if (user.role === 'provider') {
        window.location.href = "/dashboard/provider";
      } else {
        window.location.href = "/dashboard/client";
      }
    }
  }, [authLoading, user]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </main>
  );
}
