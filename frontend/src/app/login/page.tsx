"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { default as Link } from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ChevronLeft } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthFormHeader } from "@/components/auth/AuthFormHeader";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";

function LoginForm() {
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
            const path = user.role === 'admin' ? '/admin' : '/dashboard';
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
      theme="blue"
      visualBgClass="bg-primary"
      visualContent={
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center text-primary-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold leading-snug text-primary-foreground">
            Connecting you with trusted pros for all your home services.
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20" />
            <div className="space-y-1">
              <div className="w-20 h-1.5 bg-primary-foreground/30 rounded-full" />
              <div className="w-14 h-1 bg-primary-foreground/15 rounded-full" />
            </div>
          </div>
        </div>
      }
    >
      <AuthFormHeader 
        title="Welcome back" 
        subtitle="Please enter your details to sign in." 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-semibold tracking-widest capitalize text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className={designSystem.typography.auth.label}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={designSystem.typography.auth.input}
            />
          </div>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="password" className="text-[10px] font-semibold text-muted-foreground tracking-widest ml-1 capitalize">Password</Label>
            <Input
              id="password"
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
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-input accent-primary" />
            <Label htmlFor="remember" className="text-[10px] font-semibold text-muted-foreground tracking-widest capitalize">Remember me</Label>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest capitalize cursor-default" title="Coming soon">
            Forgot password?
          </span>
        </div>
        
        <div className="space-y-4">
          <Button 
              type="submit" 
              className={designSystem.typography.auth.button}
              disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </Button>

          <AuthSocialButtons isLoading={isLoading} />
        </div>
      </form>

      <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest capitalize">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary dark:text-indigo-400 font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    }>
        <LoginForm />
    </Suspense>
  );
}
