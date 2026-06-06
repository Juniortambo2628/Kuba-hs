"use client";

import { use, useState, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { BookingModal } from "@/components/booking/BookingModal";
import { useData } from "@/hooks/useData";
import { useCMS } from "@/contexts/CMSContext";
import { CardSkeleton } from "@/components/shared/AdvancedSkeleton";
import { EmptyState } from "@/components/shared/ui";
import {
  ProviderProfilePortfolio,
  type ProviderProfileData,
} from "@/components/marketing/provider-profile/ProviderProfilePortfolio";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { buildMarketingHeroProps } from "@/config/marketing-pages";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import { useBookNowAuth } from "@/hooks/useAuthAction";

export default function ProviderProfileClient({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const { getS, getImg } = useCMS();
  const { data: provider, isLoading } = useData<ProviderProfileData>(
    slug ? `/api/providers/${slug}` : null
  );

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { requireAuthToBook } = useBookNowAuth();

  const heroBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Providers", href: "/providers" },
    { label: provider?.business_name || "Provider" },
  ];

  const baseHero = useMemo(
    () => buildMarketingHeroProps("providerProfile", getS, getImg),
    [getS, getImg]
  );

  const selectedService = selectedServiceId
    ? provider?.services?.find((s) => s.id === selectedServiceId) ?? null
    : null;

  const handleBook = useCallback(
    (serviceId?: string) => {
      requireAuthToBook(() => {
        setSelectedServiceId(serviceId ?? null);
        setIsBookingOpen(true);
      }, provider?.business_name);
    },
    [provider?.business_name, requireAuthToBook]
  );

  const heroProps = useMemo(() => {
    if (!provider) return { ...baseHero, breadcrumbs: heroBreadcrumbs };
    const subtitle =
      provider.location_name
        ? `Home services in ${provider.location_name}`
        : baseHero.subtitle;
    return {
      ...baseHero,
      title: provider.business_name,
      subtitle,
      breadcrumbs: heroBreadcrumbs,
    };
  }, [provider, baseHero, heroBreadcrumbs]);

  if (isLoading) {
    return (
      <MarketingPage
        shellClassName="min-h-screen flex flex-col"
        contained={false}
        hero={{
          ...baseHero,
          breadcrumbs: heroBreadcrumbs.slice(0, -1),
        }}
      >
        <div className={cn(uiPrimitives.layout.page, "py-12 grid grid-cols-1 sm:grid-cols-3 gap-6")}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </MarketingPage>
    );
  }

  if (!provider) {
    return (
      <MarketingPage
        shellClassName="min-h-screen flex flex-col"
        contained={false}
        hero={{
          ...baseHero,
          title: "Not Found",
          subtitle: "Provider unavailable",
          breadcrumbs: heroBreadcrumbs.slice(0, -1),
        }}
      >
        <div className={cn(uiPrimitives.layout.page, "py-16 max-w-lg")}>
          <EmptyState
            variant="premium"
            icon={Search}
            title="Provider Not Found"
            description="This professional profile may have been removed or is no longer active."
            actionLabel="Browse Providers"
            actionHref="/providers"
          />
        </div>
      </MarketingPage>
    );
  }

  return (
    <FavoritesProvider>
      <MarketingPage
        shellClassName="min-h-screen flex flex-col"
        contained={false}
        hero={heroProps}
      >
        <ProviderProfilePortfolio provider={provider} onBook={handleBook} />
      </MarketingPage>

      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedServiceId(null);
          }}
          provider={provider}
          offerings={provider.services}
          service={selectedService}
        />
      )}
    </FavoritesProvider>
  );
}
