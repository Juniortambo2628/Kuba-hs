/**
 * Canonical category ordering used by landing page components.
 * Single source of truth — avoids duplication across FeaturedServices & Categories.
 */
export const CATEGORY_ORDER = [
  "Cleaning & Maintenance",
  "Electrical",
  "Health & Wellness",
  "Personal & Grooming",
  "Education & Training",
  "Food & Hospitality",
  "Professional Services",
  "Legal Services",
  "Technology & IT Services",
  "HR Services",
  "Financial Services",
  "Commercial Real Estate",
  "Commercial Logistics",
] as const;

/**
 * Sort an array of category objects by the canonical CATEGORY_ORDER.
 * Categories not in the list are placed at the end, sorted alphabetically.
 */
export function sortCategoriesByOrder<T extends { name: string }>(data: T[]): T[] {
  const orderedNames: readonly string[] = CATEGORY_ORDER;
  return [...data].sort((a, b) => {
    const indexA = orderedNames.indexOf(a.name);
    const indexB = orderedNames.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}
