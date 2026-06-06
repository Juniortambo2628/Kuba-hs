"use client";

import { LogIn, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { AuthDialogSignInForm } from "@/components/auth/AuthDialogSignInForm";
import { AuthDialogRegisterForm } from "@/components/auth/AuthDialogRegisterForm";
import { TabbedDialogLayout } from "@/components/shared/dialog/TabbedDialogLayout";
import { dialogBelowNavClass } from "@/lib/footer-ui";
import { cn } from "@/lib/utils";

const AUTH_TABS = [
  { id: "sign-in" as const, label: "Sign in", icon: LogIn },
  { id: "register" as const, label: "Create account", icon: UserPlus },
];

export function AuthDialog() {
  const { isOpen, mode, title, description, closeAuthDialog, setMode } = useAuthDialog();

  const activeTab = mode;
  const panelTitle = activeTab === "sign-in" ? "Sign in" : "Create account";
  const panelDesc =
    activeTab === "sign-in"
      ? "Use your email and password to continue."
      : "Set up your profile to book services on Kuba.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthDialog()}>
      <DialogContent
        className={cn(
          "w-[calc(100%-1.5rem)] sm:max-w-[min(100%,44rem)] p-0 gap-0 overflow-hidden border-border/60 shadow-2xl",
          dialogBelowNavClass.maxHeight,
          dialogBelowNavClass.centerTop,
          "translate-x-[-50%] translate-y-[-50%]",
          "[&>button.absolute]:hidden"
        )}
      >
        <DialogTitle className="sr-only">{title || panelTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || panelDesc}
        </DialogDescription>
        <TabbedDialogLayout
          tabs={AUTH_TABS}
          activeTab={activeTab}
          onTabChange={(id) => setMode(id as "sign-in" | "register")}
          title={title || panelTitle}
          description={description || panelDesc}
          onClose={closeAuthDialog}
        >
          {activeTab === "sign-in" ? (
            <AuthDialogSignInForm />
          ) : (
            <AuthDialogRegisterForm />
          )}
        </TabbedDialogLayout>
      </DialogContent>
    </Dialog>
  );
}
