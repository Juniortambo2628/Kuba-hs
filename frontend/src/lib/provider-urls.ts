/**
 * Build a public URL for a provider profile (slug preferred, UUID still works via API).
 */

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
