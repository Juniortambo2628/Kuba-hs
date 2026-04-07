"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { CheckCircle, Bell, MessageSquare, Star, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * Sanitize notification URLs: strip any absolute backend URL and return a relative path.
 */
function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Strip absolute backend URLs (e.g. http://localhost:8000/dashboard -> /dashboard)
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

export function GlobalNotificationListener() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const echo = getEcho();
    if (!echo) return;

    // Listen to private user channel for general Laravel Notifications
    const channel = echo.private(`App.Models.User.${user.id}`);

    channel.notification((notification: any) => {
      console.log("Real-time notification received:", notification);
      
      let icon = <Bell className="w-4 h-4 text-sky-600" />;
      
      if (notification.type?.includes('BookingStatusUpdated')) {
        icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
      } else if (notification.type?.includes('NewReviewReceived')) {
        icon = <Star className="w-4 h-4 text-amber-500" />;
      } else if (notification.type?.includes('ChatMessageSent') || notification.type?.includes('NewMessageReceived')) {
        icon = <MessageSquare className="w-4 h-4 text-blue-500" />;
      } else if (notification.type?.includes('PaymentReceived')) {
        icon = <CreditCard className="w-4 h-4 text-indigo-500" />;
      }

      const cleanUrl = sanitizeUrl(notification.url);

      toast(notification.title || notification.message || "New activity on Kuba", {
        description: notification.message || (notification.booking_number ? `Booking #${notification.booking_number}` : undefined),
        icon: icon,
        action: cleanUrl ? {
            label: "View",
            onClick: () => router.push(cleanUrl),
        } : undefined,
      });
    });

    return () => {
      echo.leave(`App.Models.User.${user.id}`);
    };
  }, [user, router]);

  return null;
}
