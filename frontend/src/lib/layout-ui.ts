/**
 * Page width SSOT — marketing, marketplace detail, dashboards.
 */
import { uiPrimitives } from "@/lib/ui-primitives";
import { dashboardPageContainerClass, type DashboardPageWidth } from "@/lib/dashboard-ui";

export const layoutUi = {
  ...uiPrimitives.layout,
  /** @deprecated use layoutUi.grid3 */
  grid: uiPrimitives.layout.grid3,
} as const;

export type PageContainerVariant =
  | "marketing"
  | "marketing-narrow"
  | "marketing-prose"
  | "marketing-full"
  | DashboardPageWidth;

export function pageContainerClass(
  variant: PageContainerVariant = "marketing",
  extra?: string
): string {
  const base = (() => {
    switch (variant) {
      case "marketing":
        return layoutUi.page;
      case "marketing-narrow":
        return layoutUi.pageNarrow;
      case "marketing-prose":
        return layoutUi.pageProse;
      case "marketing-full":
        return "w-full";
      default:
        return dashboardPageContainerClass(variant);
    }
  })();

  return extra ? `${base} ${extra}` : base;
}
