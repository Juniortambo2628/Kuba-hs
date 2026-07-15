"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/echo";
import axiosInstance from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface NotificationData {
  type: string;
  title: string;
  message: string;
  url?: string;
  conversation_id?: string | number;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: string | number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export function NotificationBadge() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // audioRef.current = new Audio("/assets/notification.mp3");
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const echo = getEcho();

    if (echo) {
      const channel = echo.private(`App.Models.User.${user.id}`);

      channel.notification((notification: NotificationData & { id: string; type: string }) => {
        setUnreadCount((prev) => prev + 1);

        const newNotif: Notification = {
          id: notification.id,
          type: notification.type,
          notifiable_type: "App\\Models\\User",
          notifiable_id: user.id,
          data: notification,
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setNotifications((prev) => [newNotif, ...prev].slice(0, 20));

        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        toast.info(notification.title || "New Notification", {
          description: notification.message,
          action: notification.url
            ? {
                label: "View",
                onClick: () => router.push(notification.url!),
              }
            : undefined,
        });
      });

      return () => {
        channel.stopListening(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated");
        echo.leave(`App.Models.User.${user.id}`);
      };
    }
  }, [user, router]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/api/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    }

    try {
      if (!notification.read_at) {
        await axiosInstance.post(`/api/notifications/${notification.id}/read`);
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }

    const rawUrl = notification.data.url;
    let cleanUrl: string | null = null;
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl, "http://localhost");
        cleanUrl = parsed.pathname;
      } catch {
        cleanUrl = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
      }
    }

    if (cleanUrl) {
      router.push(cleanUrl);
    } else if (notification.data.type === "new_message" && notification.data.conversation_id) {
      const role = user?.role === "provider" ? "provider" : "client";
      router.push(`/dashboard/${role}/messages`);
    }
  };

  const handleMarkAllRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    try {
      await axiosInstance.post("/api/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors rounded-xl hover:bg-sky-50 dark:hover:bg-sky-500/10 focus:outline-none">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full animate-in zoom-in">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 rounded-2xl shadow-xl border-gray-100 dark:border-white/5 p-0 overflow-hidden bg-white dark:bg-[#0f1423]"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
          <DropdownMenuLabel className="p-0 m-0 font-black text-xs tracking-widest uppercase text-gray-500">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] font-bold text-sky-600 hover:text-sky-700 uppercase tracking-widest transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto w-full kuba-scroll">
          {notifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center placeholder-gray-400">
              <Bell className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-xs font-bold text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {notifications.map((n) => {
                const isUnread = !n.read_at;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 cursor-pointer flex flex-col items-start focus:bg-sky-50 dark:focus:bg-sky-500/10 hover:bg-sky-50 hover:dark:bg-sky-500/10 rounded-none transition-colors border-l-2 ${
                      isUnread ? "border-sky-500 bg-sky-500/5" : "border-transparent bg-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full gap-2 mb-1">
                      <p
                        className={`text-sm tracking-tight ${isUnread ? "font-black text-gray-900 dark:text-white" : "font-bold text-gray-700 dark:text-gray-300"}`}
                      >
                        {n.data.title || "Notification"}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-xs ${isUnread ? "text-gray-600 dark:text-gray-300 font-medium" : "text-gray-500"}`}>
                      {n.data.message}
                    </p>
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
