/** Dribbble-style provider portfolio page tokens */
export const providerProfileUi = {
  gradientBand:
    "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-200/80 via-rose-100/90 to-sky-50 dark:from-violet-950/50 dark:via-rose-950/30 dark:to-slate-900/80 border border-white/60 dark:border-white/10",
  mainSection:
    "relative -mt-6 md:-mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start z-20",
  contentCard:
    "rounded-[2rem] border border-border/50 bg-card shadow-sm px-5 sm:px-8 pb-10 pt-6 md:pt-8 min-w-0",
  contentCardMain: "lg:col-span-8 xl:col-span-9",
  contentCardFull: "lg:col-span-12",
  mapAside: "lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[6rem] self-start",
  avatar:
    "relative h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 shrink-0 rounded-2xl border-4 border-card shadow-xl overflow-hidden bg-muted",
  statValue: "text-2xl md:text-3xl font-bold text-foreground tabular-nums leading-none",
  statLabel: "text-xs font-semibold text-muted-foreground mt-1",
  tab:
    "relative px-1 pb-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
  tabActive: "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:rounded-full",
  workGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6",
  workCard:
    "group block rounded-[1.75rem] overflow-hidden border border-border/40 bg-card hover:border-primary/25 hover:shadow-md transition-all",
  workMedia:
    "relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-900",
  workBadge:
    "absolute top-3 right-3 z-10 rounded-full bg-white/95 dark:bg-zinc-900/95 px-2.5 py-1 text-[10px] font-bold text-foreground shadow-sm",
  achievement:
    "flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 shadow-md text-xs font-black",
} as const;
