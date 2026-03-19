"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ChevronLeft } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import Link from "next/link";

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

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm space-y-8">
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Home
          </Link>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/branding/Kuba-Logo-Login-Light-mode.png" alt="KUBA" className="h-10 w-auto dark:hidden" />
            <img src="/assets/branding/Kuba-Logo-Login-Dark-mode.png" alt="KUBA" className="h-10 w-auto hidden dark:block" />
          </Link>

          <div>
            <h1 className={designSystem.typography.auth.h1}>Welcome back</h1>
            <p className={designSystem.typography.auth.subtitle}>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-semibold tracking-widest uppercase text-center">
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
                <Label htmlFor="password" className="text-[10px] font-semibold text-muted-foreground tracking-widest ml-1 uppercase">Password</Label>
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
                <Label htmlFor="remember" className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Remember me</Label>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase cursor-default" title="Coming soon">
                Forgot password?
              </span>
            </div>
            
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

            <Button 
                type="button" 
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-14 border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5 rounded-2xl font-bold text-[11px] tracking-widest uppercase"
            >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
            </Button>
          </form>

          <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary dark:text-indigo-400 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-end p-16">
        <div className="space-y-6 max-w-md">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center text-primary-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold leading-snug text-primary-foreground">
            Connecting you with trusted professionals for all your home service needs.
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20" />
            <div className="space-y-1">
              <div className="w-20 h-1.5 bg-primary-foreground/30 rounded-full" />
              <div className="w-14 h-1 bg-primary-foreground/15 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
