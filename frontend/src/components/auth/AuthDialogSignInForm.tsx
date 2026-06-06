"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dialogFormUi } from "@/lib/dialog-form-ui";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import {
  DialogFormField,
  DialogFormSection,
} from "@/components/shared/dialog/TabbedDialogLayout";
import { cn } from "@/lib/utils";

export function AuthDialogSignInForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Sign in failed. Check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
          {error}
        </p>
      )}

      <DialogFormSection>
        <DialogFormField label="Email">
          <Input
            id="auth-dialog-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={dialogFormUi.input}
          />
        </DialogFormField>
        <DialogFormField label="Password">
          <Input
            id="auth-dialog-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={dialogFormUi.input}
          />
        </DialogFormField>
      </DialogFormSection>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className={cn("w-full h-11 rounded-lg font-semibold")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Sign in"}
      </Button>

      <AuthSocialButtons isLoading={isLoading} />

      <p className="text-center text-[10px] text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-primary underline-offset-2 hover:underline"
        >
          Full sign-in page
        </Link>
      </p>
    </form>
  );
}
