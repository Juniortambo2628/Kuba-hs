"use client";

import { use, useState, useMemo, useCallback } from "react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { useData } from "@/hooks/useData";
import { useCMS } from "@/contexts/CMSContext";
import { CardSkeleton } from "@/components/shared/AdvancedSkeleton";
import { EmptyState } from "@/components/shared/ui";
import { BookingModal } from "@/components/booking/BookingModal";
import { ServiceDetailPortfolio } from "@/components/marketing/service-detail/ServiceDetailPortfolio";
import { buildMarketingHeroProps } from "@/config/marketing-pages";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import { toSlug } from "@/lib/service-urls";
import { resolveServiceCategoryName } from "@/lib/booking-form-config";
import { useBookNowAuth } from "@/hooks/useAuthAction";
import { Provider } from "@/types";
import { Heart, Search } from "lucide-react";
import { toast } from "sonner";

export default function ServiceDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { getS, getImg } = useCMS();
  const { data: resData, isLoading } = useData<{
    service?: Record<string, unknown>;
    provider_services?: Array<{
      id: string;
      base_price: number;
      pricing_type?: string;
      provider?: Provider | null;
    }>;
  }>(slug ? `/api/services/${slug}` : null);

  const service = resData?.service;
  const providerServices = resData?.provider_services || [];

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { requireAuthToBook } = useBookNowAuth();

  const [isFavorite, setIsFavorite] = useState(false);

  const baseHero = useMemo(
    () => buildMarketingHeroProps("serviceDetail", getS, getImg),
    [getS, getImg]
  );

  const bookingService = useMemo(() => {
    const row = providerServices[0] || service;
    if (!row) return null;
    const categoryName =
      resolveServiceCategoryName(row) ||
      resolveServiceCategoryName(service) ||
      (service?.category as { name?: string })?.name;
    return {
      ...row,
      id: (row as { service_id?: string }).service_id ?? (row as { id?: string }).id,
      name: (row as { name?: string }).name ?? (service as { name?: string })?.name,
      category: categoryName ?? (row as { category?: string }).category,
    };
  }, [providerServices, service]);

  const heroBreadcrumbs = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: (service as { name?: string })?.name || "Service" },
    ],
    [service]
  );

  const categoryName =
    (service as { category?: { name?: string } })?.category?.name ||
    (typeof (service as { category?: string })?.category === "string"
      ? (service as { category: string }).category
      : "Services");

  const categoryFilter =
    (service as { category?: { slug?: string } })?.category?.slug ||
    (typeof (service as { category?: { name?: string } })?.category === "object" &&
    (service as { category?: { name?: string } })?.category?.name
      ? toSlug((service as { category: { name: string } }).category.name)
      : typeof (service as { category?: string })?.category === "string"
        ? toSlug((service as { category: string }).category)
        : "");

  const categoryHref = categoryFilter
    ? `/services?category=${categoryFilter}`
    : undefined;

  const handleToggleFavorite = async () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success(nextState ? "Saved to your collection" : "Removed from collection", {
        icon: nextState ? (
          <Heart className="w-4 h-4 fill-primary text-primary" />
        ) : (
          <Heart className="w-4 h-4" />
        ),
      });
    } catch {
      setIsFavorite(!nextState);
      toast.error("Could not update favorites");
    }
  };

  const handleBook = useCallback(
    (provider: Provider | null) => {
      requireAuthToBook(() => {
        setSelectedProvider(provider);
        setIsBookingModalOpen(true);
      }, provider?.business_name);
    },
    [requireAuthToBook]
  );

  const heroProps = useMemo(() => {
    if (!service) return { ...baseHero, breadcrumbs: heroBreadcrumbs };
    return {
      ...baseHero,
      title: (service as { name?: string }).name || "Service",
      subtitle: categoryName,
      breadcrumbs: heroBreadcrumbs,
    };
  }, [service, baseHero, heroBreadcrumbs, categoryName]);

  if (isLoading) {
    return (
      <MarketingPage
        shellClassName="min-h-screen flex flex-col"
        contained={false}
        hero={{ ...baseHero, breadcrumbs: heroBreadcrumbs.slice(0, -1) }}
      >
        <div className={cn(uiPrimitives.layout.page, "py-12 grid grid-cols-1 sm:grid-cols-3 gap-6")}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </MarketingPage>
    );
  }

  if (!service) {
    return (
      <MarketingPage
        shellClassName="min-h-screen flex flex-col"
        contained={false}
        hero={{
          ...baseHero,
          title: "Not Found",
          subtitle: "Service unavailable",
          breadcrumbs: heroBreadcrumbs.slice(0, -1),
        }}
      >
        <div className={cn(uiPrimitives.layout.page, "py-16 max-w-lg")}>
          <EmptyState
            variant="premium"
            icon={Search}
            title="Service Not Found"
            description="This service may have been removed or updated. Browse the marketplace for alternatives."
            actionLabel="Browse Services"
            actionHref="/services"
          />
        </div>
      </MarketingPage>
    );
  }

  return (
    <MarketingPage
      shellClassName="min-h-screen flex flex-col"
      contained={false}
      hero={heroProps}
    >
      <ServiceDetailPortfolio
        service={service as Parameters<typeof ServiceDetailPortfolio>[0]["service"]}
        providerServices={providerServices}
        categoryName={categoryName}
        categoryHref={categoryHref}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onBook={handleBook}
      />

      {bookingService && selectedProvider && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          provider={selectedProvider as Parameters<typeof BookingModal>[0]["provider"]}
          service={bookingService as Parameters<typeof BookingModal>[0]["service"]}
        />
      )}
    </MarketingPage>
  );
}
