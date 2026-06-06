"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Shield,
  Calendar,
  Heart,
  Bookmark,
  Wifi,
} from "lucide-react";
import { resolveProviderCardImageUrl } from "@/lib/provider-media";
import { cn } from "@/lib/utils";
import { landingUi } from "@/lib/landing-ui";
import { LandingButton } from "@/components/shared/LandingButton";
import type { ProviderSearchRowData } from "@/components/marketplace/ProviderSearchRow";
import { ProviderCardAvatar } from "@/components/marketplace/ProviderCardAvatar";

interface ProviderHotelSearchCardProps {
  provider: ProviderSearchRowData & {
    review_count?: number;
    is_verified?: boolean;
    starting_price?: number | string | null;
  };
  href: string;
  onClick?: () => void;
  className?: string;
}

export function ProviderHotelSearchCard({
  provider,
  href,
  onClick,
  className,
}: ProviderHotelSearchCardProps) {
  const imageSrc = resolveProviderCardImageUrl(provider);
  const rating =
    provider.rating != null ? Number(provider.rating).toFixed(1) : null;
  const reviews = provider.review_count ?? 0;
  const price =
    provider.starting_price != null
      ? Number(provider.starting_price).toLocaleString()
      : null;
  const serviceCount = provider.services?.length ?? 0;
  const categoryName = (provider.services?.[0] as any)?.service?.category?.name;

  return (
    <article
      className={cn(
        "group flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 rounded-2xl border border-border/60",
        "bg-card hover:border-primary/30 hover:shadow-md transition-all",
        className
      )}
    >
      <Link
        href={href}
        onClick={onClick}
        className="relative w-full sm:w-[200px] md:w-[220px] aspect-[5/4] sm:aspect-auto sm:min-h-[160px] shrink-0 rounded-xl overflow-hidden bg-muted"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={provider.business_name}
            fill
            className="object-cover"
            sizes="220px"
          />
        ) : (
          <ProviderCardAvatar
            businessName={provider.business_name}
            logo={provider.logo}
            user={provider.user}
            size="lg"
          />
        )}
        {provider.is_verified && (
          <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            Verified
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              onClick={onClick}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {provider.business_name}
            </Link>
            {categoryName && (
              <p className="text-sm text-muted-foreground mt-0.5">{categoryName}</p>
            )}
          </div>
          {price && (
            <div className={landingUi.price.wrap}>
              <span className={landingUi.price.label}>From</span>
              <p className={landingUi.price.value}>KES {price}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
          {rating && (
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {rating}
              {reviews > 0 && <span className="font-normal">({reviews})</span>}
            </span>
          )}
          {provider.location_name && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.location_name}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {provider.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Verified Pro
            </span>
          )}
          {serviceCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {serviceCount} services
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <Wifi className="h-3.5 w-3.5" />
            Available
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/40">
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:border-rose-200 transition-colors"
            aria-label="Save provider"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Bookmark provider"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <LandingButton asChild size="sm">
            <Link href={href} onClick={onClick}>
              Book now
              <Calendar className="h-4 w-4" />
            </Link>
          </LandingButton>
        </div>
      </div>
    </article>
  );
}
