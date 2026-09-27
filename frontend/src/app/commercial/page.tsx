"use client";

import { BarChart3, Building2, Users } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { VerticalSalesPage } from "@/components/marketing/VerticalSalesPage";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

export default function CommercialPage() {
  const { getS, getImg } = useCMS();

  return (
    <VerticalSalesPage
      pageId="commercial"
      accent="primary"
      fallbackIcon={Building2}
      valueProps={[
        {
          icon: BarChart3,
          title: getS('sections', 'commercial_value_prop_1_title', 'Consolidated Billing'),
          description: getS('sections', 'commercial_value_prop_1_desc', 'One monthly invoice for all services booked across your company locations.'),
        },
        {
          icon: Users,
          title: getS('sections', 'commercial_value_prop_2_title', 'Account Manager'),
          description: getS('sections', 'commercial_value_prop_2_desc', 'A dedicated point of contact to handle all your scheduling and custom requests.'),
        },
      ]}
      thesis={{
        title: getS('sections', 'commercial_thesis_title', 'Consolidated Excellence for Modern Enterprise'),
        body: getS('sections', 'commercial_thesis_body', 'Kuba provides a unified service infrastructure for organizations that demand quality and accountability. From daily janitorial needs to complex facility management, we scale with your business.'),
        image: {
          src: getImg('market_narratives', 'commercial_thesis_image', FALLBACK_IMAGES.office),
          alt: "Commercial Excellence",
          badge: "Institutional Grade",
          badgeClassName: "text-blue-400",
          heading: "Scale your operations with Kuba Business",
        },
      }}
      categories={{
        title: getS('sections', 'commercial_categories_title', 'Commercial Service Categories'),
        subtitle: getS('sections', 'commercial_categories_subtitle', 'Tailored solutions for every industry vertical.'),
      }}
      cta={{
        title: getS('sections', 'commercial_cta_title', 'Need a customized service package?'),
        subtitle: getS('sections', 'commercial_cta_subtitle', 'Our team can design a bespoke solution that fits your specific business requirements and budget.'),
        buttonText: "Start Configuration",
        buttonHref: "/quotes/apply?type=commercial_custom",
        footerText: getS('sections', 'commercial_cta_contact', `or call ${getS('general', 'site_phone', '+254 700 000 000')}`),
      }}
    />
  );
}
