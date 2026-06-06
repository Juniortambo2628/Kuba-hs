"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Heart,
  ShieldCheck,
  Sparkles,
  Shield,
  Zap,
  Tag,
} from "lucide-react";
import { providerProfileUi } from "@/lib/provider-profile-ui";
import { ProviderCard } from "@/components/marketplace";
import { MarketingBookingSidebar } from "@/components/marketing/MarketingBookingSidebar";
import { LandingButton } from "@/components/shared/LandingButton";
import { providerHref } from "@/lib/provider-urls";
import { getMediaUrl, cn } from "@/lib/utils";
import { uiPrimitives } from "@/lib/ui-primitives";
import { marketingUi } from "@/lib/marketing-ui";
import { resolveServiceThumbnailSrc } from "@/lib/marketing-hero-media";
import { Provider } from "@/types";

type TabId = "providers" | "about" | "process";

export interface ServiceDetailData {
  id?: string | number;
  name?: string;
  slug?: string;
  description?: string | null;
  category?: { name?: string; slug?: string } | string | null;
  service?: { name?: string; description?: string | null; category?: { name?: string } };
  base_price?: number;
  pricing_type?: string;
  provider?: Provider | null;
}

interface ProviderServiceRow {
  id: string;
  base_price: number;
  pricing_type?: string;
  provider?: Provider | null;
}

interface ServiceDetailPortfolioProps {
  service: ServiceDetailData;
  providerServices: ProviderServiceRow[];
  categoryName: string;
  categoryHref?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBook: (provider: Provider | null) => void;
}

export function ServiceDetailPortfolio({
  service,
  providerServices,
  categoryName,
  categoryHref,
  isFavorite,
  onToggleFavorite,
  onBook,
}: ServiceDetailPortfolioProps) {
  const [tab, setTab] = useState<TabId>(
    providerServices.length > 0 ? "providers" : "about"
  );

  const serviceName = service?.name || service?.service?.name || "Service";
  const description =
    service?.description || service?.service?.description || "";
  const thumbnailSrc = resolveServiceThumbnailSrc(service as any);

  const primaryProvider =
    service?.provider ||
    (providerServices.length > 0 ? providerServices[0].provider : null);

  const featuredRow =
    providerServices.length > 0 ? providerServices[0] : null;

  const minPrice = useMemo(() => {
    const prices = providerServices
      .map((r) => r.base_price)
      .filter((p) => p > 0);
    if (prices.length) return Math.min(...prices);
    return service?.base_price ?? 0;
  }, [providerServices, service?.base_price]);

  const providerCount = providerServices.filter((r) => r.provider).length;

  const tabs: { id: TabId; label: string; count?: number }[] = [
    ...(providerCount > 0
      ? [{ id: "providers" as const, label: "Professionals", count: providerCount }]
      : []),
    { id: "about", label: "About" },
    { id: "process", label: "How it works" },
  ];

  return (
    <div className={cn(uiPrimitives.layout.page, "-mt-12 md:-mt-16 relative z-20 pb-16")}>
      <div className={providerProfileUi.gradientBand}>
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            <div className={cn(providerProfileUi.avatar, "lg:-mb-20")}>
              {thumbnailSrc ? (
                <Image
                  src={getMediaUrl(thumbnailSrc, "service") || thumbnailSrc}
                  alt={serviceName}
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground bg-muted">
                  {serviceName[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-3 lg:pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {categoryHref ? (
                  <Link
                    href={categoryHref}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary hover:bg-primary/15"
                  >
                    <Tag className="h-3 w-3" />
                    {categoryName}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary">
                    <Tag className="h-3 w-3" />
                    {categoryName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {serviceName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                {description
                  ? description.length > 200
                    ? `${description.slice(0, 200)}…`
                    : description
                  : "Book verified professionals for this service on Kuba."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <LandingButton
                  type="button"
                  size="md"
                  onClick={() => onBook(primaryProvider as Provider | null)}
                >
                  Book now
                </LandingButton>
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 transition-colors",
                    isFavorite
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted"
                  )}
                  aria-label={isFavorite ? "Remove from favorites" : "Save service"}
                >
                  <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-6 lg:gap-4 shrink-0">
              <div className="flex gap-2">
                <span
                  className={cn(
                    providerProfileUi.achievement,
                    "bg-sky-500 text-white"
                  )}
                  title="Service category"
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                {providerCount > 0 && (
                  <span
                    className={cn(
                      providerProfileUi.achievement,
                      "bg-foreground text-background"
                    )}
                    title="Available professionals"
                  >
                    {providerCount}
                  </span>
                )}
              </div>
              <div className="flex gap-8 sm:gap-10">
                <div className="text-center lg:text-right">
                  <p className={providerProfileUi.statValue}>{providerCount}</p>
                  <p className={providerProfileUi.statLabel}>Pros</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className={providerProfileUi.statValue}>
                    {minPrice > 0 ? `KES ${Number(minPrice).toLocaleString()}` : "—"}
                  </p>
                  <p className={providerProfileUi.statLabel}>From</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={providerProfileUi.mainSection}>
        <div className={cn(providerProfileUi.contentCard, providerProfileUi.contentCardFull)}>
        <nav className="flex flex-wrap items-center gap-6 sm:gap-10 border-b border-border/50 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                providerProfileUi.tab,
                tab === t.id && providerProfileUi.tabActive
              )}
            >
              {t.label}
              {t.count != null && t.count > 0 && (
                <sup className="ml-1 text-[10px] font-bold text-muted-foreground">
                  {t.count}
                </sup>
              )}
            </button>
          ))}
        </nav>

        {tab === "providers" && (
          <section>
            {providerCount > 0 ? (
              <div className={marketingUi.listing.gridBrowse}>
                {providerServices.map((item) => {
                  const p = item.provider;
                  if (!p) return null;
                  return (
                    <ProviderCard
                      key={item.id}
                      layout="grid"
                      provider={{
                        ...p,
                        starting_price: item.base_price,
                      }}
                      href={providerHref(p)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-12 text-center">
                No professionals listed for this service yet.
              </p>
            )}
          </section>
        )}

        {tab === "about" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">About this service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {description || "Details for this service will be added soon."}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="h-11 w-11 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                      Flexible timing
                    </p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      Schedule at your convenience
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                      Verified pros
                    </p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      Quality-backed bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <aside>
              <MarketingBookingSidebar
                price={featuredRow?.base_price ?? minPrice}
                pricingType={
                  featuredRow?.pricing_type || service?.pricing_type || "service"
                }
                provider={primaryProvider as any}
                onBook={() => onBook(primaryProvider as Provider | null)}
              />
            </aside>
          </section>
        )}

        {tab === "process" && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
            {[
              {
                icon: Sparkles,
                title: "Choose & book",
                text: "Pick a verified professional and your preferred time.",
              },
              {
                icon: Shield,
                title: "Secure payment",
                text: "Pay safely via Paystack or M-Pesa when you confirm.",
              },
              {
                icon: Zap,
                title: "Service day",
                text: "Your pro arrives and completes the job to your satisfaction.",
              },
            ].map((step, i) => (
              <article
                key={step.title}
                className="relative p-6 rounded-2xl border border-border/50 bg-muted/20"
              >
                <div className="h-12 w-12 rounded-xl bg-card border border-border/50 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                <span className="absolute top-5 right-5 text-4xl font-black text-muted-foreground/15">
                  {i + 1}
                </span>
              </article>
            ))}
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
