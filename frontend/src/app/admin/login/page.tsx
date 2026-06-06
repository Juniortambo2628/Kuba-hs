"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import {
  AuthPageShell,
  AuthPrimaryButton,
} from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import type { AuthPageContent } from "@/lib/auth-page-content";

const ADMIN_AUTH_CONTENT: AuthPageContent = {
  title: "Admin sign in",
  subtitle: "Enter your credentials to access the platform CMS, bookings, and operations.",
  submitLabel: "Sign in",
  footerPrefix: "Not an administrator?",
  footerLinkLabel: "Client sign in",
  visual: {
    headline: "Manage providers, bookings, and site content from one secure hub.",
    caption: "Authorized Kuba team access only. All sign-in activity is monitored.",
    status: "Admin",
  },
  accent: "client",
};

function AdminLoginForm() {
  const { login, logout, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      const path = redirectPath.startsWith("/") ? redirectPath : "/admin";
      router.push(path);
    }
  }, [authLoading, user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loggedIn = await login({ email, password });
      if (!loggedIn || loggedIn.role !== "admin") {
        setError("This account does not have admin access.");
        await logout();
        return;
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Authentication rejected.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell
      content={ADMIN_AUTH_CONTENT}
      footerHref="/login"
      showSocialProof={false}
      homeHref="/"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <AuthIconInput
          id="admin-email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="admin@kuba.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthIconInput
          id="admin-password"
          icon={Lock}
          type="password"
          showToggle
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthPrimaryButton accent="client" isLoading={isLoading}>
          {ADMIN_AUTH_CONTENT.submitLabel}
        </AuthPrimaryButton>

        <p className="text-center text-[11px] text-muted-foreground">
          Secure administrative access. Unauthorized use is prohibited.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary underline-offset-2 hover:underline">
            Back to public site
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
