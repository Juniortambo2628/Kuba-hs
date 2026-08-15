"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPageShell, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { Shield, KeyRound, Fingerprint, Loader2 } from "lucide-react";
import { usePasskeys } from "@/hooks/usePasskeys";

export default function TwoFactorChallengePage() {
  const { twoFactorChallenge, passkeyLogin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const { content, footerHref, showSocialProof } = useAuthPageContent("client_login");

  const { isSupported: passkeySupported, authenticateWithPasskey } = usePasskeys();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<"totp" | "recovery_code">("totp");

  useEffect(() => {
    if (!authLoading) {
      // If no user and no pending 2FA session, redirect to login
      // The session check happens server-side
    }
  }, [authLoading]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await twoFactorChallenge(code);
      if (redirectPath && redirectPath.startsWith("/")) {
        router.push(redirectPath);
      } else {
        router.push(user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Invalid code. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyAuth = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await authenticateWithPasskey();
      if (result.user_id) {
        await passkeyLogin(result.user_id);
        if (redirectPath && redirectPath.startsWith("/")) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Passkey authentication failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={showSocialProof}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Shield className="h-10 w-10 mx-auto text-teal-500" />
          <h2 className="text-lg font-semibold">Two-Factor Verification</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Method selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setMethod("totp"); setCode(""); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              method === "totp"
                ? "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-400"
                : "border-border hover:bg-muted"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Authenticator Code
          </button>
          <button
            type="button"
            onClick={() => { setMethod("recovery_code"); setCode(""); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              method === "recovery_code"
                ? "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-400"
                : "border-border hover:bg-muted"
            }`}
          >
            Recovery Code
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <AuthIconInput
            id="code"
            icon={KeyRound}
            type="text"
            autoComplete="one-time-code"
            placeholder={method === "totp" ? "Enter 6-digit code" : "Enter recovery code (XXXX-XXXX)"}
            value={code}
            onChange={(e) => setCode(method === "totp" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value)}
            required
          />

          <AuthPrimaryButton accent="client" isLoading={isLoading}>
            Verify
          </AuthPrimaryButton>
        </form>

        {/* Passkey alternative */}
        {passkeySupported && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasskeyAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Fingerprint className="h-4 w-4" />
              Use Passkey Instead
            </button>
          </>
        )}
      </div>
    </AuthPageShell>
  );
}
