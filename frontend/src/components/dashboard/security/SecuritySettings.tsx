"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePasskeys } from "@/hooks/usePasskeys";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield,
  Fingerprint,
  Smartphone,
  Key,
  Trash2,
  Plus,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Passkey, TwoFactorStatus, TwoFactorSetupResponse } from "@/types";
import { FieldLabel } from "@/components/shared/ui";
import { cn } from "@/lib/utils";

interface SecuritySettingsProps {
  role: "customer" | "provider";
}

export function SecuritySettings({ role }: SecuritySettingsProps) {
  const { user, checkAuth } = useAuth();
  const { passkeys, isSupported, fetchPasskeys, registerPasskey, deletePasskey } = usePasskeys();

  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [isLoading2FA, setIsLoading2FA] = useState(true);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetupResponse | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isConfirming2FA, setIsConfirming2FA] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [isRegeneratingCodes, setIsRegeneratingCodes] = useState(false);

  // Passkey states
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [newPasskeyName, setNewPasskeyName] = useState("");
  const [showAddPasskeyDialog, setShowAddPasskeyDialog] = useState(false);

  const profilePath = role === "customer" ? "/dashboard/client/profile" : "/dashboard/provider/profile";

  // Fetch 2FA status
  const fetch2FAStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/auth/two-factor");
      setTwoFactorStatus(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading2FA(false);
    }
  }, []);

  useEffect(() => {
    fetchPasskeys();
    fetch2FAStatus();
  }, [fetchPasskeys, fetch2FAStatus]);

  // --- 2FA Setup ---
  const start2FASetup = async () => {
    setIsSettingUp2FA(true);
    try {
      const res = await axiosInstance.post("/api/auth/two-factor");
      setTwoFactorSetup(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to start 2FA setup";
      toast.error(message);
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const confirm2FA = async () => {
    if (twoFactorCode.length !== 6) return;
    setIsConfirming2FA(true);
    try {
      const res = await axiosInstance.post("/api/auth/two-factor/confirm", { code: twoFactorCode });
      setRecoveryCodes(res.data.recovery_codes);
      setShowRecoveryCodes(true);
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      await fetch2FAStatus();
      await checkAuth();
      toast.success("2FA enabled successfully");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid code";
      toast.error(message);
    } finally {
      setIsConfirming2FA(false);
    }
  };

  const disable2FA = async () => {
    if (!disablePassword) return;
    setIsDisabling2FA(true);
    try {
      await axiosInstance.delete("/api/auth/two-factor", { data: { password: disablePassword } });
      setShowDisableDialog(false);
      setDisablePassword("");
      await fetch2FAStatus();
      await checkAuth();
      toast.success("2FA disabled");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to disable 2FA";
      toast.error(message);
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const regenerateRecoveryCodes = async () => {
    setIsRegeneratingCodes(true);
    try {
      const res = await axiosInstance.get("/api/auth/two-factor/recovery-codes");
      setRecoveryCodes(res.data.recovery_codes);
      setShowRecoveryCodes(true);
      toast.success("New recovery codes generated. Old codes are now invalid.");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to regenerate codes";
      toast.error(message);
    } finally {
      setIsRegeneratingCodes(false);
    }
  };

  // --- Passkeys ---
  const addPasskey = async () => {
    if (!isSupported) {
      toast.error("Passkeys are not supported on this device");
      return;
    }
    setIsAddingPasskey(true);
    try {
      await registerPasskey(newPasskeyName || undefined);
      await fetchPasskeys();
      setShowAddPasskeyDialog(false);
      setNewPasskeyName("");
      toast.success("Passkey added");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || "Failed to add passkey";
      toast.error(message);
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const removePasskey = async (id: string) => {
    try {
      await deletePasskey(id);
      toast.success("Passkey removed");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to remove passkey";
      toast.error(message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account security, passkeys, and two-factor authentication.</p>
      </div>

      {/* Passkeys Section */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10">
              <Fingerprint className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Passkeys</h2>
              <p className="text-sm text-muted-foreground">
                Sign in with biometrics or security keys instead of passwords.
              </p>
            </div>
          </div>
          {isSupported && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowAddPasskeyDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {!isSupported && (
          <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
            Passkeys are not supported on this device or browser.
          </div>
        )}

        {passkeys.length > 0 ? (
          <div className="space-y-2">
            {passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{passkey.name || "Unnamed passkey"}</p>
                    <p className="text-xs text-muted-foreground">
                      {passkey.authenticator_type === "platform" ? "Device biometric" : "Security key"}
                      {passkey.last_used_at && ` · Last used ${new Date(passkey.last_used_at).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removePasskey(passkey.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          isSupported && (
            <p className="text-sm text-muted-foreground">No passkeys added yet. Add one for faster, more secure sign-in.</p>
          )
        )}
      </section>

      {/* Two-Factor Authentication Section */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security with a one-time code from an authenticator app.
              </p>
            </div>
          </div>
          {twoFactorStatus && !twoFactorStatus.enabled && !twoFactorSetup && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={start2FASetup}
              disabled={isSettingUp2FA}
            >
              {isSettingUp2FA ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Smartphone className="h-4 w-4 mr-1" />
              )}
              Enable
            </Button>
          )}
        </div>

        {isLoading2FA ? (
          <Skeleton className="h-16 rounded-xl" />
        ) : twoFactorStatus?.enabled ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                <Check className="h-4 w-4" />
                Two-factor authentication is enabled
              </div>
              {twoFactorStatus.confirmed_at && (
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                  Enabled on {new Date(twoFactorStatus.confirmed_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={regenerateRecoveryCodes}
                disabled={isRegeneratingCodes}
              >
                {isRegeneratingCodes ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Key className="h-4 w-4 mr-1" />
                )}
                New Recovery Codes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-destructive hover:text-destructive"
                onClick={() => setShowDisableDialog(true)}
              >
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : twoFactorSetup ? (
          <div className="space-y-4">
            {!showRecoveryCodes ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code below.
                </p>
                <div className="flex justify-center p-4 bg-white rounded-xl">
                  <div dangerouslySetInnerHTML={{ __html: twoFactorSetup.qr_code }} className="[&_svg]:w-48 [&_svg]:h-48" />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Verification Code</FieldLabel>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    className="h-11 rounded-xl text-center text-lg tracking-[0.5em] font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      setTwoFactorSetup(null);
                      setTwoFactorCode("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-full"
                    onClick={confirm2FA}
                    disabled={twoFactorCode.length !== 6 || isConfirming2FA}
                  >
                    {isConfirming2FA ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Verify & Enable
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Save these recovery codes
                  </div>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                    Store them somewhere safe. Each code can only be used once.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center justify-between rounded-lg border border-border p-2 px-3 font-mono text-sm"
                    >
                      <span>{code}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(code)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedCode === code ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  className="rounded-full w-full"
                  onClick={() => {
                    setShowRecoveryCodes(false);
                    setRecoveryCodes([]);
                  }}
                >
                  I&apos;ve saved my recovery codes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
            Two-factor authentication is not enabled. We strongly recommend enabling it for account security.
          </div>
        )}
      </section>

      {/* Email Code Login Info */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Email Login Code</h2>
            <p className="text-sm text-muted-foreground">
              Sign in with a one-time code sent to your email — no password needed.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          This option is available on the <a href="/login" className="text-teal-600 hover:underline">login page</a>. Select &quot;Sign in with email code&quot; to receive a 6-digit code at <span className="font-medium text-foreground">{user.email}</span>.
        </div>
      </section>

      {/* Add Passkey Dialog */}
      <Dialog open={showAddPasskeyDialog} onOpenChange={setShowAddPasskeyDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add a passkey</DialogTitle>
            <DialogDescription>
              Give your passkey a name so you can identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <FieldLabel>Name (optional)</FieldLabel>
              <Input
                placeholder="e.g. My phone, Work laptop"
                value={newPasskeyName}
                onChange={(e) => setNewPasskeyName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => setShowAddPasskeyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={addPasskey}
              disabled={isAddingPasskey}
            >
              {isAddingPasskey ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Fingerprint className="h-4 w-4 mr-2" />
              )}
              Add passkey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Disable two-factor authentication</DialogTitle>
            <DialogDescription>
              Enter your password to confirm. Your account will be less secure without 2FA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                setShowDisableDialog(false);
                setDisablePassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={disable2FA}
              disabled={!disablePassword || isDisabling2FA}
            >
              {isDisabling2FA ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
