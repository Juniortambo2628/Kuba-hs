"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

export type AuthDialogMode = "sign-in" | "register";
export type AuthDialogIntent = "book" | "general";

export interface OpenAuthDialogOptions {
  mode?: AuthDialogMode;
  intent?: AuthDialogIntent;
  title?: string;
  description?: string;
  /** Runs after successful sign-in or registration */
  onSuccess?: () => void;
}

interface AuthDialogContextValue {
  isOpen: boolean;
  mode: AuthDialogMode;
  intent: AuthDialogIntent;
  title: string;
  description: string;
  openAuthDialog: (options?: OpenAuthDialogOptions) => void;
  closeAuthDialog: () => void;
  setMode: (mode: AuthDialogMode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(
  undefined
);

const DEFAULT_COPY: Record<
  AuthDialogIntent,
  { title: string; description: string }
> = {
  book: {
    title: "Sign in to book",
    description:
      "Create a free account or sign in to book services and message professionals on Kuba.",
  },
  general: {
    title: "Sign in to continue",
    description: "Sign in or create an account to use this feature.",
  },
};

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthDialogMode>("sign-in");
  const [intent, setIntent] = useState<AuthDialogIntent>("general");
  const [title, setTitle] = useState(DEFAULT_COPY.general.title);
  const [description, setDescription] = useState(DEFAULT_COPY.general.description);
  const onSuccessRef = useRef<(() => void) | null>(null);

  const closeAuthDialog = useCallback(() => {
    setIsOpen(false);
    onSuccessRef.current = null;
  }, []);

  const openAuthDialog = useCallback((options?: OpenAuthDialogOptions) => {
    const nextIntent = options?.intent ?? "general";
    const copy = DEFAULT_COPY[nextIntent];
    setIntent(nextIntent);
    setTitle(options?.title ?? copy.title);
    setDescription(options?.description ?? copy.description);
    setMode(options?.mode ?? "sign-in");
    onSuccessRef.current = options?.onSuccess ?? null;
    setIsOpen(true);
  }, []);

  const completeSuccess = useCallback(() => {
    const fn = onSuccessRef.current;
    onSuccessRef.current = null;
    setIsOpen(false);
    fn?.();
  }, []);

  useEffect(() => {
    if (user && isOpen && onSuccessRef.current) {
      completeSuccess();
    }
  }, [user, isOpen, completeSuccess]);

  return (
    <AuthDialogContext.Provider
      value={{
        isOpen,
        mode,
        intent,
        title,
        description,
        openAuthDialog,
        closeAuthDialog,
        setMode,
      }}
    >
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  }
  return ctx;
}
