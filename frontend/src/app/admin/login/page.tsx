"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Mail, Lock, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
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

  const handleGoogleLogin = () => {
    console.log("Google Login Clicked - Admin");
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
            <h1 className="text-4xl font-semibold tracking-tight">Admin Sign In</h1>
            <p className="text-gray-400 text-sm">Please enter your administrative credentials.</p>
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
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kuba.com"
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
          </form>

          <p className="text-center text-xs text-gray-500">
            Secure administrative terminal. Unauthorized access is prohibited.
          </p>
        </div>
      </div>

      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-end p-20">
        <div className="space-y-6 max-w-lg">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-medium leading-tight text-white italic">
            "Advanced governance tools for the dedicated Kuba administrative infrastructure."
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

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
    }>
        <AdminLoginForm />
    </Suspense>
  );
}
