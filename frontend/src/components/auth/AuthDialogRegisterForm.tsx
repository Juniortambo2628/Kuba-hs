"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { dialogFormUi } from "@/lib/crud-dialog-ui";
import {
  DialogFormField,
  DialogFormSection,
} from "@/components/shared/dialog/TabbedDialogLayout";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(8, "At least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function AuthDialogRegisterForm() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "+254",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      await authRegister({ ...data, role: "customer" });
      toast.success("Welcome to Kuba!");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <DialogFormSection>
          <DialogFormField label="First name">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input className={dialogFormUi.input} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
          <DialogFormField label="Last name">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input className={dialogFormUi.input} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
          <DialogFormField label="Email">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      className={dialogFormUi.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
          <DialogFormField label="Phone">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input className={dialogFormUi.input} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
          <DialogFormField label="Password">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className={dialogFormUi.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
          <DialogFormField label="Confirm password">
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className={dialogFormUi.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </DialogFormField>
        </DialogFormSection>

        <Button
          type="submit"
          className={cn("w-full h-11 rounded-lg font-semibold")}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          <Link
            href="/register/client"
            className="hover:text-primary underline-offset-2 hover:underline"
          >
            Full registration page
          </Link>
        </p>
      </form>
    </Form>
  );
}
