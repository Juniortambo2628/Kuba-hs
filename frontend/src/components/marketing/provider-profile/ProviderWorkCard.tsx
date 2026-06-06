"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { providerProfileUi } from "@/lib/provider-profile-ui";
import { getMediaUrl, cn } from "@/lib/utils";
import { MarketplaceCardMediaFallback } from "@/components/marketplace/MarketplaceCardMediaFallback";

export interface ProviderWorkItem {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  base_price: number;
  pricing_type?: string;
  service_thumbnail_url?: string | null;
  image_urls?: Array<{ url: string }>;
  href: string;
}

interface ProviderWorkCardProps {
  item: ProviderWorkItem;
  onBook?: () => void;
}

export function ProviderWorkCard({ item, onBook }: ProviderWorkCardProps) {
  const imageUrl =
    item.service_thumbnail_url ||
    item.image_urls?.[0]?.url ||
    null;
  const imageSrc = imageUrl ? getMediaUrl(imageUrl, "service") : null;

  return (
    <article className={providerProfileUi.workCard}>
      <Link href={item.href} className="block">
        <div className={providerProfileUi.workMedia}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <MarketplaceCardMediaFallback />
          )}
          {item.category && (
            <span className={providerProfileUi.workBadge}>{item.category}</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors [overflow-wrap:anywhere]">
              {item.name}
            </h3>
            {item.category && (
              <p className="text-xs text-muted-foreground mt-1 leading-snug [overflow-wrap:anywhere]">
                {item.category}
                {item.description ? ` · ${item.description}` : ""}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-foreground tabular-nums">
              KES {Number(item.base_price).toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground mt-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              Book
            </span>
          </div>
        </div>
      </Link>
      {onBook && (
        <div className="px-4 pb-4 -mt-1">
          <button
            type="button"
            onClick={onBook}
            className="text-xs font-bold text-primary hover:underline"
          >
            Book this service
          </button>
        </div>
      )}
    </article>
  );
}
