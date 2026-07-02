"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/echo";
import { extractApiList } from "@/lib/api-response";

export interface ActivityCounts {
  bookings: number;
  messages: number;
  notifications: number;
  payments: number;
  verification: number;
  quotes: number;
}

const defaultCounts: ActivityCounts = {
  bookings: 0,
  messages: 0,
  notifications: 0,
  payments: 0,
  verification: 0,
  quotes: 0,
};

export function useActivityCounts() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<ActivityCounts>(defaultCounts);
  const echo = getEcho();

  const fetchCounts = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch notification count
      const notifRes = await axiosInstance.get("/api/notifications");
      const unreadNotifs = notifRes.data.unread_count || 0;

      // Fetch unread messages count
      let unreadMessages = 0;
      try {
        const msgRes = await axiosInstance.get("/api/chat/conversations");
        const conversations = extractApiList<{ unread_count?: number }>(
          msgRes.data?.conversations
        );
        unreadMessages = conversations.reduce(
          (acc, conv) => acc + (conv.unread_count || 0),
          0
        );
      } catch {
        // Chat may not be available
      }

      // For admins, fetch pending items
      let pendingBookings = 0;
      let pendingPayments = 0;
      let pendingVerification = 0;
      let pendingQuotes = 0;

      if (user.role === 'admin') {
        try {
          const dashRes = await axiosInstance.get("/api/admin/dashboard");
          const stats = dashRes.data;
          pendingBookings = stats.pending_bookings ?? stats.pendingBookings ?? 0;
          pendingPayments = stats.pending_payments ?? stats.pendingPayments ?? 0;
          pendingVerification = stats.pending_verification ?? stats.pendingVerifications ?? 0;
          pendingQuotes = stats.pending_quotes ?? stats.pendingQuotes ?? 0;
        } catch {
          // Dashboard endpoint may vary
        }
      } else if (user.role === 'provider') {
        try {
          const dashRes = await axiosInstance.get("/api/provider/dashboard");
          const body = dashRes.data?.data ?? dashRes.data;
          const stats = body?.stats ?? body;
          pendingBookings =
            stats?.active_bookings ??
            stats?.pending_orders ??
            stats?.pendingOrders ??
            0;
          const verification = body?.verification;
          if (verification?.needs_action) {
            pendingVerification = 1;
          }
        } catch {}
      } else {
        // Client - pending bookings could be ones needing payment
        try {
          const dashRes = await axiosInstance.get("/api/client/dashboard");
          const stats = dashRes.data;
          pendingBookings = stats.pending_payment_count || 0;
        } catch {}
      }

      setCounts({
        bookings: pendingBookings,
        messages: unreadMessages,
        notifications: unreadNotifs,
        payments: pendingPayments,
        verification: pendingVerification,
        quotes: pendingQuotes,
      });
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Failed to fetch activity counts", err);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCounts();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchCounts, 30000);

    return () => clearInterval(interval);
  }, [fetchCounts]);

  // Listen for real-time updates
  useEffect(() => {
    if (!user || !echo) return;

    const channel = echo.private(`App.Models.User.${user.id}`);
    channel.notification(() => {
      // When any notification comes in, refresh counts
      setCounts(prev => ({ ...prev, notifications: prev.notifications + 1 }));
      // Also do a full refresh after a short delay
      setTimeout(fetchCounts, 1000);
    });

    return () => {
      echo.leave(`App.Models.User.${user.id}`);
    };
  }, [user, echo, fetchCounts]);

  return { counts, refresh: fetchCounts };
}
