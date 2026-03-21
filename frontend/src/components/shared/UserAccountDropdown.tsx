"use client";

import { User as UserType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard, Home, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserAccountDropdownProps {
  className?: string;
  align?: "start" | "center" | "end";
  variant?: "navbar" | "dashboard";
}

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

export function UserAccountDropdown({ className, align = "end", variant = "navbar" }: UserAccountDropdownProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isDashboard = variant === "dashboard";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "flex items-center gap-2 outline-none group transition-all rounded-xl",
            isDashboard ? "p-1.5 hover:bg-accent" : "relative h-10 w-10 p-0 overflow-hidden border border-sky-100 bg-sky-50 rounded-full"
          )}>
            {isDashboard && (
              <div className="text-right hidden sm:block mr-1">
                <p className="text-sm font-black text-foreground leading-tight tracking-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase tracking-tighter">{user.role}</p>
              </div>
            )}
            
            <Avatar className={cn(isDashboard ? "h-8 w-8" : "h-full w-full rounded-none")}>
              <AvatarImage src={getAvatarUrl(user.avatar_url) || ""} />
              <AvatarFallback className={cn(
                "font-black text-xs",
                isDashboard ? "bg-muted text-primary" : "bg-sky-600 text-white"
              )}>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align={align} className="w-56 mt-2 rounded-2xl border-border shadow-xl p-2">
          <DropdownMenuLabel className="font-black text-[10px] tracking-widest text-muted-foreground uppercase px-2 mb-1">
            Account Management
          </DropdownMenuLabel>
          
          <div className="px-3 py-2 bg-muted/30 rounded-xl mb-2">
            <p className="text-sm font-black text-foreground truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-muted-foreground truncate tracking-tighter">{user.email}</p>
          </div>

          <DropdownMenuSeparator className="mb-2" />
          
          <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 dark:focus:bg-sky-500/10 focus:text-sky-600 cursor-pointer py-2.5">
            <Link href="/" className="flex items-center gap-3 font-bold text-xs tracking-wider">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer py-2.5">
            <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xs tracking-wider">
              <LayoutDashboard className="w-4 h-4" /> Dashboard Portal
            </Link>
          </DropdownMenuItem>
          
          {user.role !== 'admin' && (
            <DropdownMenuItem asChild className="rounded-xl focus:bg-muted cursor-pointer py-2.5">
               <Link href={`/dashboard/${user.role}/profile`} className="flex items-center gap-3 font-bold text-xs tracking-wider">
                 <UserCircle className="w-4 h-4" /> My Profile
               </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 text-red-500 cursor-pointer py-2.5">
            <div className="flex items-center gap-3 font-bold text-xs tracking-wider w-full">
              <LogOut className="w-4 h-4" /> Terminate Session
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
