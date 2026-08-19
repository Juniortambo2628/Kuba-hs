"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, KeyRound } from "lucide-react";
import {
  AuthPageShell,
  AuthFormDivider,
  AuthPrimaryButton,
} from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import axiosInstance from "@/lib/axios";
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
  const { login, logout, user, isLoading: authLoading, checkAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [emailCodeMode, setEmailCodeMode] = useState(false);
  const [emailCodeStep, setEmailCodeStep] = useState<"email" | "code">("email");
  const [emailCodeEmail, setEmailCodeEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [emailCodeError, setEmailCodeError] = useState("");

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

  const handleRequestEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailCodeError("");
    if (!emailCodeEmail) return;
    setIsEmailCodeLoading(true);
    try {
      await axiosInstance.post("/api/auth/email-code/request", { email: emailCodeEmail });
      setEmailCodeStep("code");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send code";
      setEmailCodeError(message);
    } finally {
      setIsEmailCodeLoading(false);
    }
  };

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailCodeError("");
    if (emailCode.length !== 6) return;
    setIsEmailCodeLoading(true);
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
      const res = await axiosInstance.post("/api/auth/email-code/verify", { email: emailCodeEmail, code: emailCode });
      if (res.data?.two_factor_required) {
        router.push("/auth/two-factor/challenge");
        return;
      }
      if (res.data?.user) {
        if (res.data.user.role !== "admin") {
          setEmailCodeError("This account does not have admin access.");
          return;
        }
        await checkAuth();
        router.push("/admin");
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid code";
      setEmailCodeError(message);
    } finally {
      setIsEmailCodeLoading(false);
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

        {/* Email code login */}
        {!emailCodeMode ? (
          <>
            <AuthFormDivider />
            <button
              type="button"
              onClick={() => {
                setEmailCodeMode(true);
                setEmailCodeStep("email");
                setEmailCodeError("");
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              Sign in with email code
            </button>
          </>
        ) : (
          <>
            <AuthFormDivider />
            <div className="space-y-4 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Email code sign-in
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEmailCodeMode(false);
                    setEmailCodeStep("email");
                    setEmailCodeError("");
                    setEmailCode("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Back to password
                </button>
              </div>
              {emailCodeError && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {emailCodeError}
                </p>
              )}
              {emailCodeStep === "email" ? (
                <form onSubmit={handleRequestEmailCode} className="space-y-3">
                  <AuthIconInput
                    id="admin-email-code-email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="admin@kuba.co.ke"
                    value={emailCodeEmail}
                    onChange={(e) => setEmailCodeEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={!emailCodeEmail || isEmailCodeLoading}
                    className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {isEmailCodeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      "Send code"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailCode} className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Code sent to <span className="font-medium text-foreground">{emailCodeEmail}</span>
                  </p>
                  <AuthIconInput
                    id="admin-email-code"
                    icon={KeyRound}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEmailCodeStep("email")}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={emailCode.length !== 6 || isEmailCodeLoading}
                      className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {isEmailCodeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        "Verify & sign in"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}

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
