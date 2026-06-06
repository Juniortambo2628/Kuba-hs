import { uiPrimitives } from "@/lib/ui-primitives";

/**
 * Public marketing / browse listing tokens (providers, services, categories browse).
 */
export const marketingUi = {
  listing: {
    body: "flex-1 py-10 md:py-16 bg-white dark:bg-[#0B0F19] transition-colors duration-300",
    inner: "flex flex-col lg:flex-row gap-8",
    sidebar: "lg:w-72 shrink-0",
    sidebarWide: "lg:w-80 shrink-0",
    sidebarSticky: "sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 kuba-scroll space-y-4",
    sidebarStickyLg: "sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 kuba-scroll space-y-6",
    main: "flex-1 min-w-0 space-y-8",
    filterCard:
      "bg-muted dark:bg-white/5 border-border dark:border-white/10 rounded-2xl overflow-hidden shadow-sm",
    filterCardAlt:
      "bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-border/40 shadow-sm",
    filterCardContent: "p-4 space-y-4",
    filterCardContentLg: "p-5 space-y-4",
    filterTitle: "font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm tracking-wider",
    filterTitleAlt:
      "text-sm font-bold tracking-widest capitalize text-muted-foreground flex items-center gap-2",
    toolbar: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
    resultsMeta: "text-sm text-muted-foreground font-medium",
    viewToggle:
      "flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-border dark:border-white/10",
    viewToggleAlt:
      "flex bg-slate-50 dark:bg-zinc-900 p-1.5 rounded-2xl border border-border/40",
    viewBtnActive: "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400",
    viewBtnInactive: "text-gray-400",
    grid: uiPrimitives.layout.grid3,
    /** Services / browse grids — extra row gap */
    gridBrowse:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-7 lg:gap-x-8 lg:gap-y-12",
    list: "flex flex-col gap-8",
    listCompact: "flex flex-col gap-6",
    empty:
      "text-center py-24 bg-slate-50 dark:bg-zinc-900 border border-border/40 rounded-[3rem]",
  },
  detail: {
    body: "flex-1 py-10 md:py-16 bg-white dark:bg-[#0B0F19] transition-colors duration-300",
    container: "relative z-10",
    grid: "grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12",
    main: "lg:col-span-2 space-y-10 md:space-y-12",
    sidebar: "lg:col-span-1 space-y-6",
    sectionGrid: uiPrimitives.layout.grid3,
  },
} as const;

export type MarketingViewMode = "grid" | "list" | "map";
