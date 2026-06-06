"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Shield,
  Star,
  Zap,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { providerProfileUi } from "@/lib/provider-profile-ui";
import { resolveProviderCardImageUrl } from "@/lib/provider-media";
import { serviceDetailHref } from "@/lib/service-urls";
import { cn } from "@/lib/utils";
import { uiPrimitives } from "@/lib/ui-primitives";
import { LandingButton } from "@/components/shared/LandingButton";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { ServiceCard, type ServiceCardData } from "@/components/marketplace";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { ProviderLocationMap } from "./ProviderLocationMap";
import { marketingUi } from "@/lib/marketing-ui";
import { format } from "date-fns";

export interface ProviderProfileData {
  id: string;
  slug?: string;
  business_name: string;
  logo: string | null;
  banner?: string | null;
  bio: string | null;
  location_name?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  service_radius?: number | null;
  experience_years?: number | null;
  rating: number | null;
  review_count: number;
  is_verified: boolean;
  starting_price?: number | null;
  specialized_skills?: string[] | null;
  user?: { avatar_url?: string | null; first_name?: string; last_name?: string };
  services: Array<{
    id: string;
    service_id: string;
    base_price: number;
    pricing_type: string;
    name: string;
    description?: string | null;
    category?: string | null;
    service_thumbnail_url?: string | null;
    image_urls?: Array<{ url: string }>;
    service?: {
      name?: string;
      slug?: string;
      category?: { name?: string; slug?: string };
    };
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    created_at?: string;
    status?: string;
    user?: { first_name?: string; last_name?: string; name?: string };
    booking?: { service?: { name?: string } };
  }>;
}

type TabId = "work" | "reviews" | "about";

interface ProviderProfilePortfolioProps {
  provider: ProviderProfileData;
  onBook: (serviceId?: string) => void;
}

