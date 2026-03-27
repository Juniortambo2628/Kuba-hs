"use client";

import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { KubaSidebar } from "@/components/layout/KubaSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { AdminCommandPalette } from "@/components/shared/AdminCommandPalette";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login");

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!user || user.role !== 'admin')) {
      router.push("/admin/login?redirect=/admin");
    }
  }, [user, isLoading, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  const showLoader = isLoading || !user || user.role !== 'admin';

  if (showLoader) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent"></div>
          <p className="text-xs font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <KubaSidebar />
      <AdminCommandPalette />
      <main className="flex-1 bg-background min-h-screen flex flex-col">
        {/* Header */}
        <DashboardHeader isAdmin={true} />

        {/* Page Content */}
        <div className="admin-content-area p-4 md:p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </SidebarProvider>
  )
}
