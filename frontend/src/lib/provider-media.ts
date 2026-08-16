import { getMediaUrl } from "@/lib/utils";

export { isPlaceholderAvatarUrl } from "./avatar-url";
import { isPlaceholderAvatarUrl } from "./avatar-url";

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
