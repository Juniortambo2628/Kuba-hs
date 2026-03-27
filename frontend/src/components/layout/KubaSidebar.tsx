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
  Inbox,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCMS } from "@/contexts/CMSContext";
import Image from "next/image";

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
  { title: "Compliance", url: "/admin/compliance", icon: ClipboardList },
  { title: "Categories", url: "/admin/categories", icon: Grid3X3 },
  { title: "Base Services", url: "/admin/services", icon: Briefcase },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Loyalty", url: "/admin/loyalty", icon: Gift },
  { title: "Promotions", url: "/admin/promotions", icon: Ticket },
  { title: "Blog", url: "/admin/blog", icon: PenTool },
  { title: "Investors", url: "/admin/investors", icon: Briefcase },
  { title: "Messaging Hub", url: "/admin/messages", icon: Inbox },
  { title: "Reports", url: "/admin/reports", icon: ClipboardList },
  { title: "Email", url: "/admin/email-templates", icon: Mail },
  { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "Trust Partners", url: "/admin/trust-partners", icon: ShieldCheck },
  { title: "Page Features", url: "/admin/page-features", icon: Monitor },
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
    <Sidebar className="border-r border-gray-200 dark:border-white/5 bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Logo */}
      <SidebarHeader className="px-6 py-8">
        <Link href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 duration-300">
            <div className="relative h-8 w-32 dark:hidden">
              <Image 
                src={getImg('identity', 'logo_light', '/assets/Kuba-Header-footter-Logo-for-Light-Mode.png')} 
                alt="KUBA" 
                fill
                sizes="(max-width: 768px) 128px, 128px"
                className="object-contain" 
                priority
              />
            </div>
            <div className="relative h-8 w-32 hidden dark:block">
              <Image 
                src={getImg('identity', 'logo_dark', '/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png')} 
                alt="KUBA" 
                fill
                sizes="(max-width: 768px) 128px, 128px"
                className="object-contain" 
                priority
              />
            </div>
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
                        h-12 px-4 rounded-xl transition-all duration-300 border border-transparent
                        ${isActive 
                          ? "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3.5">
                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'scale-110 text-white' : ''} transition-transform`} />
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
      <SidebarFooter className="px-4 pb-6 pt-4 border-t border-gray-200 dark:border-white/5">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3.5 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-[13px] font-bold tracking-tight group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
