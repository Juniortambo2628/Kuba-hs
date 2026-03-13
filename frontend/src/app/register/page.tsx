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
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { default as Link } from "next/link";
import { Loader2, ArrowLeft, Mail, Lock, User, Phone, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["customer", "provider"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "customer",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      await authRegister(data);
      toast.success("Account created successfully.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex font-sans text-white">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-10 py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="KUBA" className="h-10 w-auto brightness-0 invert" />
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-gray-400 text-sm">Join thousands of users finding trusted pros.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-300">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-300">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-300">I want to sign up as a</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full h-12 bg-[#1A1A1A] border-gray-800 border-2 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 outline-none px-4 text-gray-300"
                        {...field}
                      >
                        <option value="customer">Customer (Looking for services)</option>
                        <option value="provider">Service Provider (Offering services)</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-12 bg-[#1A1A1A] border-gray-800 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 border-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-500" />
                  </FormItem>
                )}
              />

              <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#E5E7EB] hover:bg-white text-black font-semibold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center mt-6"
                  disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  "REGISTER"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-500 font-semibold hover:underline px-1">
              Sign in
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
