"use client";

import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { UserAccountDropdown } from "@/components/shared/UserAccountDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { cn } from "@/lib/utils";
import { Search, Command } from "lucide-react";

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export function DashboardHeader({ isAdmin = false }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (user && !isAdmin) {
      fetchNotifications();
    }
  }, [user, isAdmin]);

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

  if (!mounted) return null;

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="lg:hidden text-gray-500 hover:text-foreground" />
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <span className="text-[11px] font-bold tracking-tight uppercase">Admin Portal</span>
            <span className="text-border">|</span>
            <span className="text-[11px] font-bold text-primary tracking-tight uppercase">Control Center</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Global Search / Command Palette */}
        {isAdmin ? (
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-all text-muted-foreground group mr-4"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-tight">Quick Jump</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border bg-muted px-2 font-mono text-[9px] font-black opacity-60">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        ) : (
          <div className="hidden sm:block mr-2">
            <GlobalSearch />
          </div>
        )}

        {/* Notifications (Client/Provider only) */}
        {!isAdmin && (
          <DropdownMenu>
            <div className="relative">
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-lg hover:bg-accent">
                  <Bell className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[9px] font-bold text-primary-foreground rounded-full flex items-center justify-center pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <DropdownMenuContent align="end" className="w-80 mt-1">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold text-foreground tracking-tight">Notifications</span>
                <button className="text-xs text-primary hover:underline font-semibold" onClick={async () => {
                  await axiosInstance.post("/api/notifications/read-all");
                  fetchNotifications();
                }}>Mark all read</button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm font-semibold text-muted-foreground text-center py-6">No notifications</p>
                ) : notifications.map((n) => (
                  <DropdownMenuItem key={n.id} onClick={() => markAsRead(n.id)} className={`px-3 py-2.5 cursor-pointer ${!n.read_at ? 'bg-accent' : ''}`}>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{n.data?.message || 'New notification'}</p>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Theme Toggle */}
        <ThemeToggle 
          variant={isAdmin ? "solid" : "ghost"} 
          className={cn(isAdmin && "p-2.5 shadow-md shadow-foreground/10 border border-border")} 
        />



        {/* User Dropdown */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200 dark:border-white/5">
          <UserAccountDropdown variant="dashboard" align="end" />
        </div>
      </div>
    </header>
  );
}

