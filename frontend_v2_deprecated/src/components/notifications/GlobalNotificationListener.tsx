"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { CheckCircle, Bell, MessageSquare, Star, CreditCard } from "lucide-react";
import React from "react";

export function GlobalNotificationListener() {
  const { user } = useAuth();

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
      } else if (notification.type?.includes('ChatMessageSent')) {
        icon = <MessageSquare className="w-4 h-4 text-blue-500" />;
      } else if (notification.type?.includes('PaymentReceived')) {
        icon = <CreditCard className="w-4 h-4 text-indigo-500" />;
      }

      toast(notification.message || "New activity on Kuba", {
        description: notification.booking_number ? `Booking #${notification.booking_number}` : undefined,
        icon: icon,
        action: notification.url ? {
            label: "View",
            onClick: () => window.location.href = notification.url
        } : undefined,
      });
    });

    return () => {
      echo.leave(`App.Models.User.${user.id}`);
    };
  }, [user]);

  return null;
}
