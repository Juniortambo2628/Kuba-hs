"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Mail, Lock, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
      // Redirect handled by useEffect above
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
    <div className="min-h-screen bg-black flex font-sans text-white">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative">
        <div className="w-full max-w-md space-y-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="KUBA" className="h-10 w-auto brightness-0 invert" />
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-gray-400 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center"
              >
                {error}
              </motion.div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border border-gray-700 bg-gray-900 flex items-center justify-center cursor-pointer">
                  {/* Custom Checkbox */}
                </div>
                <label className="text-xs text-gray-400 font-medium">Remember me</label>
              </div>
              <Link href="#" className="text-xs text-indigo-500 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button 
                type="submit" 
                className="w-full h-12 bg-[#E5E7EB] hover:bg-white text-black font-semibold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center"
                disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              ) : (
                "SIGN IN"
              )}
            </Button>

            <Button 
                type="button" 
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-transparent border-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-500 font-semibold hover:underline px-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-end p-20">
        <div className="space-y-6 max-w-lg">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-medium leading-tight text-white italic">
            "Connecting you with trusted professionals for all your home service needs. Fast, reliable, and secure."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-400" />
            <div className="space-y-0.5">
              <div className="w-24 h-2 bg-white/20 rounded-full" />
              <div className="w-16 h-1.5 bg-white/10 rounded-full" />
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
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
    }>
        <LoginForm />
    </Suspense>
  );
}
