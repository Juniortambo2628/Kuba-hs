"use client";

import { useState } from "react";
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
import { AuthPageShell, AuthFormDivider, AuthPrimaryButton } from "@/components/auth/AuthPageShell";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { useAuthPageContent } from "@/hooks/useAuthPageContent";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
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

export default function ClientRegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { content, footerHref, showSocialProof } = useAuthPageContent("client_register");

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
      await authRegister({ ...data, role: "customer" });
      toast.success("Welcome to Kuba! Account created.");
      router.push("/auth/two-factor/setup");
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
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" className={authUi.input} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last name" className={authUi.input} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

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
                    placeholder="name@example.com"
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

          <AuthFormDivider />
          <AuthSocialButtons isLoading={isLoading} />
        </form>
      </Form>
    </AuthPageShell>
  );
}
