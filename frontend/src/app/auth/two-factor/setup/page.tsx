"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { AuthPageShell, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { Shield, KeyRound, Copy, Check, Loader2 } from "lucide-react";

export default function TwoFactorSetupPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { content, footerHref, showSocialProof } = useAuthPageContent("client_login");

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<"setup" | "verify" | "done">("setup");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      // Check if 2FA is already enabled
      if (!user.two_factor_setup_required) {
        router.push("/dashboard");
        return;
      }
      fetchSetup();
    }
  }, [user, router]);

  const fetchSetup = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/two-factor");
      setQrCode(res.data.qr_code);
      setSecret(res.data.secret);
      setRecoveryCodes(res.data.recovery_codes || []);
      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to initialize 2FA setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);
    try {
      await axiosInstance.post("/api/auth/two-factor/confirm", { code });
      setStep("done");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={showSocialProof}>
      <div className="space-y-6">
        {/* Step: Setup QR Code */}
        {step === "setup" && (
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 mx-auto text-teal-500" />
            <h2 className="text-xl font-semibold">Set Up Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
          </div>
        )}

        {/* Step: Verify Code */}
        {step === "verify" && (
          <>
            <div className="text-center space-y-2">
              <Shield className="h-10 w-10 mx-auto text-teal-500" />
              <h2 className="text-lg font-semibold">Verify Your Authenticator</h2>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with your authenticator app, then enter the 6-digit code below.
              </p>
            </div>

            {qrCode && (
              <div className="flex justify-center">
                <div
                  className="p-4 bg-white rounded-xl border"
                  dangerouslySetInnerHTML={{ __html: qrCode }}
                />
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Or enter this secret manually:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">{secret}</code>
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <AuthIconInput
                id="code"
                icon={KeyRound}
                type="text"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />

              <AuthPrimaryButton accent="client" isLoading={isVerifying}>
                Verify & Enable
              </AuthPrimaryButton>
            </form>
          </>
        )}

        {/* Step: Done - Show Recovery Codes */}
        {step === "done" && (
          <>
            <div className="text-center space-y-2">
              <Check className="h-10 w-10 mx-auto text-emerald-500" />
              <h2 className="text-lg font-semibold">Two-Factor Enabled!</h2>
              <p className="text-sm text-muted-foreground">
                Save these recovery codes in a safe place. Each code can only be used once.
              </p>
            </div>

            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Recovery Codes</span>
                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code, i) => (
                  <code key={i} className="text-sm font-mono bg-background px-2 py-1 rounded">
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <AuthPrimaryButton accent="client" isLoading={false} onClick={handleContinue}>
              Continue to Dashboard
            </AuthPrimaryButton>
          </>
        )}
      </div>
    </AuthPageShell>
  );
}
