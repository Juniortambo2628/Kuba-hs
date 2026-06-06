"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useDashboardBookingSync } from "@/hooks/useDashboardBookingSync";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const isProviderArea = pathname?.startsWith("/dashboard/provider");
    const isClientArea = pathname?.startsWith("/dashboard/client");

    if (isProviderArea && user.role !== "provider") {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard/client");
      return;
    }

    if (isClientArea && user.role !== "customer") {
      router.replace(
        user.role === "admin" ? "/admin" : "/dashboard/provider"
      );
    }
  }, [user, isLoading, pathname, router]);

  useDashboardBookingSync(user?.id, !!user && user.role !== "admin");

  if (isLoading) {
    return <DashboardShell isLoading>{null}</DashboardShell>;
  }

  if (!user) return null;

  return (
    <DashboardShell contentPadding="lg">{children}</DashboardShell>
  );
}
