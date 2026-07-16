/**
 * Marketplace listing tokens — categories, services, providers (public browse surfaces).
 */
import { uiPrimitives } from "@/lib/ui-primitives";

export const marketplaceUi = {
  listing: {
    root: "group block h-full",
    media:
      "relative aspect-[4/5] w-full min-h-[16rem] sm:min-h-[18rem] md:min-h-[20rem] overflow-hidden rounded-2xl bg-muted",
    /** Inset frame: border follows image radius; use with gridCard shell padding */
    mediaBordered:
      "border border-border/[0.08] dark:border-white/[0.07] shadow-sm",
    mediaImage:
      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
    /** List layout thumbnail (services, categories, providers) */
    listMedia:
      "relative w-full sm:w-[260px] md:w-[300px] aspect-[5/4] sm:min-h-[220px] shrink-0 overflow-hidden rounded-2xl bg-muted",
    mediaGradient:
      "absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent pointer-events-none",
    badge:
      "absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/50 dark:border-white/12 bg-white/95 dark:bg-zinc-900/95 px-3.5 py-2 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm",
    /** Frosted glass panel over image (grid cards) */
    frostedPanel:
      "absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-white/50 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 py-3.5 shadow-[0_8px_32px_rgba(15,23,42,0.12)]",
    frostedTitle:
      "text-base md:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors [overflow-wrap:anywhere]",
    frostedBadge:
      "inline-flex items-center gap-1.5 rounded-full border border-border/45 dark:border-white/12 bg-background/75 dark:bg-background/45 px-3 py-1.5 text-xs font-semibold text-foreground",
    frostedPriceCol: "min-w-0 flex-1 flex flex-col items-start text-left gap-0.5",
    frostedActionRow:
      "flex items-end justify-between gap-3 mt-2.5 pt-2.5 border-t border-border/30",
    frostedPrice: "shrink-0 text-right pl-2",
    readMoreBtn:
      "mt-1.5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 min-h-9 text-sm font-bold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90",
    frostedPriceLabel:
      "text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
    frostedPriceMain:
      "text-lg md:text-xl font-bold leading-none tracking-tight text-foreground tabular-nums",
    frostedPriceUnit: "text-[11px] font-semibold text-muted-foreground mt-0.5",
    priceWrap: "absolute bottom-4 right-4 z-10 m-1",
    pricePill:
      "inline-flex flex-col items-end rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-white/60 dark:border-white/10 px-4 py-2.5 shadow-sm backdrop-blur-md",
    priceLabel: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
    priceMain: "text-lg font-bold leading-none tracking-tight text-foreground tabular-nums",
    priceUnit: "text-[10px] font-semibold text-muted-foreground mt-0.5",
    body: "pt-3 space-y-2",
    title: "text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors [overflow-wrap:anywhere]",
    subtitle: "text-sm text-muted-foreground line-clamp-1",
    hostRow: "flex items-center gap-2 min-w-0",
    hostName: "text-xs font-medium text-muted-foreground truncate",
    metaRow: "flex flex-wrap items-center gap-2 pt-1",
    metaChip:
      "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-muted-foreground",
    hostLink:
      "flex items-center gap-2 min-w-0 mt-2.5 rounded-lg px-2 py-0.5 w-fit hover:bg-muted/60 transition-colors",
  },
  card: {
    base: "transition-all duration-300",
    /** Padding so bordered media + footer info sit inset from the card edge */
    gridShell: "p-3",
    gridOutline:
      "border border-border/[0.08] dark:border-white/[0.07] shadow-sm",
    hover: "hover:opacity-[0.98]",
    radiusLg: "rounded-2xl",
    radiusMd: "rounded-2xl",
    radiusSm: "rounded-xl",
    padding: "pt-3",
    paddingCompact: "p-4 md:p-5",
  },
  iconBox: {
    sm: "w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500",
    md: "w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500",
    lg: "w-20 h-20 rounded-[1.5rem] bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500",
  },
  meta: {
    label: uiPrimitives.label.capsPrimary,
    muted: uiPrimitives.label.caps,
  },
  price: {
    label: "text-[9px] text-muted-foreground font-black tracking-widest capitalize",
    value: "text-foreground font-black tracking-tighter",
  },
  search: {
    row: "group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 border border-transparent hover:border-border transition-all",
    rowSelectable:
      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-muted",
    rowSelected: "bg-primary/10 border-primary/20",
    avatarBox: "w-14 h-14 rounded-xl bg-muted border border-border overflow-hidden shrink-0 relative",
    avatarBoxSm: "w-10 h-10 rounded-lg overflow-hidden shrink-0 relative",
    chevron: "p-2 rounded-full bg-muted/50 group-hover:bg-primary transition-all group-hover:text-primary-foreground",
  },
} as const;

export type MarketplaceLayout = "grid" | "list";
