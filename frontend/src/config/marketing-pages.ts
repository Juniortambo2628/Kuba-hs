import type { HighImpactHeroProps } from "@/components/shared/HighImpactHero";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

/** CMS hero keys + defaults for public marketing routes (SSOT). */
export const MARKETING_PAGE_HERO = {
  about: {
    cmsKey: "about",
    titleKey: "about_hero_title",
    subtitleKey: "about_hero_subtitle",
    badgeKey: "about_hero_badge",
    defaults: {
      title: "About KUBA",
      subtitle: "Redefining how home services are delivered across the continent.",
      badge: "Who We Are",
    },
  },
  commercial: {
    cmsKey: "commercial",
    titleKey: "commercial_hero_title",
    subtitleKey: "commercial_hero_subtitle",
    badgeKey: "commercial_hero_badge",
    defaults: {
      title: "Services for Modern Organizations",
      subtitle:
        "From facility management to staff wellness, Kuba supports your business operations with verified professionals and consolidated management.",
      badge: "Kuba Business Solutions",
    },
  },
  cooperatives: {
    cmsKey: "cooperatives",
    titleKey: "cooperatives_hero_title",
    subtitleKey: "cooperatives_hero_subtitle",
    badgeKey: "cooperatives_hero_badge",
    defaults: {
      title: "Community Centered & Scalable Solutions",
      subtitle:
        "Serving multiple members under one structure. Kuba empowers cooperatives with negotiated rates and community-driven service allocation.",
      badge: "Kuba Cooperatives & Groups",
    },
  },
  investors: {
    cmsKey: "investors",
    titleKey: "investors_hero_title",
    subtitleKey: "investors_hero_subtitle",
    badgeKey: "investors_hero_badge",
    defaults: {
      title: "Scaling the Future of Home Services.",
      subtitle:
        "Join us in transforming how millions of homeowners connect with verified professionals.",
      badge: "Investor Relations",
    },
  },
  contact: {
    cmsKey: "contact",
    titleKey: "contact_hero_title",
    subtitleKey: "contact_hero_subtitle",
    badgeKey: "contact_hero_badge",
    defaults: {
      title: "Get in Touch",
      subtitle: "Have questions? We're here to help you find the best services for your home.",
      badge: "Get in Touch",
    },
  },
  blog: {
    cmsKey: "journal",
    titleKey: "blog_hero_title",
    subtitleKey: "blog_hero_subtitle",
    badgeKey: "blog_hero_badge",
    defaults: {
      title: "The Kuba Journal",
      subtitle: "Insights, updates, and expert tips from the world of professional services.",
      badge: "Kuba Journal",
    },
  },
  services: {
    cmsKey: "services",
    titleKey: "services_hero_title",
    subtitleKey: "services_hero_subtitle",
    badgeKey: "services_hero_badge",
    imageKey: "services_hero_image",
    defaults: {
      title: "Our Services",
      subtitle: "Find the best help for your home and business from our trusted service categories.",
      badge: "Our Marketplace",
    },
  },
  providers: {
    cmsKey: "providers",
    titleKey: "providers_hero_title",
    subtitleKey: "providers_hero_subtitle",
    badgeKey: "providers_hero_badge",
    imageKey: "providers_hero_image",
    defaults: {
      title: "Our Verified Professionals",
      subtitle: "Connect with top-rated local experts specialized in your selected industry verticals.",
      badge: "Verified Professionals",
      bgImage: FALLBACK_IMAGES.team,
    },
  },
  categories: {
    cmsKey: "categories",
    titleKey: "categories_hero_title",
    subtitleKey: "categories_hero_subtitle",
    badgeKey: "categories_hero_badge",
    imageKey: "categories_hero_image",
    defaults: {
      title: "Service Categories",
      subtitle: "Find the right professional for any task across our specialized industry verticals.",
      badge: "Explore Kuba",
      bgImage: FALLBACK_IMAGES.team,
    },
  },
  quotesApply: {
    cmsKey: "quotes",
    titleKey: "quotes_hero_title",
    subtitleKey: "quotes_hero_subtitle",
    badgeKey: "quotes_hero_badge",
    defaults: {
      title: "Request a Custom Quote",
      subtitle:
        "Scalable, reliable, and professional solutions tailored to your organization's unique requirements.",
      badge: "Enterprise & Groups",
    },
  },
  serviceDetail: {
    cmsKey: "service_detail",
    titleKey: "service_detail_hero_title",
    subtitleKey: "service_detail_hero_subtitle",
    badgeKey: "service_detail_hero_badge",
    imageKey: "service_detail_hero_image",
    defaults: {
      title: "Service Detail",
      subtitle: "Compare professionals, pricing, and book on Kuba.",
      badge: "Service",
      bgImage: FALLBACK_IMAGES.cleaning,
    },
  },
  providerProfile: {
    cmsKey: "provider_profile",
    titleKey: "provider_profile_hero_title",
    subtitleKey: "provider_profile_hero_subtitle",
    badgeKey: "provider_profile_hero_badge",
    imageKey: "provider_profile_hero_image",
    defaults: {
      title: "Professional Profile",
      subtitle: "Explore services, reviews, and book with a verified Kuba professional.",
      badge: "Professional",
      bgImage: FALLBACK_IMAGES.team,
    },
  },
  providerApply: {
    cmsKey: "provider_apply",
    titleKey: "provider_apply_hero_title",
    subtitleKey: "provider_apply_hero_subtitle",
    badgeKey: "provider_apply_hero_badge",
    defaults: {
      title: "Join the Kuba Network",
      subtitle:
        "Apply to offer your services on Kenya's most trusted home services marketplace.",
      badge: "Become a Provider",
    },
  },
} as const satisfies Record<
  string,
  {
    cmsKey: string;
    titleKey: string;
    subtitleKey: string;
    badgeKey: string;
    defaults: { title: string; subtitle: string; badge: string; bgImage?: string };
    imageKey?: string;
  }
>;

export type MarketingPageId = keyof typeof MARKETING_PAGE_HERO;

export function buildMarketingHeroProps(
  pageId: MarketingPageId,
  getS: (group: string, key: string, fallback?: string) => string,
  getImg?: (group: string, key: string, fallback?: string) => string
): HighImpactHeroProps {
  const cfg = MARKETING_PAGE_HERO[pageId];
  const hero: HighImpactHeroProps = {
    title: getS("hero_text", cfg.titleKey, cfg.defaults.title),
    subtitle: getS("hero_text", cfg.subtitleKey, cfg.defaults.subtitle),
    badge: getS("hero_text", cfg.badgeKey, cfg.defaults.badge),
    cmsKey: cfg.cmsKey,
  };
  if (getImg) {
    const imageKey =
      "imageKey" in cfg && cfg.imageKey
        ? (cfg.imageKey as string)
        : `${cfg.cmsKey}_hero_image`;
    const bgDefault =
      "bgImage" in cfg.defaults ? (cfg.defaults.bgImage as string | undefined) : undefined;
    const resolved = getImg("hero_backgrounds", imageKey, "");
    if (resolved) hero.bgImage = resolved;
  } else if ("bgImage" in cfg.defaults && cfg.defaults.bgImage) {
    hero.bgImage = cfg.defaults.bgImage as string;
  }
  return hero;
}
