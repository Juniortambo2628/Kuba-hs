import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, CreditCard, Settings, CalendarCheck, PenTool, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Finance",
    url: "/admin/finance",
    icon: TrendingUp,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Feedback",
    url: "/admin/feedback",
    icon: Star,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 dark:bg-zinc-950">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-3 px-6 py-8">
            <Link href="/" className="group transition-transform hover:scale-105 duration-300">
              <img 
                src="/logos/Kuba-Header-Footer-Logo-for-Dark-Mode.png" 
                alt="KUBA" 
                className="h-8 w-auto object-contain" 
              />
            </Link>
          </div>
          <SidebarGroupLabel className="px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Management Terminal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-4 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-all font-bold text-[13px] uppercase tracking-tight border border-transparent hover:border-border/30">
                    <a href={item.url} className="flex items-center gap-3.5">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
