/** Static global search entries — IDs must be unique across roles (namespace by prefix). */

export type GlobalSearchCategory =
  | "Pages"
  | "Services"
  | "Account"
  | "Quick Actions"
  | "Providers"
  | "Bookings"
  | "Addresses"
  | "Billing";

export interface GlobalSearchStaticEntry {
  id: string;
  title: string;
  url: string;
  category: GlobalSearchCategory;
  description?: string;
}

export const PUBLIC_SEARCH_ENTRIES: GlobalSearchStaticEntry[] = [
  { id: "page-home", title: "Home", url: "/", category: "Pages" },
  { id: "page-services", title: "All Services", url: "/services", category: "Pages" },
  { id: "page-providers", title: "Find Providers", url: "/providers", category: "Pages" },
  { id: "page-about", title: "About Kuba", url: "/about", category: "Pages" },
];

export const CLIENT_SEARCH_ENTRIES: GlobalSearchStaticEntry[] = [
  { id: "client-dashboard", title: "My Dashboard", url: "/dashboard/client", category: "Quick Actions" },
  { id: "client-bookings", title: "My Bookings", url: "/dashboard/client/bookings", category: "Bookings" },
  { id: "client-addresses", title: "Saved Addresses", url: "/dashboard/client/services", category: "Addresses" },
  { id: "client-billing", title: "Billing & Invoices", url: "/dashboard/client/billing", category: "Billing" },
  { id: "client-favorites", title: "Favorite Providers", url: "/dashboard/client/favorites", category: "Quick Actions" },
  { id: "client-messages", title: "Messages", url: "/dashboard/client/messages", category: "Quick Actions" },
  { id: "client-loyalty", title: "Loyalty Rewards", url: "/dashboard/client/loyalty", category: "Account" },
  { id: "client-profile", title: "Account Settings", url: "/dashboard/client/profile", category: "Account" },
];

export const PROVIDER_SEARCH_ENTRIES: GlobalSearchStaticEntry[] = [
  { id: "provider-dashboard", title: "Pro Dashboard", url: "/dashboard/provider", category: "Quick Actions" },
  { id: "provider-bookings", title: "My Bookings", url: "/dashboard/provider/bookings", category: "Bookings" },
  { id: "provider-services", title: "My Services", url: "/dashboard/provider/services", category: "Services" },
  { id: "provider-availability", title: "Availability", url: "/dashboard/provider/availability", category: "Quick Actions" },
  { id: "provider-messages", title: "Messages", url: "/dashboard/provider/messages", category: "Quick Actions" },
  { id: "provider-reviews", title: "Reviews", url: "/dashboard/provider/reviews", category: "Quick Actions" },
  { id: "provider-profile", title: "Pro Profile", url: "/dashboard/provider/profile", category: "Account" },
];

export const ADMIN_SEARCH_ENTRIES: GlobalSearchStaticEntry[] = [
  { id: "admin-dashboard", title: "Admin Portal", url: "/admin", category: "Quick Actions" },
  { id: "admin-categories", title: "Service Categories", url: "/admin/categories", category: "Quick Actions" },
  { id: "admin-users", title: "Manage Users", url: "/admin/users", category: "Quick Actions" },
];

export function dedupeSearchEntries<T extends { id: string; category: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.category}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
