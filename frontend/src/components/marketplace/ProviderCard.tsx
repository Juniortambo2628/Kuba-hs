"use client";

import { DynamicImage as Image } from "@/components/ui/dynamic-image";
import Link from "next/link";
import { MapPin, Shield, Star, Calendar, ArrowRight } from "lucide-react";
import { marketplaceUi } from "@/lib/marketplace-ui";
import { resolveProviderCardImageUrl } from "@/lib/provider-media";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";
import type { MarketplaceLayout } from "@/lib/marketplace-ui";
import { ListingCardFrostedFooter } from "@/components/marketplace/ListingCardFrostedFooter";
import { MarketplaceCardLink } from "@/components/marketplace/MarketplaceCardLink";
import { ProviderCardAvatar } from "@/components/marketplace/ProviderCardAvatar";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

export type ProviderCardData = Pick<
  Provider,
  | "id"
  | "business_name"
  | "bio"
  | "logo"
  | "banner"
  | "is_verified"
  | "location_name"
  | "rating"
  | "review_count"
  | "starting_price"
  | "user"
  | "services"
>;

interface ProviderCardProps {
  provider: ProviderCardData;
  href: string;
  layout?: MarketplaceLayout;
  fallbackBio?: string;
  className?: string;
}

export function ProviderCard({
  provider,
  href,
  layout = "grid",
  className,
}: ProviderCardProps) {
  const isList = layout === "list";
  const L = marketplaceUi.listing;
  const cardImageSrc = resolveProviderCardImageUrl(provider);
  const startingPrice =
    provider.starting_price != null ? Number(provider.starting_price).toLocaleString() : null;
  const categoryName = provider.services?.[0]?.service?.category?.name;
  const serviceCount = provider.services?.length ?? 0;
  const { isFavorited, toggleFavorite } = useFavoritesContext();

  /* ──── LIST VIEW ──── */
  if (isList) {
    const ratingValue = provider.rating != null ? Number(provider.rating) : null;

    return (
      <div className={cn("group flex flex-col md:flex-row gap-6 p-5 rounded-3xl border border-border/40 bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md", className)}>
        {/* Clickable Area */}
        <Link href={href} className="flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
          <div className={L.listMedia}>
            {cardImageSrc ? (
              <Image
                src={cardImageSrc}
                alt={provider.business_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <ProviderCardAvatar
                businessName={provider.business_name}
                logo={provider.logo}
                banner={provider.banner}
                user={provider.user}
                size="lg"
              />
            )}

            {/* Verified Badge */}
            {provider.is_verified && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-lg">
                <Shield className="w-3 h-3 text-primary" />
                Verified Pro
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              {/* Title & Price Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                    {provider.business_name}
                  </h3>

                  {/* Category */}
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {categoryName || "Home services"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">
                      {ratingValue != null ? ratingValue.toFixed(1) : "New"}
                    </span>
                    {provider.review_count != null && provider.review_count > 0 && (
                      <span>({provider.review_count.toLocaleString()})</span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                {startingPrice && (
                  <div className={cn(L.pricePill, "shrink-0 ml-2 mt-1")}>
                    <span className={L.priceLabel}>From</span>
                    <p className={L.priceMain}>KES {startingPrice}</p>
                  </div>
                )}
              </div>

              {/* Meta chips — location + service count */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                {provider.location_name && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                    <span>{provider.location_name}</span>
                  </div>
                )}
                {serviceCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                    <span>{serviceCount} services</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-4 md:mt-0 pt-4 border-t border-border/40 md:border-t-0 md:pt-0 md:pl-6 md:border-l md:flex-col md:justify-center md:gap-4 shrink-0">
          <FavoriteButton
            isFavorited={isFavorited(provider.id)}
            onToggle={() => toggleFavorite(provider.id)}
            variant="inline"
          />
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            See more
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ──── GRID VIEW ──── */
  return (
    <div className={cn(L.root, className, "relative h-full")}>
      <MarketplaceCardLink href={href}>
        <article
          className={cn(
            marketplaceUi.card.base,
            marketplaceUi.card.hover,
            marketplaceUi.card.gridShell,
            "h-full"
          )}
        >
          <div className={cn(L.media, marketplaceUi.card.gridOutline)}>
            {cardImageSrc ? (
              <Image
                src={cardImageSrc}
                alt={provider.business_name}
                fill
                className={L.mediaImage}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <ProviderCardAvatar
                businessName={provider.business_name}
                logo={provider.logo}
                banner={provider.banner}
                user={provider.user}
                size="lg"
              />
            )}
            <div className={L.mediaGradient} />

            <span className={L.badge}>
              {provider.is_verified && <Shield className="w-3.5 h-3.5 text-primary shrink-0" />}
              {provider.is_verified ? "Verified pro" : "Professional"}
            </span>

            <ListingCardFrostedFooter
              title={provider.business_name}
              location={provider.location_name ?? categoryName ?? undefined}
              rating={
                provider.rating != null ? Number(provider.rating).toFixed(1) : "New"
              }
              reviewCount={provider.review_count}
              price={startingPrice ? `KES ${startingPrice}` : null}
            />
          </div>
        </article>
      </MarketplaceCardLink>

      {/* Favorite heart overlay */}
      <FavoriteButton
        isFavorited={isFavorited(provider.id)}
        onToggle={() => toggleFavorite(provider.id)}
        variant="overlay"
      />
    </div>
  );
}
