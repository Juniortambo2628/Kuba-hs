"use client";

import Image from "next/image";
import { ChevronRight, LayoutGrid, MapPin } from "lucide-react";
import { marketplaceUi, type MarketplaceLayout } from "@/lib/marketplace-ui";
import { resolveCategoryCardImageSrc } from "@/lib/category-media";
import { cn } from "@/lib/utils";
import { ListingCardMeta } from "@/components/marketplace/ListingCardMeta";
import { MarketplaceCardLink } from "@/components/marketplace/MarketplaceCardLink";
import { MarketplaceCardMediaFallback } from "@/components/marketplace/MarketplaceCardMediaFallback";

export interface ServiceCategoryCardData {
  id: string | number;
  name: string;
  description?: string;
  icon?: string | null;
  dynamic_icon_url?: string | null;
  icon_url?: string | null;
  image_url?: string | null;
  services_count?: number;
  slug?: string;
  services?: unknown[];
}

interface ServiceCategoryCardProps {
  category: ServiceCategoryCardData;
  href: string;
  layout?: MarketplaceLayout;
  onPrefetch?: () => void;
  className?: string;
}

export function ServiceCategoryCard({
  category,
  href,
  layout = "grid",
  onPrefetch,
  className,
}: ServiceCategoryCardProps) {
  const count = category.services_count ?? category.services?.length ?? 0;
  const isList = layout === "list";
  const L = marketplaceUi.listing;
  const imageSrc = resolveCategoryCardImageSrc({
    name: category.name,
    icon: category.icon,
    image_url: category.image_url,
    dynamic_icon_url: category.dynamic_icon_url,
    icon_url: category.icon_url,
  });

  const CategoryThumb = ({ logoSize }: { logoSize?: string }) =>
    imageSrc ? (
      <Image src={imageSrc} alt={category.name} fill className="object-cover" sizes="96px" />
    ) : (
      <MarketplaceCardMediaFallback logoClassName={logoSize} />
    );

  if (isList) {
    return (
      <MarketplaceCardLink href={href} onMouseEnter={onPrefetch} className={className}>
        <div className="group flex flex-col sm:flex-row gap-6 p-5 rounded-3xl border border-border/40 bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
          <div className={L.listMedia}>
            <CategoryThumb />
            <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-white/95 dark:bg-zinc-900/95 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm">
              {count} services
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
            <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {category.description ||
                `Explore ${category.name.toLowerCase()} services on Kuba.`}
            </p>
            <div className="mt-4">
              <ListingCardMeta
                size="lg"
                items={[
                  { icon: LayoutGrid, label: `${count} services` },
                  { icon: MapPin, label: "Browse category" },
                ]}
              />
            </div>
          </div>
          <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground self-center shrink-0" />
        </div>
      </MarketplaceCardLink>
    );
  }

  return (
    <MarketplaceCardLink href={href} onMouseEnter={onPrefetch} className={cn(L.root, className)}>
      <article
        className={cn(
          marketplaceUi.card.base,
          marketplaceUi.card.hover,
          isList ? undefined : marketplaceUi.card.gridShell,
          "h-full flex flex-col"
        )}
      >
        <div className={cn(L.media, !isList && marketplaceUi.card.gridOutline)}>
          <CategoryThumb />
          <div className={L.mediaGradient} />
          <span className={L.badge}>{count} services</span>
        </div>

        <div className={cn(L.body, !isList && "px-0.5")}>
          <div>
            <h3 className={L.title}>{category.name}</h3>
            <p className={L.subtitle}>
              {category.description ||
                `Explore ${category.name.toLowerCase()} services on Kuba.`}
            </p>
          </div>

          <ListingCardMeta
            size="lg"
            items={[
              { icon: LayoutGrid, label: `${count} services` },
              { icon: MapPin, label: "Browse category" },
            ]}
          />
        </div>
      </article>
    </MarketplaceCardLink>
  );
}
