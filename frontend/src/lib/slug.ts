/**
 * Convert a string to a URL-safe slug.
 * Canonical implementation — all slug logic should import from here.
 */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
