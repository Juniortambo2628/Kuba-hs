/**
 * Public header & megamenu — Attio-inspired minimal navigation tokens.
 */
export const navUi = {
  bar: "w-full border-b border-border/40 bg-[#fafaf9]/95 dark:bg-[#0c0e12]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#fafaf9]/90 transition-shadow duration-200",
  barScrolled: "shadow-md shadow-black/5 border-border/60",
  inner: "flex h-[4.25rem] sm:h-[4.5rem] items-center justify-between gap-6",
  brand: "relative h-11 w-44 sm:h-12 sm:w-52 md:h-14 md:w-60 shrink-0",
  navCluster: "hidden md:flex flex-1 items-center justify-center gap-0.5",
  link: "px-4 py-2 text-sm font-medium rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5",
  linkActive: "bg-muted text-foreground dark:bg-white/10 dark:text-foreground",
  actions: "hidden md:flex items-center gap-2 shrink-0",
  signIn:
    "cursor-pointer text-sm font-medium text-foreground/80 hover:text-foreground px-3 py-2 rounded-full transition-colors",
  cta: "h-9 px-5 rounded-full text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-sm",
  megamenuWrap: "absolute left-0 right-0 top-full pt-3 px-4 sm:px-6 lg:px-8 pointer-events-none",
  megamenuPanel:
    "pointer-events-auto mx-auto max-w-5xl rounded-2xl border border-border/50 bg-card/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] p-6 md:p-8",
  megamenuItem:
    "flex gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-colors hover:bg-muted/60 dark:hover:bg-white/5 group/item",
  megamenuItemActive: "bg-muted/80 dark:bg-white/8",
  megamenuIcon:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted dark:bg-white/10 text-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors",
  megamenuTitle: "text-sm font-semibold text-foreground leading-tight",
  megamenuDesc: "text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2",
  megamenuSectionLabel: "text-sm font-bold text-primary mb-3",
  megamenuSideLink:
    "block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors",
  megamenuSideLinkActive: "bg-muted text-foreground",
} as const;
