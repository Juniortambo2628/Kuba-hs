"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { default as Link } from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, Briefcase, ChevronLeft } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthFormHeader } from "@/components/auth/AuthFormHeader";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";

function ProviderLoginForm() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (redirectPath && redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else {
        const path = user.role === 'admin' ? '/admin' : '/dashboard/provider';
        router.push(path);
      }
    }
  }, [authLoading, user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Authentication rejected."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      theme="emerald"
      visualBgClass="bg-emerald-600"
      visualContent={
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/50 to-transparent" />
          <div className="relative z-10 space-y-6 max-w-md">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold leading-snug text-white">
              Welcome back! Manage your services, track earnings, and grow your business on Kuba.
            </h2>
            <div className="space-y-4">
              {[
                { icon: <Briefcase className="w-4 h-4" />, text: "Real-time order tracking and management" },
                { icon: <Zap className="w-4 h-4" />, text: "Instant payout on job completion" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-emerald-50 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </>
      }
    >
      <AuthFormHeader 
        title="Provider Sign In" 
        subtitle="Access your merchant dashboard and manage services." 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-semibold tracking-widest uppercase text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="provider-email" className={designSystem.typography.auth.label}>Work Email</Label>
            <Input
              id="provider-email"
              type="email"
              placeholder="business@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={designSystem.typography.auth.input}
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="provider-password" className="text-[10px] font-semibold text-muted-foreground tracking-widest ml-1 uppercase">Password</Label>
            <Input
              id="provider-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={designSystem.typography.auth.input}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember-provider" className="h-4 w-4 rounded border-input accent-emerald-600" />
            <Label htmlFor="remember-provider" className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Remember me</Label>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase cursor-default" title="Coming soon">
            Forgot password?
          </span>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl transition-all tracking-widest text-[11px] uppercase shadow-emerald-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>

          <AuthSocialButtons role="provider" isLoading={isLoading} />
        </div>
      </form>

      <div className="space-y-4 pt-4">
        <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
          Don&apos;t have a provider account?{" "}
          <Link href="/register/provider" className="text-emerald-600 font-bold hover:underline">
            Register as Provider
          </Link>
        </p>

        <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase border-t border-border/50 pt-4">
          Looking for a service?{" "}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">
            Sign in as Client
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
export default function ProviderLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <ProviderLoginForm />
    </Suspense>
  );
}
