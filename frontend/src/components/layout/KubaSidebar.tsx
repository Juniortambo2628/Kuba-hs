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
import { LogOut } from "lucide-react";
import { ADMIN_SIDEBAR_ITEMS } from "@/config/admin-navigation";
import { CLIENT_SIDEBAR_ITEMS, PROVIDER_SIDEBAR_ITEMS } from "@/config/dashboard-navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCMS } from "@/contexts/CMSContext";
import { useActivityCounts } from "@/hooks/useActivityCounts";
import Image from "next/image";

export function KubaSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { getImg } = useCMS();
  const { counts } = useActivityCounts();

  const items =
    user?.role === "admin"
      ? ADMIN_SIDEBAR_ITEMS
      : user?.role === "provider"
        ? PROVIDER_SIDEBAR_ITEMS
        : CLIENT_SIDEBAR_ITEMS;

  return (
    <Sidebar className="border-r border-gray-200 dark:border-white/5 bg-slate-50 dark:bg-background transition-colors duration-300">
      <SidebarHeader className="px-6 py-8">
        <Link href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 duration-300">
          <div className="relative h-8 w-32 dark:hidden">
            <Image
              src={getImg("identity", "logo_light", "/assets/Kuba-Header-footter-Logo-for-Light-Mode.png")}
              alt="KUBA"
              fill
              sizes="(max-width: 768px) 128px, 128px"
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-8 w-32 hidden dark:block">
            <Image
              src={getImg("identity", "logo_dark", "/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png")}
              alt="KUBA"
              fill
              sizes="(max-width: 768px) 128px, 128px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => {
                const isActive = pathname === item.url;
                const badgeCount = item.badgeKey ? counts[item.badgeKey] || 0 : 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        h-12 px-4 rounded-xl transition-all duration-300 border border-transparent
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3.5">
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${isActive ? "scale-110 text-white" : ""} transition-transform`}
                        />
                        <span className="text-[13px] font-bold tracking-tight flex-1">{item.title}</span>
                        {badgeCount > 0 && (
                          <span
                            className={`
                            min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums
                            ${isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}
                          `}
                          >
                            {badgeCount > 99 ? "99+" : badgeCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-6 pt-4 border-t border-gray-200 dark:border-white/5">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3.5 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-[13px] font-bold tracking-tight group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Sign out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
