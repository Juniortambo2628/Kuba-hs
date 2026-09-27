"use client";

import { Users, Zap } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { VerticalSalesPage } from "@/components/marketing/VerticalSalesPage";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

export default function CooperativesPage() {
  const { getS, getImg } = useCMS();

  return (
    <VerticalSalesPage
      pageId="cooperatives"
      accent="indigo"
      fallbackIcon={Users}
      valueProps={[
        {
          icon: Users,
          title: getS('sections', 'cooperatives_value_prop_1_title', 'Scalable Infrastructure'),
          description: getS('sections', 'cooperatives_value_prop_1_desc', 'Easily onboard hundreds of members into professional home service programs.'),
        },
        {
          icon: Zap,
          title: getS('sections', 'cooperatives_value_prop_3_title', 'Efficient Deployment'),
          description: getS('sections', 'cooperatives_value_prop_3_desc', 'Coordinated service delivery to maximize coverage across member locations.'),
        },
      ]}
      thesis={{
        title: getS('sections', 'cooperatives_thesis_title', 'Stronger Together through Shared Services'),
        body: getS('sections', 'cooperatives_thesis_body', 'We help gated communities and SACCOs leverage collective bargaining power to secure premium home services at negotiated rates, managed via a single platform.'),
        image: {
          src: getImg('sections', 'cooperatives_thesis_image', FALLBACK_IMAGES.cooperative),
          alt: "Community Focus",
          badge: "Community Driven",
          badgeClassName: "text-indigo-400",
          heading: "Collective power for individual comfort",
        },
      }}
      categories={{
        title: getS('sections', 'cooperatives_categories_title', 'Cooperative Service Layers'),
        subtitle: getS('sections', 'cooperatives_categories_subtitle', "Built to grow with your community's needs."),
      }}
      cta={{
        title: getS('sections', 'cooperatives_cta_title', 'Empower your group with Kuba.'),
        subtitle: getS('sections', 'cooperatives_cta_subtitle', 'From apartment clusters to large cooperative unions, we provide the service infrastructure your members deserve.'),
        buttonText: "Start Group Consultation",
        buttonHref: "/quotes/apply?type=cooperative_custom",
        footerText: getS('sections', 'cooperatives_cta_footer', `or call ${getS('general', 'site_phone', '+254 700 000 000')}`),
      }}
    />
  );
}
