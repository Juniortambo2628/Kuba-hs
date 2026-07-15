"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Map } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { DynamicImage as Image } from "@/components/ui/dynamic-image";
import { HeroSearchModal } from "./HeroSearchModal";
import { HeroBookingBar } from "./HeroBookingBar";
import { LandingButton } from "@/components/shared/LandingButton";
import { getMediaUrl } from "@/lib/utils";
import { marketingSection } from "@/lib/marketing-section";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGES } from "@/lib/fallback-images";

const FALLBACK_HERO_IMAGES = [
  FALLBACK_IMAGES.hero1,
  FALLBACK_IMAGES.hero2,
  FALLBACK_IMAGES.hero3,
];

interface HeroProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    bgImage?: string;
  } | null;
}

function useHeroCopy(
  getS: (g: string, k: string, f?: string) => string,
  initialData?: HeroProps["initialData"]
) {
  const from = (key: string, fallback: string) =>
    getS("home_hero", key, getS("hero_text", key, fallback));

  const headline = from(
    "hero_headline",
    initialData?.title?.replace(/<[^>]+>/g, "") ||
      from("hero_title", "Expert services for your home")
  );
  const eyebrow = from(
    "hero_eyebrow",
    from("hero_subtitle", initialData?.subtitle || "Verified professionals across Kenya")
  );
  const statValue = from("hero_stat_value", "500+");
  const statLabel = from("hero_stat_label", "Trusted pros near you");
  const serviceLabel = from("hero_search_service_label", "Service");
  const locationLabel = from("hero_search_location_label", "Location");
  const dateLabel = from("hero_search_date_label", "Date");

  return { headline, eyebrow, statValue, statLabel, serviceLabel, locationLabel, dateLabel };
}

export function Hero({ initialData }: HeroProps) {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"service" | "location">("service");
  const [searchView, setSearchView] = useState<"list" | "map">("list");
  const [imageIndex, setImageIndex] = useState(0);

  const copy = useHeroCopy(getS, initialData);

  const cmsBg = !cmsLoading
    ? getImg("hero_backgrounds", "hero_bg_image", initialData?.bgImage || FALLBACK_HERO_IMAGES[0])
    : getMediaUrl(initialData?.bgImage) || FALLBACK_HERO_IMAGES[0];

  const heroImages = cmsBg ? [cmsBg, ...FALLBACK_HERO_IMAGES.filter((u) => u !== cmsBg)] : FALLBACK_HERO_IMAGES;
  const activeImage = heroImages[imageIndex % heroImages.length];

  return (
    <section className={cn(marketingSection.section, "pt-6 md:pt-8 pb-10 md:pb-14 bg-muted/40 dark:bg-muted/20")}>
      <div className="w-full max-w-[min(100%,96rem)] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative min-h-[min(68vh,620px)] sm:min-h-[min(72vh,700px)] md:min-h-[min(78vh,820px)] rounded-dashboard md:rounded-[3rem] overflow-hidden bg-muted shadow-xl">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </motion.div>
          <div
            className="absolute inset-0 bg-linear-to-br from-black/55 via-black/40 to-black/65 pointer-events-none"
            aria-hidden
          />

          <div className="absolute top-8 left-6 md:top-12 md:left-12 z-10 max-w-xl">
            <p className="flex items-center gap-3 text-sm font-medium text-white/90 mb-4 md:mb-6">
              <span className="inline-block w-10 h-px bg-white/60" aria-hidden />
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-sm">
              {copy.headline}
            </h1>
          </div>

          <div className="absolute bottom-28 md:bottom-32 left-6 md:left-12 z-10 flex items-end gap-6">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums drop-shadow-sm">
                {copy.statValue}
              </p>
              <p className="text-sm font-medium text-white/85 mt-0.5">{copy.statLabel}</p>
            </div>
            {heroImages.length > 1 && (
              <div className="flex gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setImageIndex((i) => (i - 1 + heroImages.length) % heroImages.length)}
                  className="h-11 w-11 rounded-full border-2 border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/45 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageIndex((i) => (i + 1) % heroImages.length)}
                  className="h-11 w-11 rounded-full border-2 border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/45 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 -mt-10 md:-mt-14 px-2 md:px-8 max-w-5xl mx-auto space-y-3">
          <HeroBookingBar
            serviceLabel={copy.serviceLabel}
            locationLabel={copy.locationLabel}
            dateLabel={copy.dateLabel}
            onServiceClick={() => {
              setSearchMode("service");
              setSearchView("list");
              setIsSearchOpen(true);
            }}
            onLocationClick={() => {
              setSearchMode("location");
              setSearchView("list");
              setIsSearchOpen(true);
            }}
          />
          <div className="flex justify-center">
            <LandingButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchMode("location");
                setSearchView("map");
                setIsSearchOpen(true);
              }}
            >
              <Map className="h-4 w-4" />
              Find professionals on map
            </LandingButton>
          </div>
        </div>
      </div>

      <HeroSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialTab={searchMode}
        initialView={searchView}
      />
    </section>
  );
}
