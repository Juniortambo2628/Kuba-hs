"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthPageShell, AuthFormDivider, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";

function LoginForm() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const { content, footerHref, showSocialProof } = useAuthPageContent("client_login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleError = searchParams.get("error");
  const resetStatus = searchParams.get("reset");

  useEffect(() => {
    if (googleError === "google_auth_failed") {
      setError("Google sign-in failed. Try email and password or try again.");
    }
  }, [googleError]);

  useEffect(() => {
    if (!authLoading && user) {
      if (redirectPath && redirectPath.startsWith("/")) {
        router.push(redirectPath);
      } else {
        router.push(user.role === "admin" ? "/admin" : "/dashboard");
      }
    }
  }, [authLoading, user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Authentication rejected.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={showSocialProof}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {resetStatus === "success" && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            Your password has been reset. Sign in with your new password.
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
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
        <AuthIconInput
          id="password"
          icon={Lock}
          type="password"
          showToggle
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#0d9488] hover:underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        <AuthPrimaryButton accent={content.accent} isLoading={isLoading}>
          {content.submitLabel}
        </AuthPrimaryButton>

        <AuthFormDivider />
        <AuthSocialButtons isLoading={isLoading} />
      </form>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
