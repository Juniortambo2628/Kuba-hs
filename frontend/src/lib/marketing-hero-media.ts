import { resolveCategoryCardImageSrc, type CategoryMediaFields } from "@/lib/category-media";
import { getMediaUrl } from "@/lib/utils";

export interface ServiceThumbnailFields {
  thumbnail_url?: string | null;
  image_urls?: { url?: string }[];
  service_thumbnail_url?: string | null;
}

/** Resolved hero/cover image for a catalog service (Spatie thumbnail or explicit URL). */
export function resolveServiceThumbnailSrc(service: ServiceThumbnailFields | null | undefined): string | null {
  if (!service) return null;
  const raw =
    service.thumbnail_url ||
    service.service_thumbnail_url ||
    service.image_urls?.[0]?.url;
  if (!raw) return null;
  return getMediaUrl(raw, "service");
}

/** Category card/hero image from uploaded thumbnail. */
export function resolveCategoryThumbnailSrc(category: CategoryMediaFields | null | undefined): string | null {
  if (!category) return null;
  return resolveCategoryCardImageSrc(category);
}

/**
 * Hero background: explicit override → CMS/default URL → null (use logo fallback in hero).
 */
export function resolveMarketingHeroBgImage(
  override?: string | null,
  cmsOrDefault?: string | null
): string | null {
  if (override) {
    const resolved = override.startsWith("http") || override.startsWith("/")
      ? getMediaUrl(override, "service")
      : getMediaUrl(override, "service");
    if (resolved) return resolved;
  }
  if (cmsOrDefault) {
    const resolved = getMediaUrl(cmsOrDefault, "service");
    if (resolved) return resolved;
  }
  return null;
}
