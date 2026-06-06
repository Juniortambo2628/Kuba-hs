import { getMediaUrl } from "@/lib/utils";

/** Auto-generated avatars (ui-avatars, dicebear, local placeholders) — not real uploads. */
export function isPlaceholderAvatarUrl(url: string | null | undefined): boolean {
  if (!url || !url.trim()) return true;
  const v = url.trim();
  return (
    v.includes("ui-avatars.com") ||
    v.includes("dicebear.com") ||
    v.startsWith("/placeholders/")
  );
}

export interface ProviderImageFields {
  logo?: string | null;
  banner?: string | null;
  user?: { avatar_url?: string | null };
}

/**
 * Marketplace card / hero image: business logo → storefront banner → uploaded user avatar.
 */
export function resolveProviderCardImageUrl(provider: ProviderImageFields): string | null {
  const logo = provider.logo;
  if (logo && !isPlaceholderAvatarUrl(logo)) {
    return getMediaUrl(logo, "avatar");
  }

  const banner = provider.banner;
  if (banner && !isPlaceholderAvatarUrl(banner)) {
    return getMediaUrl(banner, "avatar");
  }

  const avatar = provider.user?.avatar_url;
  if (avatar && !isPlaceholderAvatarUrl(avatar)) {
    return getMediaUrl(avatar, "avatar");
  }

  return null;
}

/** Small avatar chip (host row, list fallback): same priority as card image. */
export function resolveProviderProfileImageUrl(
  avatarUrl?: string | null,
  logo?: string | null,
  banner?: string | null
): string | null {
  return resolveProviderCardImageUrl({
    logo,
    banner,
    user: { avatar_url: avatarUrl },
  });
}
