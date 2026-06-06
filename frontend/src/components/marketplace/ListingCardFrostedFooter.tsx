"use client";

import { MapPin, Star } from "lucide-react";
import { marketplaceUi } from "@/lib/marketplace-ui";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ListingCardFrostedFooterProps {
  title: string;
  location?: string | null;
  rating?: string | null;
  reviewCount?: number | null;
  price?: string | null;
  priceLabel?: string;
  priceUnit?: string | null;
  readMoreLabel?: string;
  /** Replaces default "Read more" pill (e.g. Book now on provider profile) */
  primaryAction?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Glass panel over card media — title, badge row, price + read more */
export function ListingCardFrostedFooter({
  title,
  location,
  rating,
  reviewCount,
  price,
  priceLabel = "From",
  priceUnit,
  readMoreLabel = "Read more",
  primaryAction,
  children,
  className,
}: ListingCardFrostedFooterProps) {
  const F = marketplaceUi.listing;

  return (
    <div className={cn(F.frostedPanel, className)}>
      <h3 className={F.frostedTitle}>{title}</h3>

      {(location || rating) && (
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          {location && (
            <span className={F.frostedBadge}>
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" />
              <span className="[overflow-wrap:anywhere]">{location}</span>
            </span>
          )}
          {rating && (
            <span className={F.frostedBadge}>
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              {reviewCount != null && reviewCount > 0 && (
                <span className="text-muted-foreground font-medium">
                  ({reviewCount.toLocaleString()})
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {children}

      {(price || primaryAction) && (
        <div className={F.frostedActionRow}>
          {price ? (
            <div className={F.frostedPriceCol}>
              <span className={F.frostedPriceLabel}>{priceLabel}</span>
              <p className={F.frostedPriceMain}>{price}</p>
              {priceUnit && <p className={F.frostedPriceUnit}>{priceUnit}</p>}
            </div>
          ) : (
            <div className="flex-1 min-w-0" />
          )}
          {primaryAction ?? (
            <span className={cn(F.readMoreBtn, "shrink-0 self-end")}>{readMoreLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
