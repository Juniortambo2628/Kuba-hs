import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";

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
    "flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
  fieldLabel: "text-sm font-medium text-foreground sm:w-[9.5rem] sm:shrink-0 sm:pt-2",
  fieldControl: "flex-1 min-w-0 w-full",
  fieldHint: "text-xs text-muted-foreground mt-1",
  input:
    "h-11 rounded-lg border-border/60 bg-background text-sm font-medium focus-visible:ring-primary/20",
  textarea:
    "min-h-[100px] rounded-lg border-border/60 bg-background text-sm resize-y focus-visible:ring-primary/20 pt-3",
} as const;
