"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { default as Link } from "next/link";
import { Loader2, Zap, Briefcase, ChevronLeft } from "lucide-react";
import { designSystem } from "@/lib/design-system";

const registerSchema = z.object({
  business_name: z.string().min(2, "Business or full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function ProviderRegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      business_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      // For provider, we split business name into first/last for the base user if needed, 
      // but here we just pass it along.
      const [first_name, ...last_parts] = data.business_name.split(' ');
      await authRegister({ 
        first_name: first_name || "Provider", 
        last_name: last_parts.join(' ') || "User", 
        email: data.email, 
        password: data.password, 
        password_confirmation: data.password_confirmation,
        role: 'provider' 
      });
      toast.success("Welcome aboard! Let's set up your profile.");
      router.push("/dashboard/provider/profile");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 py-6">
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-emerald-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Home
          </Link>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/branding/Kuba-Logo-Login-Light-mode.png" alt="KUBA" className="h-10 w-auto dark:hidden" />
            <img src="/assets/branding/Kuba-Logo-Login-Dark-mode.png" alt="KUBA" className="h-10 w-auto hidden dark:block" />
          </Link>

          <div>
            <h1 className={designSystem.typography.auth.h1}>Grow Your Business</h1>
            <p className={designSystem.typography.auth.subtitle}>Join Kuba's network of elite service professionals.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={designSystem.typography.auth.label}>Business Name / Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Nairobi Plumbing Experts"
                        className={designSystem.typography.auth.input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-semibold tracking-widest uppercase ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={designSystem.typography.auth.label}>Work Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="business@example.com"
                        className={designSystem.typography.auth.input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-semibold tracking-widest uppercase ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={designSystem.typography.auth.label}>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={designSystem.typography.auth.input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-semibold tracking-widest uppercase ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={designSystem.typography.auth.label}>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={designSystem.typography.auth.input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-semibold tracking-widest uppercase ml-1" />
                  </FormItem>
                )}
              />

              <Button 
                  type="submit" 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl transition-all tracking-widest text-[11px] uppercase shadow-emerald-500/20"
                  disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Start Offering Services"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            Already have an account?{" "}
            <Link href="/login/provider" className="text-emerald-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase border-t border-border/50 pt-4">
            Looking for a pro?{" "}
            <Link href="/register/client" className="text-emerald-600 font-bold hover:underline">
              Register as client
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Column - Emerald Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 relative overflow-hidden flex-col justify-end p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/50 to-transparent" />
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold leading-snug text-white">
            Access hundreds of daily service requests and earn more with Kuba.
          </h2>
          <div className="space-y-4">
             {[
               { icon: <Briefcase className="w-4 h-4" />, text: "Zero listing fees for the first month" },
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
      </div>
    </div>
  );
}