export function ProviderProfilePortfolio({ provider, onBook }: ProviderProfilePortfolioProps) {
  const [tab, setTab] = useState<TabId>("work");
  const { isFavorited, toggleFavorite } = useFavoritesContext();

  const profileImage = resolveProviderCardImageUrl(provider);
  const serviceCount = provider.services?.length ?? 0;
  const minPrice = useMemo(() => {
    const prices = (provider.services ?? []).map((s) => s.base_price).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : provider.starting_price ?? 0;
  }, [provider.services, provider.starting_price]);

  const publishedReviews = useMemo(
    () =>
      (provider.reviews ?? []).filter(
        (r) => !r.status || r.status === "published"
      ),
    [provider.reviews]
  );

  const serviceCards: { data: ServiceCardData; href: string; bookId: string }[] = useMemo(
    () =>
      (provider.services ?? []).map((ps) => ({
        bookId: ps.id,
        href: serviceDetailHref({
          name: ps.name,
          slug: ps.service?.slug,
          service: ps.service,
        }),
        data: {
          id: ps.id,
          name: ps.name || ps.service?.name || "Service",
          description: ps.description ?? undefined,
          category: ps.category || ps.service?.category?.name || undefined,
          base_price: ps.base_price,
          pricing_type: ps.pricing_type,
          service_thumbnail_url: ps.service_thumbnail_url ?? undefined,
          image_urls: ps.image_urls,
        },
      })),
    [provider.services]
  );

  const showLocationMap =
    Boolean(provider.location_name) ||
    provider.latitude != null ||
    provider.longitude != null;

  const skills = useMemo(() => {
    const raw = provider.specialized_skills;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [];
  }, [provider.specialized_skills]);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "work", label: "Work", count: serviceCount },
    { id: "reviews", label: "Reviews", count: publishedReviews.length },
    { id: "about", label: "About" },
  ];

  return (
    <div className={cn(uiPrimitives.layout.page, "-mt-12 md:-mt-16 relative z-20 pb-16")}>
      <div className={providerProfileUi.gradientBand}>
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            <div className={cn(providerProfileUi.avatar, "lg:-mb-20")}>
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={provider.business_name}
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground bg-muted">
                  {provider.business_name[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-3 lg:pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {provider.business_name}
                </h1>
                {provider.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
                    <Zap className="h-3 w-3 fill-current" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                {provider.bio
                  ? provider.bio.length > 160
                    ? `${provider.bio.slice(0, 160)}…`
                    : provider.bio
                  : "Professional home services provider on Kuba."}
                {provider.location_name && (
                  <span className="block mt-1.5 font-medium text-foreground/80">
                    Based in {provider.location_name}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <LandingButton
                  type="button"
                  size="md"
                  onClick={() =>
                    onBook(serviceCount === 1 ? serviceCards[0]?.bookId : undefined)
                  }
                >
                  {serviceCount > 1 ? "Book a service" : "Book now"}
                </LandingButton>
                <LandingButton asChild variant="secondary" size="md">
                  <Link href="/contact">
                    <MessageCircle className="h-4 w-4" />
                    Get in touch
                  </Link>
                </LandingButton>
                <FavoriteButton
                  variant="inline"
                  isFavorited={isFavorited(provider.id)}
                  onToggle={() => toggleFavorite(provider.id)}
                />
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-6 lg:gap-4 shrink-0">
              <div className="flex gap-2">
                {provider.is_verified && (
                  <span
                    className={cn(providerProfileUi.achievement, "bg-amber-400 text-amber-950")}
                    title="Verified professional"
                  >
                    <Shield className="h-4 w-4" />
                  </span>
                )}
                {provider.rating != null && provider.rating >= 4 && (
                  <span
                    className={cn(providerProfileUi.achievement, "bg-violet-500 text-white")}
                    title="Top rated"
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </span>
                )}
                {serviceCount > 0 && (
                  <span
                    className={cn(providerProfileUi.achievement, "bg-foreground text-background")}
                    title="Active services"
                  >
                    {serviceCount}
                  </span>
                )}
              </div>
              <div className="flex gap-8 sm:gap-10">
                <div className="text-center lg:text-right">
                  <p className={providerProfileUi.statValue}>
                    {provider.review_count.toLocaleString()}
                  </p>
                  <p className={providerProfileUi.statLabel}>Reviews</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className={providerProfileUi.statValue}>{serviceCount}</p>
                  <p className={providerProfileUi.statLabel}>Services</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className={providerProfileUi.statValue}>
                    {provider.rating != null ? Number(provider.rating).toFixed(1) : "—"}
                  </p>
                  <p className={providerProfileUi.statLabel}>Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={providerProfileUi.mainSection}>
        <div
          className={cn(
            providerProfileUi.contentCard,
            showLocationMap
              ? providerProfileUi.contentCardMain
              : providerProfileUi.contentCardFull
          )}
        >
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

        {tab === "work" && (
          <section>
            {serviceCards.length > 0 ? (
              <div className={cn(marketingUi.listing.gridBrowse, "items-start")}>
                {serviceCards.map(({ data, href, bookId }) => (
                  <ServiceCard
                    key={bookId}
                    service={data}
                    href={href}
                    hideProvider
                    onBookNow={() => onBook(bookId)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-12 text-center">
                No services listed yet. Check back soon.
              </p>
            )}
          </section>
        )}

        {tab === "reviews" && (
          <section className="space-y-4 max-w-3xl">
            {publishedReviews.length > 0 ? (
              publishedReviews.map((review) => {
                const author =
                  review.user?.name ||
                  [review.user?.first_name, review.user?.last_name].filter(Boolean).join(" ") ||
                  "Client";
                return (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-border/50 bg-muted/20 p-5"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-foreground">{author}</span>
                      </div>
                      {review.created_at && (
                        <time className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </time>
                      )}
                    </div>
                    {review.booking?.service?.name && (
                      <p className="text-xs font-semibold text-primary mb-2">
                        {review.booking.service.name}
                      </p>
                    )}
                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground py-12 text-center">
                No reviews yet. Be the first to book and leave feedback.
              </p>
            )}
          </section>
        )}

        {tab === "about" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {provider.bio || "This professional has not added a bio yet."}
                </p>
              </div>
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2">Skills & specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-muted/25 p-5 space-y-4">
                {provider.location_name && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground">{provider.location_name}</p>
                    </div>
                  </div>
                )}
                {provider.experience_years != null && provider.experience_years > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Experience</p>
                      <p className="text-muted-foreground">
                        {provider.experience_years} years in the field
                      </p>
                    </div>
                  </div>
                )}
                {minPrice > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Starting from</p>
                    <p className="text-xl font-bold text-foreground tabular-nums">
                      KES {Number(minPrice).toLocaleString()}
                    </p>
                  </div>
                )}
                <LandingButton
                  type="button"
                  className="w-full"
                  onClick={() =>
                    onBook(serviceCount === 1 ? serviceCards[0]?.bookId : undefined)
                  }
                >
                  {serviceCount > 1 ? "Book a service" : "Book now"}
                </LandingButton>
              </div>
            </aside>
          </section>
        )}
        </div>

        {showLocationMap && (
          <aside className={providerProfileUi.mapAside}>
            <ProviderLocationMap
              compact
              latitude={provider.latitude}
              longitude={provider.longitude}
              locationName={provider.location_name}
              serviceRadius={provider.service_radius}
              businessName={provider.business_name}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
