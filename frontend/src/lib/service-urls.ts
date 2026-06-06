/**
 * Build a slug-based URL for a catalog service detail page.
 *
 * @returns URL like `/services/deep-cleaning`
 */

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SlugService {
  id?: string | number;
  name: string;
  slug?: string;
  service?: { name?: string; slug?: string } | null;
}

export function serviceDetailHref(service: SlugService): string {
  const nested = service.service;
  const svcSlug =
    service.slug ||
    (nested?.slug ?? (nested?.name ? toSlug(nested.name) : undefined)) ||
    toSlug(service.name);

  return `/services/${svcSlug}`;
}
