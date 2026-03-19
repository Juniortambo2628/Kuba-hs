import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Categories } from "@/components/landing/Categories";
import { FeaturedProviders } from "@/components/landing/FeaturedProviders";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { TrustCarousel } from "@/components/shared/TrustCarousel";
import { FeaturedServices } from "@/components/landing/FeaturedServices";
import { CorporateSolutions } from "@/components/landing/CorporateSolutions";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, { cache: 'no-store' });
    const data = await res.json();
    const branding = data.settings?.branding || {};
    const siteName = branding.site_name?.value || "Kuba";
    const siteDescription = branding.site_description?.value || "Professional Home Services Marketplace";

    return {
      title: `${siteName} | ${siteDescription}`,
      description: siteDescription,
    };
  } catch (error) {
    return {
      title: "Kuba - Home Services Marketplace",
      description: "Connect with trusted home service professionals.",
    };
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />
      <Hero />
      <FeaturedServices />
      <About />
      <Categories />
      <Stats />
      <CorporateSolutions />
      <FeaturedProviders />
      <Testimonials />
      <FAQ />
      <CTA />
      <TrustCarousel />
      <Footer />
    </main>
  );
}
