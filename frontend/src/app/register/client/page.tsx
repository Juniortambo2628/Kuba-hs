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
import { Loader2, ShieldCheck, UserCheck, ChevronLeft } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthFormHeader } from "@/components/auth/AuthFormHeader";

const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function ClientRegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "+254",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      await authRegister({ ...data, role: 'customer' });
      toast.success("Welcome to Kuba! Account created.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      theme="indigo"
      visualBgClass="bg-indigo-600"
      visualContent={
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/50 to-transparent" />
          <div className="relative z-10 space-y-6 max-w-md">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold leading-snug text-white">
              Join thousands of Kenyans finding verified, high-quality home service professionals.
            </h2>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                      {i}
                    </div>
                  ))}
               </div>
               <p className="text-xs font-semibold text-indigo-100">Trusted by 10,000+ users</p>
            </div>
          </div>
        </>
      }
    >
      <AuthFormHeader 
        title="Find Trusted Pros" 
        subtitle="Join Kuba to book quality home services in minutes." 
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={designSystem.typography.auth.label}>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
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
              name="last_name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={designSystem.typography.auth.label}>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className={designSystem.typography.auth.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-semibold tracking-widest uppercase ml-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={designSystem.typography.auth.label}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
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
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={designSystem.typography.auth.label}>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+254 700 000 000"
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
              className={designSystem.typography.auth.button}
              disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Create Client Account"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
        Are you a Professional?{" "}
        <Link href="/register/provider" className="text-primary dark:text-indigo-400 font-bold hover:underline">
          Register here
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
