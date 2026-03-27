import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { getMediaUrl } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/layout/Footer";

// Below-fold sections — lazy loaded for faster TTI
const FeaturedServices = nextDynamic(() => import("@/components/landing/FeaturedServices").then(m => ({ default: m.FeaturedServices })));
const About = nextDynamic(() => import("@/components/landing/About").then(m => ({ default: m.About })));
const Categories = nextDynamic(() => import("@/components/landing/Categories").then(m => ({ default: m.Categories })));
const Stats = nextDynamic(() => import("@/components/landing/Stats").then(m => ({ default: m.Stats })));
const CorporateSolutions = nextDynamic(() => import("@/components/landing/CorporateSolutions").then(m => ({ default: m.CorporateSolutions })));
const FeaturedProviders = nextDynamic(() => import("@/components/landing/FeaturedProviders").then(m => ({ default: m.FeaturedProviders })));
const Testimonials = nextDynamic(() => import("@/components/landing/Testimonials").then(m => ({ default: m.Testimonials })));
const FAQ = nextDynamic(() => import("@/components/landing/FAQ").then(m => ({ default: m.FAQ })));
const CTA = nextDynamic(() => import("@/components/landing/CTA").then(m => ({ default: m.CTA })));
const TrustCarousel = nextDynamic(() => import("@/components/shared/TrustCarousel").then(m => ({ default: m.TrustCarousel })));

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

export const dynamic = 'force-static';

export default async function Home() {
  let heroData = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s build-time timeout
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, { 
      signal: controller.signal,
      next: { revalidate: 3600 } // Revalidate every hour if using a dynamic provider, otherwise ignored for export
    });
    
    clearTimeout(timeoutId);
    
    const data = await res.json();
    const settings = data.settings || {};
    
    // Extract HERO specific data for server-side hydration
    const homeHero = settings.home_hero || [];
    const backgrounds = settings.hero_backgrounds || [];
    
    const getSetting = (group: any[], key: string) => group.find(s => s.key === key);
    
    heroData = {
      title: getSetting(homeHero, 'hero_title')?.value,
      subtitle: getSetting(homeHero, 'hero_subtitle')?.value,
      bgImage: getMediaUrl(getSetting(backgrounds, 'hero_bg_image')?.image_url || getSetting(backgrounds, 'hero_bg_image')?.value),
    };
  } catch (e) {
    console.error("Hero server-side fetch failed", e);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero initialData={heroData} />
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
    </div>
  );
}
