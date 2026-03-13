"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { KubaSidebar } from "@/components/layout/KubaSidebar";
import { Bell, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axios";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchNotifications();

      // Set up WebSocket listener for this user
      const echo = getEcho();
      if (echo) {
        // Leave previous channel if any (handles fast refresh/re-renders)
        echo.leave(`user.${user.id}`);
        
        echo.private(`user.${user.id}`)
          .listen('.booking.updated', (e: any) => {
             console.log("Real-time booking update received:", e);
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

  return (
    <SidebarProvider>
      <KubaSidebar />
      <main className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'provider' ? 'Provider Portal' : 'Client Portal'}
                </span>
                <span className="text-gray-200">|</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-sky-600">Welcome Back</span>
            </div>
          </div>

           <div className="flex items-center gap-6">
            {mounted && (
              <DropdownMenu>
                <div className="relative">
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 text-gray-400 hover:text-sky-600 transition-colors outline-none">
                      <Bell className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-sky-600 text-[8px] font-black text-white rounded-full border-2 border-white flex items-center justify-center pointer-events-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <DropdownMenuContent align="end" className="w-80 mt-2 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Notifications</h3>
                    <button className="text-[8px] font-black uppercase tracking-widest text-sky-600" onClick={async () => {
                      await axiosInstance.post("/api/notifications/read-all");
                      fetchNotifications();
                    }}>Clear All</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-gray-400 text-center py-4 italic font-bold">No new alerts</p>
                    ) : notifications.map((n) => {
                      return (
                        <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 rounded-xl cursor-pointer transition-all ${!n.read_at ? 'bg-sky-50' : 'hover:bg-gray-50'}`}>
                          <p className="text-[10px] font-bold text-[#1E293B] leading-tight">{n.data?.message || 'New notification'}</p>
                          <p className="text-[8px] text-gray-400 mt-1 font-black uppercase tracking-tighter">
                            {new Date(n.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-[#1E293B] uppercase leading-tight">{user?.name}</p>
                <p className="text-[9px] font-bold text-sky-600 uppercase tracking-tighter leading-tight mt-0.5">
                  {user?.role === 'provider' ? 'Merchant Tier' : 'Client Tier'}
                </p>
              </div>
              
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 outline-none group">
                      <Avatar className="w-10 h-10 border-2 border-gray-50 group-hover:border-red-100 transition-colors">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-sky-50 text-sky-600 font-bold text-xs uppercase">
                          {user?.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-sky-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-sky-600" onClick={() => logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
