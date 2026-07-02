/**
 * Build a public URL for a provider profile (slug preferred, UUID still works via API).
 */

export { toSlug } from "@/lib/slug";
import { toSlug } from "@/lib/slug";

interface ProviderLinkSource {
  id?: string | number;
  slug?: string;
  business_name?: string;
}

export function providerHref(provider: ProviderLinkSource): string {
  const slug =
    provider.slug ||
    (provider.business_name ? toSlug(provider.business_name) : undefined);

  if (slug) {
    return `/providers/${slug}`;
  }

  if (provider.id != null) {
    return `/providers/${provider.id}`;
  }

  return "/providers";
}
