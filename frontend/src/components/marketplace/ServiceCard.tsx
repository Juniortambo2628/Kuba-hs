"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { marketplaceUi, type MarketplaceLayout } from "@/lib/marketplace-ui";
import { resolveProviderCardImageUrl } from "@/lib/provider-media";
import { getMediaUrl, cn } from "@/lib/utils";
import { providerHref } from "@/lib/provider-urls";
import { ListingCardMeta, type ListingMetaItem } from "@/components/marketplace/ListingCardMeta";
import { ListingCardFrostedFooter } from "@/components/marketplace/ListingCardFrostedFooter";
import { MarketplaceCardLink } from "@/components/marketplace/MarketplaceCardLink";
import { MarketplaceCardMediaFallback } from "@/components/marketplace/MarketplaceCardMediaFallback";

export interface ServiceCardData {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
  base_price?: number;
  starting_price?: number;
  pricing_type?: string;
  image_urls?: { url: string }[];
  service_thumbnail_url?: string;
  thumbnail_url?: string | null;
  providers_count?: number;
  provider?: {
    id?: string | number;
    business_name: string;
    rating?: number | null;
    review_count?: number;
    is_verified?: boolean;
    logo?: string | null;
    banner?: string | null;
    location_name?: string | null;
    user?: { avatar_url?: string | null };
  };
}

interface ServiceCardProps {
  service: ServiceCardData;
  href: string;
  layout?: MarketplaceLayout;
  onPrefetch?: () => void;
  className?: string;
  /** Hide provider row (e.g. on a provider profile page) */
  hideProvider?: boolean;
  /** Opens booking flow for this offering (provider profile) */
  onBookNow?: () => void;
  bookLabel?: string;
}

function serviceImage(service: ServiceCardData) {
  const url =
    service.thumbnail_url ||
    service.service_thumbnail_url ||
    service.image_urls?.[0]?.url;
  return url ? getMediaUrl(url, "service") : null;
}

function formatPrice(service: ServiceCardData) {
  const amount = service.base_price ?? service.starting_price;
  if (amount == null) return null;
  return Number(amount).toLocaleString();
}

function pricingUnit(type?: string) {
  if (type === "hourly") return "Hour";
  if (type === "per_sqft") return "Sq ft";
  return "Service";
}

export function ServiceCard({
  service,
  href,
  layout = "grid",
  onPrefetch,
  className,
  hideProvider = false,
  onBookNow,
  bookLabel = "Book now",
}: ServiceCardProps) {
  const price = formatPrice(service);
  const imageSrc = serviceImage(service);
  const L = marketplaceUi.listing;
  const provider = service.provider;
  const location = provider?.location_name;
  const providerProfileHref = provider ? providerHref(provider) : null;
  const providerAvatar = provider ? resolveProviderCardImageUrl(provider) : null;

  if (layout === "list") {
    return (
      <div
        className={cn(
          "group flex flex-col md:flex-row gap-6 p-5 rounded-3xl border border-border/40 bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md",
          className
        )}
      >
        <Link href={href} onMouseEnter={onPrefetch} className="flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
          <div className={L.listMedia}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <MarketplaceCardMediaFallback />
            )}
            {service.category && (
              <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-white/95 dark:bg-zinc-900/95 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm">
                {service.category}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {service.name}
                  </h3>
                  {service.category && (
                    <p className="text-sm text-muted-foreground mt-0.5">{service.category}</p>
                  )}
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>
                {price && (
                  <div className={cn(L.pricePill, "shrink-0 ml-2 mt-1")}>
                    <span className={L.priceLabel}>From</span>
                    <p className={L.priceMain}>KES {price}</p>
                    <p className={L.priceUnit}>/ {pricingUnit(service.pricing_type)}</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <ListingCardMeta
                  items={[
                    ...(service.providers_count != null && service.providers_count > 0
                      ? [
                          {
                            icon: Users,
                            label: `${service.providers_count} ${
                              service.providers_count === 1 ? "provider" : "providers"
                            }`,
                          } satisfies ListingMetaItem,
                        ]
                      : [{ icon: Users, label: "Available now" } satisfies ListingMetaItem]),
                    { icon: Calendar, label: pricingUnit(service.pricing_type) },
                  ]}
                />
              </div>
            </div>
          </div>
        </Link>
        <ChevronRight className="hidden md:block w-5 h-5 text-muted-foreground self-center shrink-0" />
      </div>
    );
  }

  const bookAction = onBookNow ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onBookNow();
      }}
      className={cn(L.readMoreBtn, "shrink-0 self-end")}
    >
      {bookLabel}
    </button>
  ) : undefined;

  return (
    <div className={cn(L.root, onBookNow && "h-auto", className)}>
      <MarketplaceCardLink
        href={href}
        onMouseEnter={onPrefetch}
        className={cn("block", onBookNow ? "h-auto" : "h-full")}
      >
        <article
          className={cn(
            marketplaceUi.card.base,
            marketplaceUi.card.hover,
            marketplaceUi.card.gridShell,
            onBookNow ? "h-auto" : "h-full"
          )}
        >
          <div className={cn(L.media, marketplaceUi.card.gridOutline)}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={L.mediaImage}
              />
            ) : (
              <MarketplaceCardMediaFallback />
            )}
            <div className={L.mediaGradient} />

            {service.category && <span className={L.badge}>{service.category}</span>}

            <ListingCardFrostedFooter
              title={service.name}
              location={location ?? undefined}
              rating={
                provider?.rating != null ? Number(provider.rating).toFixed(1) : undefined
              }
              reviewCount={provider?.review_count}
              price={price ? `KES ${price}` : null}
              priceUnit={price ? `/ ${pricingUnit(service.pricing_type)}` : null}
              primaryAction={bookAction}
            />
          </div>
        </article>
      </MarketplaceCardLink>

      {!hideProvider && provider && providerProfileHref && (
        <Link href={providerProfileHref} className={cn(L.hostLink, "group/host")}>
          <Avatar className="h-6 w-6 border border-border/50 shrink-0">
            {providerAvatar ? (
              <AvatarImage src={providerAvatar} alt={provider.business_name} />
            ) : null}
            <AvatarFallback className="text-[10px] bg-muted">
              {provider.business_name[0]}
            </AvatarFallback>
          </Avatar>
          <span className={cn(L.hostName, "group-hover/host:text-primary")}>{provider.business_name}</span>
        </Link>
      )}
    </div>
  );
}
