"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingButton } from "@/components/shared/LandingButton";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingSection } from "@/components/landing/LandingSection";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ServiceCategoryCard,
  type ServiceCategoryCardData,
} from "@/components/marketplace";
import { serviceDetailHref } from "@/lib/service-urls";
import { cn } from "@/lib/utils";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";

interface Category extends ServiceCategoryCardData {
  slug: string;
  services: Array<{
    id: string;
    name: string;
    slug?: string;
    description?: string;
  }>;
}

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

const MAX_SERVICES = 8;

function categoryHref(slug: string) {
  return `/services?category=${encodeURIComponent(slug)}`;
}

function CategoryServicesPanel({ category }: { category: Category }) {
  const services = category.services?.slice(0, MAX_SERVICES) ?? [];

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-[1.75rem]",
        "border border-border/50 bg-muted/25 dark:bg-muted/15",
        "p-6 md:p-8 h-full"
      )}
    >
      <div className="flex items-center justify-between gap-4 mb-5 md:mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Services in {category.name}
        </h3>
        <Link
          href={categoryHref(category.slug)}
          className="text-sm font-semibold text-primary hover:underline shrink-0"
        >
          View all
        </Link>
      </div>

      {services.length > 0 ? (
        <ul className="divide-y divide-border/40 -mx-1 px-1">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={serviceDetailHref({
                  ...service,
                  category_slug: category.slug,
                } as any)}
                className="group flex items-center gap-3 py-3 md:py-3.5 text-base"
              >
                <span className="min-w-0 flex-1 font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {service.name}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-muted-foreground text-center py-8 px-4 leading-relaxed">
          Services coming soon in this category.
        </p>
      )}

      <LandingButton asChild variant="secondary" size="sm" className="mt-5 md:mt-6 w-fit mt-auto">
        <Link href={categoryHref(category.slug)}>
          Explore {category.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </LandingButton>
    </div>
  );
}

export function Categories() {
  const { getS } = useCMS();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  const categoriesTitle = getS(
    "landing_sections",
    "categories_title",
    "Explore service categories"
  );
  const { part1: catTitle1, part2: catTitle2 } = landingTitleParts(
    categoriesTitle,
    "categories"
  );

  const slideCount = categories.length;
  const activeCategory = slideCount > 0 ? categories[slideIndex] : null;

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % slideCount);
  }, [slideCount]);

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
        setSlideIndex(0);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slideIndex >= slideCount && slideCount > 0) {
      setSlideIndex(0);
    }
  }, [slideIndex, slideCount]);

  return (
    <LandingSection variant="default" className="!py-12 md:!py-16">
      <div className="flex flex-col gap-8 md:gap-10">
        <LandingSectionHeader
          badge={getS("landing_sections", "categories_badge", "Categories")}
          title={<LandingGradientTitle part1={catTitle1} part2={catTitle2} />}
          subtitle={
            <span className="block text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-1">
              {getS(
                "landing_sections",
                "categories_subtitle",
                "Swipe through categories and jump straight into the services you need."
              )}
            </span>
          }
          align="center"
          className="!mb-2 md:!mb-4"
          titleClassName="!mb-4 md:!mb-5"
        />

        {isLoading ? (
          <Skeleton className="w-full min-h-[320px] rounded-[1.75rem]" />
        ) : slideCount === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">
            No categories available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
            <div className="lg:col-span-1 space-y-1 max-h-[500px] overflow-y-auto pr-2 subtle-scroll">
              {categories.map((category, idx) => (
                <button
                  key={category.id}
                  onClick={() => setSlideIndex(idx)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                    idx === slideIndex
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-background hover:bg-muted border-border text-foreground hover:border-primary/30"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 h-full">
              <AnimatePresence mode="wait" initial={false}>
                {activeCategory && (
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <CategoryServicesPanel category={activeCategory} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <LandingButton asChild variant="secondary" size="md">
            <Link href="/services">
              View all services
              <ChevronRight className="h-4 w-4" />
            </Link>
          </LandingButton>
        </div>
      </div>
    </LandingSection>
  );
}
