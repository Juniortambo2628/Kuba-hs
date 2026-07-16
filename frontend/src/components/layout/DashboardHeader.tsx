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
import { dashboardUi } from "@/lib/dashboard-ui";
import { AppBadge } from "@/components/shared/ui/AppBadge";
import { Search, Command } from "lucide-react";
import { toast } from "sonner";

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
    if (user) {
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
    <header className="h-16 sm:h-20 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="lg:hidden text-gray-500 hover:text-foreground" />
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <span className={dashboardUi.chrome.portalLabel}>Admin Portal</span>
            <span className="text-border">|</span>
            <span className={dashboardUi.chrome.portalAccent}>Control Center</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Global Search / Command Palette */}
        {isAdmin ? (
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-all text-muted-foreground group"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className={cn("hidden xs:inline-flex", dashboardUi.chrome.quickJump)}>Quick Jump</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border bg-muted px-2 font-mono text-[9px] font-black opacity-60">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        ) : (
          <div className="mr-1 sm:mr-2">
            <GlobalSearch />
          </div>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <div className="relative">
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-lg hover:bg-accent focus:bg-accent">
                <Bell className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            {unreadCount > 0 && (
              <AppBadge semantic="count" className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center pointer-events-none rounded-full">
                {unreadCount}
              </AppBadge>
            )}
          </div>
          <DropdownMenuContent align="end" className="w-80 mt-1 border border-border shadow-xl rounded-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20">
              <span className="text-sm font-bold text-foreground tracking-tight">Notifications</span>
              <button 
                className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest"
                onClick={async () => {
                  try {
                    await axiosInstance.post("/api/notifications/read-all");
                    fetchNotifications();
                  } catch (err) {
                    toast.error("Failed to mark migrations as read");
                  }
                }}
              >
                Mark all read
              </button>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className={dashboardUi.table.emptyCaps}>Digital Silence</p>
                  <p className="text-[10px] text-muted-foreground/60 font-medium">No new alerts found in your registry</p>
                </div>
              ) : notifications.map((n) => (
                <DropdownMenuItem 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)} 
                  className={`px-4 py-4 cursor-pointer border-b border-border/50 last:border-0 transition-colors ${!n.read_at ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read_at ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="space-y-1">
                      <p className={`text-xs leading-relaxed ${!n.read_at ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {n.data?.message || 'New notification audit entry'}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System Alert
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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

