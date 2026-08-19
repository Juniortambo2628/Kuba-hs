"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, Fingerprint, KeyRound } from "lucide-react";
import { AuthPageShell, AuthFormDivider, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { usePasskeys } from "@/hooks/usePasskeys";
import axiosInstance from "@/lib/axios";

function ProviderLoginForm() {
  const { login, user, isLoading: authLoading, checkAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const { content, footerHref, showSocialProof } = useAuthPageContent("provider_login");
  const { isSupported: passkeySupported, authenticateWithPasskey } = usePasskeys();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const googleError = searchParams.get("error");

  const [emailCodeMode, setEmailCodeMode] = useState(false);
  const [emailCodeStep, setEmailCodeStep] = useState<"email" | "code">("email");
  const [emailCodeEmail, setEmailCodeEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [emailCodeError, setEmailCodeError] = useState("");
  const [emailCodeSuccess, setEmailCodeSuccess] = useState("");

  useEffect(() => {
    if (googleError === "google_auth_failed") {
      setError("Google sign-in failed. Try email and password or try again.");
    }
  }, [googleError]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.two_factor_setup_required) {
        router.push("/auth/two-factor/setup");
      } else if (redirectPath && redirectPath.startsWith("/")) {
        router.push(redirectPath);
      } else {
        router.push(user.role === "admin" ? "/admin" : "/dashboard/provider");
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
      const typedErr = err as { twoFactorRequired?: boolean; response?: { data?: { message?: string } }; message?: string };
      if (typedErr.twoFactorRequired) {
        router.push("/auth/two-factor/challenge");
        return;
      }
      const message = typedErr?.response?.data?.message || typedErr?.message || "Authentication rejected.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setError("");
    setIsPasskeyLoading(true);
    try {
      const result = await authenticateWithPasskey();
      if (result.user_id) {
        await login({ passkey_user_id: result.user_id });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Passkey sign-in failed. Try again.";
      setError(message);
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleRequestEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailCodeError("");
    setEmailCodeSuccess("");
    if (!emailCodeEmail) return;
    setIsEmailCodeLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/email-code/request", { email: emailCodeEmail });
      setEmailCodeSuccess(res.data?.message || "Code sent successfully.");
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
        await checkAuth();
        router.push(res.data.user.role === "admin" ? "/admin" : "/dashboard/provider");
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid code";
      setEmailCodeError(message);
    } finally {
      setIsEmailCodeLoading(false);
    }
  };

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={showSocialProof}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <AuthIconInput
          id="provider-email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="business@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthIconInput
          id="provider-password"
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
            className="text-sm font-medium text-emerald-600 hover:underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        <AuthPrimaryButton accent={content.accent} isLoading={isLoading}>
          {content.submitLabel}
        </AuthPrimaryButton>

        {/* Passkey sign-in option */}
        {passkeySupported && (
          <>
            <AuthFormDivider />
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={isLoading || isPasskeyLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {isPasskeyLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Fingerprint className="h-4 w-4" />
              )}
              Sign in with Passkey
            </button>
          </>
        )}

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
                setEmailCodeSuccess("");
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
              {emailCodeSuccess && emailCodeStep === "code" && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {emailCodeSuccess}
                </p>
              )}
              {emailCodeStep === "email" ? (
                <form onSubmit={handleRequestEmailCode} className="space-y-3">
                  <AuthIconInput
                    id="provider-email-code-email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={emailCodeEmail}
                    onChange={(e) => setEmailCodeEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={!emailCodeEmail || isEmailCodeLoading}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
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
                    id="provider-email-code"
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
                      onClick={() => {
                        setEmailCodeStep("email");
                        setEmailCodeSuccess("");
                      }}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={emailCode.length !== 6 || isEmailCodeLoading}
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
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

        <AuthFormDivider />
        <AuthSocialButtons role="provider" isLoading={isLoading} />
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50">
        Looking for a service?{" "}
        <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
          Sign in as client
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default function ProviderLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProviderLoginForm />
    </Suspense>
  );
}
