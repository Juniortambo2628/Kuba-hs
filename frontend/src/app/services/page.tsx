"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, SlidersHorizontal, Wrench as WrenchIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { useSearchParams } from "next/navigation";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { ServiceCard, ServiceCategoryCard } from "@/components/marketplace";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import {
  MarketingListingBody,
  MarketingFilterSidebar,
  MarketingViewToggle,
  MarketingListingToolbar,
} from "@/components/marketing";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { marketingUi } from "@/lib/marketing-ui";
import { serviceDetailHref, toSlug } from "@/lib/service-urls";
import { cn } from "@/lib/utils";
import { resolveCategoryThumbnailSrc } from "@/lib/marketing-hero-media";

interface BackendService {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  is_active: boolean;
  is_featured: boolean;
  starting_price: number;
  thumbnail_url: string;
  slug?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  dynamic_icon_url: string | null;
  image_url?: string | null;
  services_count: number;
  slug: string;
  services: BackendService[];
}

function matchesCategory(
  categoryParam: string,
  cat: Category,
  service: BackendService & { category_id: string; category_slug: string }
) {
  if (!categoryParam) return true;
  return (
    String(service.category_id) === String(categoryParam) ||
    String(cat.id) === String(categoryParam) ||
    cat.slug === categoryParam ||
    toSlug(cat.name) === categoryParam
  );
}

function ServicesContent() {
  const baseHero = useMarketingHero("services");
  const searchParams = useSearchParams();

  const categoryParam =
    searchParams.get("category_id") || searchParams.get("category") || "";
  const searchQuery = searchParams.get("search");
  const browsingCategory = Boolean(categoryParam || searchQuery);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const { features: cmsFeatures } = usePageFeatures("services");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const allServices = categories.flatMap((cat) =>
    (cat.services || []).map((svc) => ({
      ...svc,
      category: cat.name,
      category_id: String(cat.id),
      category_slug: cat.slug || toSlug(cat.name),
    }))
  );

  const filteredServices = allServices.filter((service) => {
    const cat = categories.find(
      (c) =>
        String(c.id) === String(service.category_id) ||
        c.slug === service.category_slug
    );
    if (categoryParam && cat && !matchesCategory(categoryParam, cat, service)) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        service.name?.toLowerCase().includes(q) ||
        service.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCategory = categories.find(
    (c) =>
      String(c.id) === String(categoryParam) ||
      c.slug === categoryParam ||
      toSlug(c.name) === categoryParam
  );

  const hero = useMemo(() => {
    if (activeCategory && categoryParam) {
      const thumb = resolveCategoryThumbnailSrc({
        name: activeCategory.name,
        image_url: activeCategory.image_url,
        dynamic_icon_url: activeCategory.dynamic_icon_url,
        icon: activeCategory.icon,
      });
      const { bgImage: _cmsHero, ...baseWithoutBg } = baseHero;
      return {
        ...baseWithoutBg,
        title: activeCategory.name,
        subtitle:
          activeCategory.description ||
          baseHero.subtitle ||
          "Browse services in this category.",
        ...(thumb ? { bgImage: thumb } : {}),
      };
    }
    return baseHero;
  }, [baseHero, activeCategory, categoryParam]);

  return (
    <MarketingPage hero={hero} contained={false} shellClassName="min-h-screen flex flex-col">
      {cmsFeatures.length > 0 && !browsingCategory && (
        <MarketingSection
          band="bg-slate-50 dark:bg-zinc-955/20 border-b border-border/10"
          className="!py-20"
        >
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Featured Specializations</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Hand-picked highlights from our elite professional segments.
            </p>
          </div>
          <FeatureCardGrid
            features={cmsFeatures}
            columns={cmsFeatures.length >= 3 ? 3 : 2}
            accentColor="primary"
            fallbackIcon={WrenchIcon}
          />
        </MarketingSection>
      )}

      <MarketingListingBody>
        <div className={marketingUi.listing.inner}>
          <aside className={cn(marketingUi.listing.sidebarWide, !filterOpen && "hidden lg:block")}>
            <div className={marketingUi.listing.sidebarSticky}>
              <MarketingFilterSidebar />
            </div>
          </aside>

          <div className={marketingUi.listing.main}>
            {browsingCategory && (
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                All service categories
              </Link>
            )}

            <MarketingListingToolbar
              count={browsingCategory ? filteredServices.length : categories.length}
              countLabel={browsingCategory ? "services" : "categories"}
            >
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <MarketingViewToggle
                view={view}
                onViewChange={(v) => {
                  if (v !== "map") setView(v);
                }}
              />
            </MarketingListingToolbar>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Loading services...
                </p>
              </div>
            ) : browsingCategory ? (
              filteredServices.length === 0 ? (
                <EmptyState
                  variant="marketing"
                  title="No Services Found"
                  description={
                    activeCategory
                      ? `No services listed under ${activeCategory.name} yet. Try another category or clear filters.`
                      : "We couldn't find any services matching your selection."
                  }
                  actionLabel="Browse All Categories"
                  actionHref="/services"
                />
              ) : (
                <div
                  className={
                    view === "grid" ? marketingUi.listing.gridBrowse : marketingUi.listing.list
                  }
                >
                  {filteredServices.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ServiceCard
                        layout={view === "list" ? "list" : "grid"}
                        service={service}
                        href={serviceDetailHref(service)}
                      />
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div
                className={
                  view === "grid" ? marketingUi.listing.gridBrowse : marketingUi.listing.list
                }
              >
                {categories.map((category, idx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ServiceCategoryCard
                      layout={view === "list" ? "list" : "grid"}
                      category={category}
                      href={`/services?category=${category.slug || category.id}`}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MarketingListingBody>
    </MarketingPage>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 text-center text-muted-foreground">
          Loading services...
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
