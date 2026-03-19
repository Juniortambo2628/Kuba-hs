"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { KubaSidebar } from "@/components/layout/KubaSidebar";
import { Bell, ChevronDown, Settings, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axios";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchNotifications();

      const echo = getEcho();
      if (echo) {
        echo.leave(`user.${user.id}`);
        echo.private(`user.${user.id}`)
          .listen('.booking.updated', (e: any) => {
             toast.info(`Booking #${e.booking.booking_number} has been updated to ${e.booking.status}`);
             fetchNotifications();
          });
      }
    }

    return () => {
       if (user) {
         const echo = getEcho();
         if (echo) echo.leave(`user.${user.id}`);
       }
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/api/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.post(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const pathname = usePathname();

  return (
    <SidebarProvider>
      <KubaSidebar />
      <main className="flex-1 bg-background min-h-screen flex flex-col">
        {/* Top Header */}
        <DashboardHeader />

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </SidebarProvider>
  );
}
