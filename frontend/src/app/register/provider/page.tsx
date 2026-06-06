"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock } from "lucide-react";
import { AuthPageShell, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    business_name: z.string().min(2, "Business or full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function ProviderRegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { content, footerHref, showSocialProof } = useAuthPageContent("provider_register");

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      business_name: "",
      email: "",
      phone: "+254",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      const [first_name, ...last_parts] = data.business_name.split(" ");
      await authRegister({
        first_name: first_name || "Provider",
        last_name: last_parts.join(" ") || "User",
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: "provider",
      });
      toast.success("Welcome aboard! Let's set up your profile.");
      router.push("/dashboard/provider/profile");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell content={content} footerHref={footerHref} showSocialProof={showSocialProof}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Business name or your name"
                    className={cn(authUi.input, "pl-4")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AuthIconInput
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="business@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="+254 700 000 000" className={cn(authUi.input, "pl-4")} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AuthIconInput
                    icon={Lock}
                    type="password"
                    showToggle
                    autoComplete="new-password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AuthIconInput
                    icon={Lock}
                    type="password"
                    showToggle
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <AuthPrimaryButton accent={content.accent} isLoading={isLoading} className="mt-2">
            {content.submitLabel}
          </AuthPrimaryButton>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50">
        Looking for a pro?{" "}
        <Link href="/register/client" className="font-semibold text-emerald-600 hover:underline">
          Register as client
        </Link>
      </p>
    </AuthPageShell>
  );
}
