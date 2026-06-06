import { getMediaUrl } from "@/lib/utils";

/** True when the value is a storage path, URL, or file — not a Lucide icon name. */
export function isCategoryMediaUrl(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("http://") || v.startsWith("https://")) return true;
  if (v.startsWith("/")) return true;
  if (v.includes("/") || v.includes(".")) return true;
  return false;
}

export interface CategoryMediaFields {
  name: string;
  icon?: string | null;
  dynamic_icon_url?: string | null;
  icon_url?: string | null;
  image_url?: string | null;
}

/** Uploaded category image or Spatie icon URL for cards and avatars. */
export function resolveCategoryCardImageUrl(category: CategoryMediaFields): string | null {
  if (category.image_url && isCategoryMediaUrl(category.image_url)) {
    return category.image_url;
  }
  const dynamic = category.dynamic_icon_url;
  if (dynamic && isCategoryMediaUrl(dynamic)) {
    return dynamic;
  }
  const iconUrl = category.icon_url;
  if (iconUrl && isCategoryMediaUrl(iconUrl)) {
    return iconUrl;
  }
  const icon = category.icon;
  if (icon && isCategoryMediaUrl(icon)) {
    return icon;
  }
  return null;
}

/** Hero/cover: uploaded category thumbnail only (no stock placeholders). */
export function resolveCategoryHeroImage(
  category: CategoryMediaFields,
  fallback?: string | null
): string | null {
  const card = resolveCategoryCardImageUrl(category);
  if (card) {
    return getMediaUrl(card, "service");
  }
  if (fallback && isCategoryMediaUrl(fallback)) {
    return getMediaUrl(fallback, "service");
  }
  return null;
}

export function resolveCategoryCardImageSrc(category: CategoryMediaFields): string | null {
  const path = resolveCategoryCardImageUrl(category);
  return path ? getMediaUrl(path, "service") : null;
}
