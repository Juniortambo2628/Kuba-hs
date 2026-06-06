/** Livevisa-inspired marketing footer tokens */
export const footerUi = {
  root: "bg-background text-foreground border-t border-border/50",
  inner: "py-14 sm:py-16",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8",
  brandCol: "lg:col-span-3",
  linkCol: "lg:col-span-2",
  socialCol: "lg:col-span-2 lg:col-start-11",
  logo: "relative h-9 w-40 sm:h-10 sm:w-44 mb-5",
  tagline: "text-sm text-muted-foreground leading-relaxed max-w-xs",
  sectionTitle:
    "text-[11px] font-bold uppercase tracking-[0.12em] text-foreground mb-4",
  link: "text-sm text-muted-foreground hover:text-foreground transition-colors block",
  linkList: "space-y-2.5",
  stackedSection: "space-y-8",
  socialRow: "flex items-center gap-4 mt-4",
  socialIcon:
    "text-muted-foreground hover:text-foreground transition-colors",
  bottomBar:
    "pt-8 mt-10 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground",
  bottomLink: "hover:text-foreground transition-colors",
} as const;

/** Space reserved below sticky nav for centered modals */
export const STICKY_NAV_HEIGHT = "5.75rem";

export const dialogBelowNavClass = {
  maxHeight: `max-h-[calc(100dvh-${STICKY_NAV_HEIGHT})]`,
  centerTop: `top-[calc((100dvh+${STICKY_NAV_HEIGHT})/2)]`,
} as const;
