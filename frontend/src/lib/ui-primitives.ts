/**
 * Cross-surface UI tokens — public marketing, dashboards, marketplace.
 * Prefer shared components in `@/components/shared/ui` that consume these tokens.
 */

export const uiPrimitives = {
  layout: {
    /** Public marketing / marketplace content width */
    page: "w-full max-w-[min(100%,96rem)] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10",
    /** Nav / megamenu — full viewport width with generous horizontal padding */
    nav: "w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
    pageNarrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
    pageProse: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-24",
    sectionMd: "py-16 md:py-20",
    sectionSm: "py-10 md:py-16",
    /** Landing page sections — comfortable padding, natural page scroll */
    sectionLanding: "py-16 md:py-24",
    /** Standard 3-column card grid (1 → 2 → 3 cols) */
    grid3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0",
  },
  pill: {
    base: "inline-flex items-center gap-2 font-bold capitalize tracking-widest",
    hero:
      "px-4 py-1.5 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full",
    section:
      "px-4 py-1.5 text-xs font-semibold tracking-tight text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full",
    accent:
      "px-4 py-2 text-[10px] rounded-xl bg-primary/10 border border-primary/20 text-primary",
    muted:
      "px-3 py-1 text-[10px] rounded-full bg-muted text-muted-foreground uppercase tracking-wide font-bold",
    count:
      "px-4 py-2 text-[10px] rounded-xl bg-primary/5 text-primary border border-primary/10 shrink-0",
    tab:
      "rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all whitespace-nowrap",
  },
  label: {
    /** Section titles in megamenu, command palette, etc. — no uppercase tracking */
    sectionHeading: "text-sm font-bold text-primary mb-3",
    caps: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
    capsPrimary: "text-[10px] font-bold uppercase tracking-widest text-primary",
    field: "text-xs font-semibold text-muted-foreground tracking-wider",
    fieldBlock: "text-[10px] font-bold capitalize tracking-widest text-muted-foreground/60 ml-1",
  },
  surface: {
    card: "rounded-2xl border border-border/40 bg-card shadow-sm",
    cardElevated:
      "rounded-2xl border border-border/40 bg-white dark:bg-zinc-900 shadow-xl shadow-primary/5",
    panel: "rounded-2xl border border-border/40 bg-muted/30 dark:bg-white/5",
    padding: "p-4 md:p-5",
    paddingLg: "p-5 md:p-6",
    ctaPrimary:
      "rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-primary/20 bg-primary dark:bg-indigo-950/40 shadow-xl shadow-primary/20",
  },
  filter: {
    label: "text-[10px] font-bold capitalize tracking-widest text-muted-foreground/60 ml-1",
    labelBlock: "text-xs font-semibold text-muted-foreground tracking-wider mb-3 block",
    select:
      "w-full h-10 bg-white dark:bg-black border border-border/40 rounded-xl px-4 text-xs font-bold tracking-tight text-foreground outline-none focus:ring-2 focus:ring-primary/20",
    selectMuted:
      "h-10 bg-muted dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 text-xs font-bold text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all",
    resetLink: "text-[10px] font-bold text-primary capitalize tracking-widest hover:underline",
    segmentBase:
      "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border",
    segmentActive: "bg-primary text-white border-primary shadow-lg shadow-primary/20",
    segmentInactive:
      "bg-white dark:bg-black text-muted-foreground border-border/40 hover:border-primary/40",
    checkboxBox: "w-5 h-5 rounded border flex items-center justify-center transition-all",
    checkboxBoxOn: "border-primary bg-primary",
    checkboxBoxOff: "border-gray-300 dark:border-white/20",
    radioOuter: "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
    radioOuterOn: "border-primary",
    radioOuterOff: "border-gray-300 dark:border-white/20",
    radioInner: "w-2.5 h-2.5 rounded-full bg-primary transition-transform",
  },
  empty: {
    dashboard:
      "border border-dashed border-border min-h-[240px] flex items-center justify-center flex-col gap-4 text-center bg-transparent shadow-none rounded-2xl p-6",
    dashboardIcon: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground",
    dashboardTitle: "text-[10px] font-semibold text-foreground uppercase tracking-normal",
    dashboardDescription: "text-[11px] text-muted-foreground",
    marketing:
      "text-center py-24 bg-slate-50 dark:bg-zinc-900 border border-border/40 rounded-[3rem]",
    marketingIconWrap:
      "w-24 h-24 rounded-full bg-white dark:bg-black flex items-center justify-center mx-auto mb-8 shadow-xl",
    marketingTitle: "text-3xl font-bold tracking-tight mb-3",
    marketingDescription: "text-muted-foreground font-medium mb-10 max-w-sm mx-auto italic",
    premiumIcon:
      "relative h-20 w-20 bg-slate-50 dark:bg-white/5 border border-border/50 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5",
    premiumTitle: "text-2xl font-bold text-foreground mb-4 tracking-tight",
    premiumDescription: "text-muted-foreground mb-10 leading-relaxed font-medium",
  },
  button: {
    base: "rounded-xl font-semibold transition-all normal-case tracking-normal",
    sm: "h-10 px-5 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-7 text-sm",
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
    secondary: "border border-border hover:bg-muted text-foreground",
    outlineDashed: "border-dashed border-border hover:border-primary/40",
    ghost: "hover:bg-muted text-muted-foreground",
  },
  badge: {
    verified:
      "rounded-xl border border-border/40 bg-white/80 dark:bg-black/80 backdrop-blur-xl text-primary text-[10px] font-black tracking-widest capitalize gap-2 shadow-lg",
    rating:
      "rounded-lg border border-amber-100 dark:border-amber-500/10 bg-amber-50 dark:bg-amber-500/5 text-amber-500 text-[11px] font-black gap-1.5",
    count: "rounded-lg bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5",
    status: "rounded-full text-[10px] font-bold tracking-wide px-3 py-1",
  },
} as const;
