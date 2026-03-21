import React from "react";
import Layout from "@/layout/layout";
import { LayoutProvider } from "@/layout/context/layoutcontext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <React.Suspense>
        <Layout>{children}</Layout>
      </React.Suspense>
    </LayoutProvider>
  );
}
