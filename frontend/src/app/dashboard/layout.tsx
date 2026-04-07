"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { KubaSidebar } from "@/components/layout/KubaSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { mutate } from "swr";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, pathname, router]);

  useEffect(() => {
    if (user) {
      const echo = getEcho();
      if (echo) {
        echo.leave(`user.${user.id}`);
        echo.private(`user.${user.id}`)
          .listen('.booking.updated', (e: any) => {
            toast.info(`Booking #${e.booking.booking_number} has been updated to ${e.booking.status}`);
            
            // Trigger global SWR mutations to sync dashboards
            mutate('/api/client/dashboard');
            mutate('/api/provider/dashboard');
            
            // Re-fetch specific booking details if on a detail page
            mutate((key) => typeof key === 'string' && key.includes('/api/bookings/'));
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <KubaSidebar />
      <main className="flex-1 bg-background min-h-screen flex flex-col">
        {/* Top Header */}
        <DashboardHeader />

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
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
  );
}
