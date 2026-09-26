"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Mail, Lock } from "lucide-react";
import { AuthIconInput } from "@/components/auth/AuthIconInput";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

interface RegisterCredentialFieldsProps<T extends FieldValues> {
  control: Control<T>;
  emailPlaceholder?: string;
}

/** Email, phone, password and password confirmation — shared by both register flows. */
export function RegisterCredentialFields<T extends FieldValues>({
  control,
  emailPlaceholder = "name@example.com",
}: RegisterCredentialFieldsProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={"email" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AuthIconInput
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder={emailPlaceholder}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"phone" as Path<T>}
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
        control={control}
        name={"password" as Path<T>}
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
        control={control}
        name={"password_confirmation" as Path<T>}
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
    </>
  );
}
