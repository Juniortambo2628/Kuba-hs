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

const MAX_SERVICES = 8;

function categoryHref(slug: string) {
  return `/services?category=${encodeURIComponent(slug)}`;
}

function CategorySlide({ category }: { category: Category }) {
  const services = category.services?.slice(0, MAX_SERVICES) ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 lg:gap-10 items-start">
      <div
        className={cn(
          "w-full [&_a]:block",
          "[&_article>div:first-child]:aspect-[16/11] [&_article>div:first-child]:max-h-none"
        )}
      >
        <ServiceCategoryCard
          category={category}
          href={categoryHref(category.slug)}
          layout="grid"
          className="w-full"
        />
      </div>

      <div
        className={cn(
          "flex flex-col w-full rounded-[1.75rem]",
          "border border-border/50 bg-muted/25 dark:bg-muted/15",
          "p-6 md:p-8"
        )}
      >
        <div className="flex items-center justify-between gap-4 mb-5 md:mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            Services in this category
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
                  })}
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

        <LandingButton asChild variant="secondary" size="sm" className="mt-5 md:mt-6 w-fit">
          <Link href={categoryHref(category.slug)}>
            Explore {category.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </LandingButton>
      </div>
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
        setCategories(data);
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
          <div className="w-full">
            <div className="relative w-full overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {activeCategory && (
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <CategorySlide category={activeCategory} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {slideCount > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10 md:mt-12">
                <button
                  type="button"
                  onClick={goPrev}
                  className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Previous category"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums min-w-[4rem] text-center">
                  {slideIndex + 1} / {slideCount}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Next category"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
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
