"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPageShell, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { handleApiError } from "@/lib/axios";

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { content, footerHref } = useAuthPageContent("reset_password");

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("This reset link is invalid or has expired. Request a new link.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push("/login?reset=success");
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <AuthPageShell content={content} footerHref={footerHref} showSocialProof={false}>
        <div className="space-y-4">
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            This password reset link is invalid or incomplete.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex text-sm font-semibold text-[#0d9488] hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={false}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <input type="hidden" name="email" value={email} readOnly />

        <AuthIconInput
          id="password"
          icon={Lock}
          type="password"
          showToggle
          autoComplete="new-password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <AuthIconInput
          id="password_confirmation"
          icon={Lock}
          type="password"
          showToggle
          autoComplete="new-password"
          placeholder="Confirm password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={8}
        />

        <AuthPrimaryButton accent={content.accent} isLoading={isLoading}>
          {content.submitLabel}
        </AuthPrimaryButton>
      </form>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
