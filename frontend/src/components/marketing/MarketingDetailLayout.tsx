import { ReactNode } from "react";
import { marketingUi } from "@/lib/marketing-ui";

interface MarketingDetailLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

/** Two-column detail layout aligned with marketing listing pages. */
export function MarketingDetailLayout({ main, sidebar }: MarketingDetailLayoutProps) {
  return (
    <div className={marketingUi.detail.grid}>
      <div className={marketingUi.detail.main}>{main}</div>
      <aside className={marketingUi.detail.sidebar}>
        <div className={marketingUi.listing.sidebarStickyLg}>{sidebar}</div>
      </aside>
    </div>
  );
}
