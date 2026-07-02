import { cn } from "@/lib/utils";

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

/**
 * Tabbed booking/settings dialogs — aligned with CrudFormDialog split layout.
 */
export const dialogFormUi = {
  shell: cn(crudDialogUi.layout, "w-full overflow-hidden"),
  sidebar: cn(
    crudDialogUi.intro,
    "md:w-[min(100%,280px)] lg:w-[300px] shrink-0 gap-1 border-b md:border-b-0 isolate"
  ),
  tab:
    "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground/70 transition-colors hover:bg-card hover:text-foreground",
  tabActive:
    "bg-card text-foreground shadow-sm border border-border/50",
  tabIcon: "h-4 w-4 shrink-0 opacity-70",
  main: crudDialogUi.main,
  header: "hidden",
  headerTitle: crudDialogUi.introTitle,
  headerDesc: crudDialogUi.introDesc,
  body: cn(crudDialogUi.formWrap, "flex-1"),
  formCard: crudDialogUi.formCard,
  footer: cn(crudDialogUi.footer, "justify-between"),
  footerBtnOutline: crudDialogUi.cancelBtn,
  footerBtnPrimary: crudDialogUi.submitBtn,
  section: "space-y-0 divide-y divide-border/50",
  fieldRow:
    "flex flex-col gap-2 py-4 first:pt-0 last:pb-0",
  fieldLabel: "text-sm font-medium text-foreground",
  fieldControl: "flex-1 min-w-0 w-full",
  fieldHint: "text-xs text-muted-foreground mt-1",
  input:
    "h-11 w-full rounded-lg border-border/60 bg-background text-sm font-medium focus-visible:ring-primary/20",
  textarea:
    "min-h-[100px] w-full rounded-lg border-border/60 bg-background text-sm resize-y focus-visible:ring-primary/20 pt-3",
} as const;
