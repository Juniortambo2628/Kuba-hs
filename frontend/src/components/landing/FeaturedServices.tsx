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
import { ServiceCategoryCard, type ServiceCategoryCardData } from "@/components/marketplace";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";

const CATEGORY_ORDER = [
  "Cleaning & Maintenance",
  "Electrical",
  "Health & Wellness",
  "Personal & Grooming",
  "Education & Training",
  "Food & Hospitality",
  "Professional Services",
  "Legal Services",
  "Technology & IT Services",
  "HR Services",
  "Financial Services",
  "Commercial Real Estate",
  "Commercial Logistics",
];

export function FeaturedServices() {
  const { getS } = useCMS();
  const [categories, setCategories] = useState<ServiceCategoryCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const servicesTitle = getS("landing_sections", "services_title", "Just Added");
  const { part1: svcTitle1, part2: svcTitle2 } = landingTitleParts(servicesTitle, "Added");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        const data = response.data.data ?? [];
        const sorted = [...data].sort((a, b) => {
          const indexA = CATEGORY_ORDER.indexOf(a.name);
          const indexB = CATEGORY_ORDER.indexOf(b.name);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return a.name.localeCompare(b.name);
        });
        setCategories(sorted);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (!isLoading && categories.length === 0) return null;

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

        <div className="w-full relative px-12 sm:px-16 lg:px-20">
          {isLoading ? (
            <div className={uiPrimitives.layout.grid3}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[16/11] w-full rounded-[1.75rem]" />
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {categories.map((category, i) => (
                  <CarouselItem key={category.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="h-full"
                    >
                      <ServiceCategoryCard
                        category={category}
                        href={`/services?category=${encodeURIComponent((category as any).slug || category.id)}`}
                        layout="grid"
                        className="h-full"
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="w-12 h-12 -left-4 sm:-left-12 lg:-left-16 xl:-left-20 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background shadow-sm hover:scale-110 transition-all duration-300" />
              <CarouselNext className="w-12 h-12 -right-4 sm:-right-12 lg:-right-16 xl:-right-20 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background shadow-sm hover:scale-110 transition-all duration-300" />
            </Carousel>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <LandingButton asChild size="md">
            <Link href="/services">
              View all categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </LandingButton>
        </div>
    </LandingSection>
  );
}
