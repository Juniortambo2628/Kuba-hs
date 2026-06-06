"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAuthDialog,
  type AuthDialogIntent,
  type OpenAuthDialogOptions,
} from "@/contexts/AuthDialogContext";

interface RequireAuthOptions {
  intent?: AuthDialogIntent;
  title?: string;
  description?: string;
  mode?: OpenAuthDialogOptions["mode"];
}

/**
 * Run an action only when the visitor is signed in; otherwise open the auth dialog.
 * Returns true if the action ran immediately, false if auth was prompted.
 */
export function useAuthAction() {
  const { user, isLoading } = useAuth();
  const { openAuthDialog } = useAuthDialog();

  const requireAuth = useCallback(
    (onAuthed: () => void, options?: RequireAuthOptions) => {
      if (isLoading) return false;
      if (user) {
        onAuthed();
        return true;
      }
      openAuthDialog({
        intent: options?.intent ?? "general",
        title: options?.title,
        description: options?.description,
        mode: options?.mode,
        onSuccess: onAuthed,
      });
      return false;
    },
    [user, isLoading, openAuthDialog]
  );

  return { user, isLoading, requireAuth, openAuthDialog };
}

/** Convenience wrapper for booking flows */
export function useBookNowAuth() {
  const { requireAuth } = useAuthAction();

  const requireAuthToBook = useCallback(
    (onAuthed: () => void, providerName?: string) => {
      return requireAuth(onAuthed, {
        intent: "book",
        description: providerName
          ? `Sign in to book with ${providerName} and manage your appointments on Kuba.`
          : undefined,
      });
    },
    [requireAuth]
  );

  return { requireAuthToBook };
}
