"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Home, UserCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAvatarDisplayUrl } from "@/lib/avatar-url";
import { dashboardHrefForRole } from "@/lib/dashboard-routes";

interface UserAccountDropdownProps {
  className?: string;
  align?: "start" | "center" | "end";
  variant?: "navbar" | "dashboard";
}

function roleLabel(role: string) {
  if (role === "admin") return "Admin";
  if (role === "provider") return "Professional";
  return "Customer";
}

export function UserAccountDropdown({
  className,
  align = "end",
  variant = "navbar",
}: UserAccountDropdownProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isDashboard = variant === "dashboard";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 outline-none group transition-all rounded-full cursor-pointer",
              isDashboard
                ? "p-1.5 hover:bg-muted"
                : "h-10 w-10 p-0 overflow-hidden border border-border/60 bg-muted/50"
            )}
          >
            {isDashboard && (
              <div className="text-right hidden sm:block mr-1">
                <p className="text-sm font-semibold text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {roleLabel(user.role)}
                </p>
              </div>
            )}

            <Avatar className={cn(isDashboard ? "h-8 w-8" : "h-full w-full")}>
              <AvatarImage src={getAvatarDisplayUrl(user.avatar_url) ?? ""} />
              <AvatarFallback
                className={cn(
                  "text-xs font-semibold",
                  isDashboard ? "bg-muted text-primary" : "bg-primary text-primary-foreground"
                )}
              >
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className="w-56 mt-2 rounded-2xl border-border shadow-xl p-2">
          <div className="px-3 py-2.5 mb-1">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          <DropdownMenuSeparator className="mb-1" />

          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/" className="flex items-center gap-3 text-sm font-medium">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/dashboard" className="flex items-center gap-3 text-sm font-medium">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          {user.role !== "admin" && (
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
              <Link
                href={dashboardHrefForRole(user.role, "profile")}
                className="flex items-center gap-3 text-sm font-medium"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={() => logout()}
            className="rounded-xl text-destructive focus:text-destructive cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-3 text-sm font-medium w-full">
              <LogOut className="w-4 h-4" />
              Sign out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
