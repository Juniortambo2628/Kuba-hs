import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { Hero } from "@/components/landing/Hero";
import { brandingFromSettings, getSSRSettings, homeHeroFromSettings } from "@/lib/ssr-settings";

// Below-fold sections — lazy loaded for faster TTI
const FeaturedServices = nextDynamic(() =>
  import("@/components/landing/FeaturedServices").then((m) => ({ default: m.FeaturedServices }))
);
const LandingAboutStory = nextDynamic(() =>
  import("@/components/landing/LandingAboutStory").then((m) => ({ default: m.LandingAboutStory }))
);
const About = nextDynamic(() =>
  import("@/components/landing/About").then((m) => ({ default: m.About }))
);
const Categories = nextDynamic(() =>
  import("@/components/landing/Categories").then((m) => ({ default: m.Categories }))
);
const CorporateSolutions = nextDynamic(() =>
  import("@/components/landing/CorporateSolutions").then((m) => ({ default: m.CorporateSolutions }))
);
const FeaturedProviders = nextDynamic(() =>
  import("@/components/landing/FeaturedProviders").then((m) => ({ default: m.FeaturedProviders }))
);
const Testimonials = nextDynamic(() =>
  import("@/components/landing/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const FAQ = nextDynamic(() =>
  import("@/components/landing/FAQ").then((m) => ({ default: m.FAQ }))
);
const CTA = nextDynamic(() =>
  import("@/components/landing/CTA").then((m) => ({ default: m.CTA }))
);
const TrustCarousel = nextDynamic(() =>
  import("@/components/shared/TrustCarousel").then((m) => ({ default: m.TrustCarousel }))
);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSSRSettings();
  const { siteName, siteDescription } = brandingFromSettings(settings);

  return {
    title: `${siteName} | ${siteDescription}`,
    description: siteDescription,
  };
}

export default async function Home() {
  const settings = await getSSRSettings();
  const heroData = homeHeroFromSettings(settings);

  return (
    <MarketingShell>
      <Hero initialData={heroData} />
      <LandingAboutStory />
      <FeaturedServices />
      <About />
      <Categories />
      <CorporateSolutions />
      <FeaturedProviders />
      <Testimonials />
      <FAQ />
      <CTA />
      <TrustCarousel />
    </MarketingShell>
  );
}
