"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — unified under /admin/payments */
export default function AdminFinanceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/payments?tab=overview");
  }, [router]);
  return null;
}
