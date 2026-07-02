/**
 * Build a slug-based URL for a catalog service detail page.
 *
 * @returns URL like `/services/deep-cleaning`
 */

export { toSlug } from "@/lib/slug";
import { toSlug } from "@/lib/slug";

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
