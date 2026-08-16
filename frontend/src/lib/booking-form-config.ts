/**
 * Resolves marketplace category name for booking form templates.
 */
export function resolveServiceCategoryName(service: {
  category?: string | { name?: string } | null;
  service?: { category?: string | { name?: string } | null; name?: string };
  name?: string;
} | null | undefined): string | null {
  if (!service) return null;
  if (typeof service.category === "string" && service.category.trim()) {
    return service.category.trim();
  }
  if (service.category && typeof service.category === "object" && service.category.name) {
    return service.category.name;
  }
  const nested = service.service?.category;
  if (typeof nested === "string" && nested.trim()) return nested.trim();
  if (nested && typeof nested === "object" && nested.name) return nested.name;
  return null;
}

const BOOKING_CATEGORY_ALIASES: Record<string, string> = {
  "Financial & Legal": "Professional Services",
  Plumbing: "Cleaning & Maintenance",
};

export function resolveBookingCategoryKey(categoryName: string | null): string | null {
  if (!categoryName) return null;
  return BOOKING_CATEGORY_ALIASES[categoryName] ?? categoryName;
}
