"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, LayoutDashboard, Home } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { getS, getImg } = useCMS();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#0B0F19] border-b border-gray-200 dark:border-white/5 h-20">
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getImg('branding', 'site_logo', '') ? (
              <img src={getImg('branding', 'site_logo', '')} alt="Logo" className="h-12 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xl">
                {getS('branding', 'site_name', 'K')[0]}
              </div>
            )}
            <span className="sr-only">{getS('branding', 'site_name', 'KUBA')}</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {getImg('branding', 'site_logo', '') ? (
               <img src={getImg('branding', 'site_logo', '')} alt="Logo" className="h-12 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-xl">
                {getS('branding', 'site_name', 'K')[0]}
              </div>
            )}
            <span className="sr-only">{getS('branding', 'site_name', 'KUBA')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/providers" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
              Providers
            </Link>
            <Link href="/about" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/investors" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-white transition-colors">
              Investors
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {user ? (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-sky-50 border border-sky-100 p-0 overflow-hidden group">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-sky-600 text-white font-black text-xs uppercase">
                          {user.name.substring(0, 2)}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-gray-100 shadow-xl">
                    <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-gray-400">Account</DropdownMenuLabel>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-black text-[#1E293B] truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">{user.role} member</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer">
                      <Link href="/" className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                        <Home className="w-4 h-4" /> Back to Home
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider w-full">
                        <LogOut className="w-4 h-4" /> Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white dark:bg-[#0B0F19] border-gray-200 dark:border-white/10">
                <div className="flex flex-col gap-6 mt-12">
                  <Link href="/services" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                    Services
                  </Link>
                  <Link href="/providers" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                    Providers
                  </Link>
                  <Link href="/about" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                    Contact
                  </Link>
                  <Link href="/investors" className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-white">
                    Investors
                  </Link>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />
                  <Link href="/login" className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sign In
                  </Link>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full w-full">
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
