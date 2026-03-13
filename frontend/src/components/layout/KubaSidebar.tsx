"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Gift, 
  Settings, 
  Users, 
  CreditCard, 
  BarChart, 
  MessageSquare, 
  FileText,
  LogOut,
  Calendar,
  Briefcase,
  Star,
  User,
  Home, 
  Plus,
  ShieldCheck,
  Clock,
  ClipboardList,
  PenTool,
  Mail
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCMS } from "@/hooks/useCMS";

const clientItems = [
  { title: "OVERVIEW", url: "/dashboard/client", icon: LayoutDashboard },
  { title: "MY BOOKINGS", icon: Calendar, url: "/dashboard/client/bookings" },
  { title: "MY SERVICES", icon: Briefcase, url: "/dashboard/client/services" },
  { title: "MESSAGES", icon: MessageSquare, url: "/dashboard/client/messages" },
  { title: "LOYALTY PROGRAM", icon: Star, url: "/dashboard/client/loyalty" },
  { title: "PROFILE SETTINGS", icon: User, url: "/dashboard/client/profile" },
];

const adminItems = [
    { title: "OVERVIEW", url: "/admin", icon: LayoutDashboard },
    { title: "BOOKINGS", url: "/admin/bookings", icon: CalendarCheck },
    { title: "USERS", url: "/admin/users", icon: ShieldCheck },
    { title: "CATEGORIES", url: "/admin/categories", icon: LayoutDashboard },
    { title: "INVESTORS", url: "/admin/investors", icon: Briefcase },
    { title: "EMAIL TEMPLATES", url: "/admin/email-templates", icon: Mail },
    { title: "CMS", url: "/admin/cms", icon: PenTool },
    { title: "SETTINGS", url: "/admin/settings", icon: Settings },
];

const providerItems = [
    { title: "OVERVIEW", url: "/dashboard/provider", icon: LayoutDashboard },
    { title: "MY SERVICES", url: "/dashboard/provider/services", icon: Briefcase },
    { title: "AVAILABILITY", url: "/dashboard/provider/availability", icon: Clock },
    { title: "WORK ORDERS", url: "/dashboard/provider/bookings", icon: ClipboardList },
    { title: "MESSAGES", url: "/dashboard/provider/messages", icon: MessageSquare },
    { title: "REVIEWS", url: "/dashboard/provider/reviews", icon: Star },
    { title: "PROFILE", url: "/dashboard/provider/profile", icon: User },
];

export function KubaSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { getImg } = useCMS();
  
  const items = user?.role === 'admin' 
    ? adminItems 
    : user?.role === 'provider' 
        ? providerItems 
        : clientItems;

  return (
    <Sidebar className="border-r border-gray-100 bg-white shadow-sm">
      <SidebarHeader className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
             <img src={getImg('branding', 'site_logo', '/logo.png')} alt="KUBA" className="h-16 w-auto object-contain" />
          </Link>
          
          <Button 
            className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-200 flex items-center justify-center gap-2 mt-4"
            asChild
          >
            <Link href="/services">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                </div>
                <span>BOOK APPOINTMENT</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black text-gray-400 tracking-[0.2em] px-4 mb-4">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        h-12 px-4 rounded-xl transition-all duration-200
                        ${isActive 
                          ? "bg-gray-100/50 text-sky-600" 
                          : "text-gray-400 hover:bg-gray-50/80 hover:text-[#1E293B]"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-sky-600" : ""}`} />
                        <span className="text-[11px] font-black tracking-wider uppercase">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-50 flex flex-col gap-4">
        {/* Profile and Logout moved to Navbar profile dropdown */}
      </SidebarFooter>
    </Sidebar>
  );
}
