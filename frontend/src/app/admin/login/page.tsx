"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

function AdminLoginForm() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
        const path = redirectPath.startsWith('/') ? redirectPath : '/admin';
        router.push(path);
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
    <div className="min-h-screen bg-background flex">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-32 dark:hidden">
              <img src="/assets/branding/logo-light.png" alt="KUBA" className="h-8 w-auto object-contain" />
            </div>
            <div className="relative h-8 w-32 hidden dark:block">
              <img src="/assets/branding/logo-dark.png" alt="KUBA" className="h-8 w-auto object-contain" />
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access the admin panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kuba.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-10"
                disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Secure administrative access. Unauthorized use is prohibited.
          </p>
        </div>
      </div>

      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-end p-16">
        <div className="space-y-6 max-w-md">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center text-primary-foreground">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold leading-snug text-primary-foreground">
            Manage your home services platform with powerful admin tools.
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

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    }>
        <AdminLoginForm />
    </Suspense>
  );
}
