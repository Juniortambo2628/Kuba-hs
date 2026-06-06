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
