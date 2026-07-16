"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPageShell, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { handleApiError } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { content, footerHref } = useAuthPageContent("forgot_password");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const message = await forgotPassword(email);
      setSuccess(message);
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={false}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            {success}
          </p>
        )}

        <AuthIconInput
          id="email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthPrimaryButton accent={content.accent} isLoading={isLoading}>
          {content.submitLabel}
        </AuthPrimaryButton>

        <p className="text-center text-sm text-muted-foreground">
          <Link href={footerHref} className="font-medium text-teal-600 hover:underline">
            Return to sign in
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
