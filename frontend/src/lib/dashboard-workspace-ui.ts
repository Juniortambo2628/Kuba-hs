/**
 * Workspace dashboard layout tokens (greeting bar, insight cards, schedule panel).
 */
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
