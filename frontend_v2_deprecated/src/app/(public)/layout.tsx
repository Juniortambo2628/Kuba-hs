import React from "react";
import SiteHeader from "../(client-components)/(Header)/SiteHeader";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <FooterNav />
      <Footer />
    </div>
  );
}
