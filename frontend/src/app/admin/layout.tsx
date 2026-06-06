"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminCommandPalette } from "@/components/shared/AdminCommandPalette";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login");

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!user || user.role !== "admin")) {
      router.push("/admin/login?redirect=/admin");
    }
  }, [user, isLoading, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  const showLoader = isLoading || !user || user.role !== "admin";

  return (
    <DashboardShell
      headerAdmin
      headerSlot={<AdminCommandPalette />}
      contentClassName="admin-content-area"
      isLoading={showLoader}
    >
      {children}
    </DashboardShell>
  );
}
