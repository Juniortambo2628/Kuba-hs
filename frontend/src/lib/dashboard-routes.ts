/** URL segment for dashboard areas (routes use `client`, not DB role `customer`). */
export type DashboardArea = "client" | "provider" | "admin";

export function roleToDashboardArea(role: string | undefined): DashboardArea {
  if (role === "admin") return "admin";
  if (role === "provider") return "provider";
  return "client";
}

export function dashboardHref(area: DashboardArea, ...segments: string[]): string {
  const path = ["", "dashboard", area, ...segments.filter(Boolean)].join("/");
  return path.replace(/\/+$/, "") || `/dashboard/${area}`;
}

export function dashboardHrefForRole(role: string | undefined, ...segments: string[]): string {
  return dashboardHref(roleToDashboardArea(role), ...segments);
}
