"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingButton } from "@/components/shared/LandingButton";
import { LandingSection } from "@/components/landing/LandingSection";
import { uiPrimitives } from "@/lib/ui-primitives";
import { ServiceCard, type ServiceCardData } from "@/components/marketplace";
import { serviceDetailHref } from "@/lib/service-urls";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";

const PREVIEW_LIMIT = 3;

export function FeaturedServices() {
  const { getS } = useCMS();
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const servicesTitle = getS("landing_sections", "services_title", "Just Added");
  const { part1: svcTitle1, part2: svcTitle2 } = landingTitleParts(servicesTitle, "Added");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axiosInstance.get("/api/featured-services");
        setServices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!isLoading && services.length === 0) return null;

  const preview = services.slice(0, PREVIEW_LIMIT);

  return (
    <LandingSection variant="default">
        <LandingSectionHeader
          badge={getS("landing_sections", "services_badge", "New Services")}
          title={<LandingGradientTitle part1={svcTitle1} part2={svcTitle2} />}
          subtitle={getS(
            "landing_sections",
            "services_subtitle",
            "Check out these new services from our top-rated pros."
          )}
          align="center"
        />

        <div className={uiPrimitives.layout.grid3}>
          {isLoading
            ? Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/5] w-full min-h-[16rem] rounded-2xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : preview.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <ServiceCard service={service} href={serviceDetailHref(service)} className="h-full" />
                </motion.div>
              ))}
        </div>

        <div className="mt-12 flex justify-center">
          <LandingButton asChild size="md">
            <Link href="/services">
              See all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </LandingButton>
        </div>
    </LandingSection>
  );
}
