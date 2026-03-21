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
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Settings, 
  LogOut,
  Briefcase,
  User,
  Plus,
  ShieldCheck,
  Clock,
  ClipboardList,
  MessageSquare,
  Star,
  Calendar,
  PenTool,
  Mail,
  TrendingUp,
  DollarSign,
  FileText,
  Monitor,
  Users,
  Grid3X3,
  Gift,
  HelpCircle,
  Quote,
  Inbox
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCMS } from "@/hooks/useCMS";

const clientItems = [
  { title: "Overview", url: "/dashboard/client", icon: LayoutDashboard },
  { title: "Bookings", icon: Calendar, url: "/dashboard/client/bookings" },
  { title: "Services", icon: Briefcase, url: "/dashboard/client/services" },
  { title: "Messages", icon: MessageSquare, url: "/dashboard/client/messages" },
  { title: "Loyalty", icon: Star, url: "/dashboard/client/loyalty" },
  { title: "Profile", icon: User, url: "/dashboard/client/profile" },
];

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
  { title: "Bookings", url: "/admin/bookings", icon: CalendarCheck },
  { title: "Quotes", url: "/admin/quotes", icon: Quote },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verification", url: "/admin/workforce/verification", icon: ShieldCheck },
  { title: "Categories", url: "/admin/categories", icon: Grid3X3 },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Loyalty", url: "/admin/loyalty", icon: Gift },
  { title: "Blog", url: "/admin/blog", icon: PenTool },
  { title: "Investors", url: "/admin/investors", icon: Briefcase },
  { title: "Feedback", url: "/admin/feedback", icon: MessageSquare },
  { title: "Reports", url: "/admin/reports", icon: ClipboardList },
  { title: "Email", url: "/admin/email-templates", icon: Mail },
  { title: "Contact", url: "/admin/contact", icon: Inbox },
  { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "Platform CMS", url: "/admin/settings", icon: Settings },
];

const providerItems = [
  { title: "Dashboard", url: "/dashboard/provider", icon: LayoutDashboard },
  { title: "Services", url: "/dashboard/provider/services", icon: Briefcase },
  { title: "Activity", url: "/dashboard/provider/availability", icon: Clock },
  { title: "Orders", url: "/dashboard/provider/bookings", icon: ClipboardList },
  { title: "Verification", url: "/dashboard/provider/verification", icon: ShieldCheck },
  { title: "Messages", url: "/dashboard/provider/messages", icon: MessageSquare },
  { title: "Reviews", url: "/dashboard/provider/reviews", icon: Star },
  { title: "Profile", url: "/dashboard/provider/profile", icon: User },
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <SidebarHeader className="px-6 py-8">
        <Link href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 duration-300">
            <img 
              src="/assets/Kuba-Header-footter-Logo-for-Light-Mode.png" 
              alt="KUBA" 
              className="h-8 w-auto object-contain dark:hidden" 
            />
            <img 
              src="/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png" 
              alt="KUBA" 
              className="h-8 w-auto object-contain hidden dark:block" 
            />
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        h-11 px-4 rounded-xl transition-all duration-200 border border-transparent
                        ${isActive 
                          ? "bg-foreground text-background font-bold shadow-sm shadow-foreground/10 border-foreground/5" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3.5">
                        <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'scale-110' : ''} transition-transform`} />
                        <span className="text-[13px] font-bold tracking-tight">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 pb-6 pt-4 border-t border-sidebar-border">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3.5 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest group"
        >
          <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
