"use client";

import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Home, LayoutDashboard, Sun, Moon, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

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
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="lg:hidden text-muted-foreground hover:text-foreground" />
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium">Admin Portal</span>
            <span className="text-border">|</span>
            <span className="text-xs font-medium text-primary">Control Center</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
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

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`transition-colors rounded-lg flex items-center justify-center ${isAdmin ? 'p-2.5 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl shadow-md shadow-foreground/10 border border-border' : 'p-2 text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className={isAdmin ? "w-4 h-4" : "w-5 h-5"} /> : <Moon className={isAdmin ? "w-4 h-4" : "w-5 h-5"} />}
        </button>

        {/* Settings shortcut (Client/Provider only) */}
        {!isAdmin && (
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent hidden md:flex">
            <Settings className="w-5 h-5" />
          </button>
        )}

        {/* User Dropdown */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none group p-1.5 rounded-lg hover:bg-accent transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-tight tracking-tight">{user?.name}</p>
                  <p className="text-xs font-medium text-muted-foreground leading-tight capitalize">{user?.role}</p>
                </div>
                {isAdmin ? (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ) : (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback className="bg-muted text-primary font-semibold text-xs">
                      {user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 mt-1">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold tracking-tight">{user?.name}</p>
                <p className="text-xs font-semibold text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer font-semibold">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-semibold">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Client Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="cursor-pointer font-semibold" asChild>
                    <Link href={`/dashboard/${user?.role}/profile`}>Profile</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer font-semibold text-red-500 focus:text-red-500">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
