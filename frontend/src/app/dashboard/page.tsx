"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === 'admin') {
        router.replace("/admin");
      } else if (user.role === 'provider') {
        router.replace("/dashboard/provider");
      } else {
        router.replace("/dashboard/client");
      }
    }
  }, [authLoading, user, router]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </main>
  );
}

