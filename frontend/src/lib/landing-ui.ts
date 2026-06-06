/**
 * Landing page design tokens — shared CTAs and price chips.
 */
export const landingUi = {
  button: {
    base: "rounded-full font-bold transition-colors inline-flex items-center justify-center gap-2",
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
    secondary:
      "border-2 border-border bg-background text-foreground hover:bg-muted/60",
    ghost: "text-primary hover:bg-primary/10",
    sm: "h-9 px-5 text-sm",
    md: "h-11 px-8 text-sm",
    lg: "h-12 px-10 text-base",
  },
  price: {
    wrap: "inline-flex flex-col items-end rounded-2xl bg-sky-50 dark:bg-sky-950/35 border border-sky-200/70 dark:border-sky-800/50 px-4 py-2.5 shadow-sm",
    label: "text-[11px] font-bold uppercase tracking-wide text-sky-700/80 dark:text-sky-300/90 mb-0.5",
    value: "text-lg md:text-xl font-bold leading-none text-foreground tabular-nums",
  },
} as const;
