"use client";

import { useState, ComponentType } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

interface AuthIconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ className?: string }>;
  showToggle?: boolean;
}

export function AuthIconInput({
  icon: Icon,
  showToggle,
  className,
  type = "text",
  ...props
}: AuthIconInputProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="relative">
      <Icon className={authUi.inputIcon} aria-hidden />
      <Input
        type={inputType}
        className={cn(authUi.input, className)}
        {...props}
      />
      {isPassword && showToggle && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
