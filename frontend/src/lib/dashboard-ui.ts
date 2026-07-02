/**
 * Dashboard UI tokens — single source for admin + client/provider dashboard surfaces.
 * Import class strings or compose via cn() in shared layout components.
 */

export const dashboardUi = {
  page: {
    /** Standard admin list/detail width */
    container: "max-w-[1400px] mx-auto space-y-8 pb-12",
    /** Wide hubs (messaging, CMS settings) */
    containerWide: "max-w-[1600px] mx-auto space-y-8 pb-12",
    /** Client/provider dashboard pages */
    containerDefault: "max-w-6xl mx-auto space-y-8 pb-12",
  },
  shell: {
    main: "flex-1 bg-[#f4f6f8] dark:bg-background min-h-screen flex flex-col",
    content: "flex-1 overflow-y-auto kuba-scroll",
    contentPadding: "p-4 md:p-6",
    contentPaddingLg: "p-4 md:p-8",
  },
  card: {
    base: "border border-border/40 bg-card shadow-sm rounded-2xl overflow-hidden",
    glass: "border-none bg-card/50 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden",
    premium: "border-none shadow-premium bg-card/50 backdrop-blur-md rounded-2xl overflow-hidden",
    elevated: "border border-border/50 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm",
    padding: "p-4 md:p-5",
    paddingCompact: "p-3 md:p-4",
  },
  dialog: {
    content: "sm:max-w-xl rounded-2xl p-0 overflow-hidden border border-border/40 shadow-2xl",
    header: "p-5 pb-3 bg-muted/30",
    body: "p-5 space-y-6 max-h-[60vh] overflow-y-auto kuba-scroll",
    footer: "p-5 pt-0 flex-col sm:flex-row gap-3",
  },
  skeleton: "rounded-2xl",
  button: {
    primary:
      "h-11 px-6 rounded-xl font-semibold text-sm normal-case tracking-normal shadow-lg shadow-primary/20",
    secondary:
      "h-11 px-6 rounded-xl font-semibold text-sm normal-case tracking-normal border-border",
    destructive:
      "h-11 px-6 rounded-xl font-semibold text-sm normal-case tracking-normal",
  },
  header: {
    title: "text-2xl font-bold text-foreground tracking-tight",
    subtitle: "text-sm text-muted-foreground mt-1",
  },
  table: {
    cardGlass:
      "border-none bg-card/50 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden",
    headerRow: "hover:bg-transparent border-border/50",
    head: "h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
    headFirst:
      "pl-8 h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
    headLast:
      "pr-8 h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right",
    headAlt: "h-16 text-[11px] font-bold text-muted-foreground",
    emptyCaps: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
    emptyDashed:
      "border border-dashed border-border/60 rounded-2xl bg-muted/10 flex flex-col items-center justify-center gap-4 text-muted-foreground",
  },
  alert: {
    cancel: "rounded-xl font-semibold text-sm normal-case tracking-normal",
    confirm: "rounded-xl font-semibold text-sm normal-case tracking-normal",
    confirmDestructive:
      "rounded-xl font-semibold text-sm normal-case tracking-normal bg-red-600 hover:bg-red-700 text-white",
    confirmPrimary:
      "rounded-xl font-semibold text-sm normal-case tracking-normal bg-primary text-primary-foreground hover:bg-primary/90",
  },
  dropdown: {
    label: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground p-2",
    labelAlt: "text-[11px] font-bold text-muted-foreground tracking-tight",
  },
  chrome: {
    portalLabel: "text-[11px] font-bold tracking-tight uppercase text-muted-foreground",
    portalAccent: "text-[11px] font-bold text-primary tracking-tight uppercase",
    quickJump:
      "text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-muted-foreground",
  },
} as const;

/** Workspace dashboard layout tokens (greeting bar, insight cards, schedule panel). */
export const workspaceUi = {
  page: "space-y-6 pb-10",
  greeting: {
    title: "text-2xl md:text-3xl font-bold tracking-tight text-foreground",
    subtitle: "text-sm text-muted-foreground mt-1",
    stat: "text-sm text-muted-foreground",
    statValue: "font-bold text-foreground",
  },
  /** Apple-style frosted panels — shared across workspace pages */
  frosted: {
    surface:
      "rounded-[1.75rem] border border-white/70 dark:border-white/10 bg-white/75 dark:bg-card/55 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]",
    statCard:
      "rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-card/50 backdrop-blur-lg shadow-[0_4px_24px_-6px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.35)]",
    inset:
      "rounded-2xl border border-border/40 bg-muted/30 dark:bg-muted/20 backdrop-blur-sm",
    badge: {
      base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide",
      good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
      info: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
      muted: "bg-muted text-muted-foreground",
      warning: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
    },
  },
  card: "rounded-[1.75rem] border border-border/60 bg-card shadow-sm",
  cardPadding: "p-5 md:p-6",
  insight: {
    base: "rounded-[1.75rem] p-5 md:p-6 relative overflow-hidden min-h-[140px] flex flex-col justify-between",
    action:
      "absolute bottom-4 right-4 h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-md hover:scale-105 transition-transform",
  },
  schedule: {
    featured: "rounded-2xl bg-muted/40 border border-border/50 p-4 space-y-4",
    row: "flex items-center justify-between gap-3 py-3 border-b border-border/40 last:border-0",
  },
  table: {
    wrap: "rounded-[1.75rem] border border-border/60 bg-card shadow-sm overflow-hidden",
    head: "text-[11px] font-semibold text-muted-foreground",
    row: "hover:bg-muted/30 transition-colors",
  },
  input:
    "w-full h-11 rounded-xl border border-border/60 bg-muted/30 px-4 text-sm font-medium text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15",
  textarea:
    "w-full min-h-[120px] rounded-xl border border-border/60 bg-muted/30 p-4 text-sm font-medium text-foreground outline-none resize-none leading-relaxed placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15",
} as const;

export type DashboardPageWidth = "default" | "standard" | "wide" | "narrow" | "compact" | "xl";

export function dashboardPageContainerClass(width: DashboardPageWidth = "standard"): string {
  switch (width) {
    case "wide":
      return dashboardUi.page.containerWide;
    case "default":
      return dashboardUi.page.containerDefault;
    case "narrow":
      return "max-w-5xl mx-auto space-y-8 pb-12";
    case "compact":
      return "max-w-4xl mx-auto space-y-8 pb-12";
    case "xl":
      return "max-w-7xl mx-auto space-y-8 pb-12 p-4 md:p-8";
    default:
      return dashboardUi.page.container;
  }
}
