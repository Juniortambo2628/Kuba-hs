/** Dribbble-style split CRUD modal — intro column + nested form card */
export const crudDialogUi = {
  content:
    "max-w-4xl w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl",
  layout: "flex flex-col md:flex-row min-h-[min(520px,85dvh)] max-h-[calc(100dvh-5.75rem)]",
  intro:
    "md:w-[38%] shrink-0 flex flex-col justify-between p-7 sm:p-9 bg-muted border-b md:border-b-0 md:border-r border-border/50",
  introTitle: "text-2xl sm:text-[1.65rem] font-bold text-foreground tracking-tight leading-tight",
  introDesc: "text-sm text-foreground/75 mt-3 leading-relaxed max-w-sm",
  main: "flex flex-1 flex-col min-w-0 min-h-0 bg-card",
  formWrap: "flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 kuba-scroll",
  formCard:
    "rounded-xl border border-border/50 bg-background/80 shadow-sm p-5 sm:p-6 min-h-[200px]",
  footer:
    "shrink-0 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-border/50 bg-muted/10",
  cancelBtn: "rounded-full",
  submitBtn: "rounded-full min-w-[8rem]",
} as const;
