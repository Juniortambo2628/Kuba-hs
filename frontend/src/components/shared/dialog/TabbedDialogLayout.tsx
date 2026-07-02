"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { dialogFormUi } from "@/lib/crud-dialog-ui";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";

export interface TabbedDialogTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface TabbedDialogLayoutProps {
  tabs: TabbedDialogTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  sidebarFooter?: React.ReactNode;
}

export function TabbedDialogLayout({
  tabs,
  activeTab,
  onTabChange,
  title,
  description,
  children,
  footer,
  onClose,
  className,
  sidebarFooter,
}: TabbedDialogLayoutProps) {
  return (
    <div className={cn(dialogFormUi.shell, "relative bg-card", className)}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 rounded-full p-2 bg-background/80 border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <aside className={cn(dialogFormUi.sidebar, onClose && "pt-10 sm:pt-6")}>
        <div className="mb-5 pr-6">
          <h2 className={crudDialogUi.introTitle}>{title}</h2>
          {description && <p className={crudDialogUi.introDesc}>{description}</p>}
        </div>
        <nav className="flex flex-col gap-1 flex-1 min-h-0" aria-label="Dialog sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  dialogFormUi.tab,
                  active && dialogFormUi.tabActive,
                  tab.disabled && "opacity-40 pointer-events-none"
                )}
              >
                {Icon && <Icon className={dialogFormUi.tabIcon} />}
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
        {sidebarFooter}
      </aside>

      <div className={cn(dialogFormUi.main, "min-h-0")}>
        <div className={cn(dialogFormUi.body, "flex flex-col min-h-0")}>
          <div className={cn(dialogFormUi.formCard, "flex-1 min-h-0")}>{children}</div>
        </div>

        {footer && <div className={dialogFormUi.footer}>{footer}</div>}
      </div>
    </div>
  );
}

interface DialogFormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function DialogFormField({ label, hint, children, className }: DialogFormFieldProps) {
  return (
    <div className={cn(dialogFormUi.fieldRow, className)}>
      <div className={dialogFormUi.fieldLabel}>
        <span>{label}</span>
        {hint && <p className={dialogFormUi.fieldHint}>{hint}</p>}
      </div>
      <div className={dialogFormUi.fieldControl}>{children}</div>
    </div>
  );
}

export function DialogFormSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(dialogFormUi.section, className)}>{children}</div>;
}
