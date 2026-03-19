"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, LayoutDashboard, Home, Briefcase } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { getS, getImg } = useCMS();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [navItems, setNavItems] = useState([
    {"id": "nav_1", "label": "Services", "url": "/services"},
    {"id": "nav_2", "label": "Providers", "url": "/providers"},
    {"id": "nav_3", "label": "About", "url": "/about"},
    {"id": "nav_4", "label": "Journal", "url": "/blog"},
    {"id": "nav_5", "label": "Contact", "url": "/contact"},
    {"id": "nav_6", "label": "Investors", "url": "/investors"},
    {"id": "nav_7", "label": "Commercial", "url": "/commercial"},
    {"id": "nav_8", "label": "Cooperatives", "url": "/cooperatives"}
  ]);

  useEffect(() => {
    setMounted(true);
    const navString = getS('navigation_menu');
    if (navString) {
      try {
        setNavItems(JSON.parse(navString));
      } catch (err) {}
    }
  }, [getS]);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#0B0F19] border-b border-gray-200 dark:border-white/5 h-20">
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
                  <img src="/assets/Kuba-Header-footter-Logo-for-Light-Mode.png" alt="Kuba" className="h-8 w-auto dark:hidden" />
                  <img src="/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png" alt="Kuba" className="h-8 w-auto hidden dark:block" />
                </Link>
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
             <img 
                src="/assets/Kuba-Header-footter-Logo-for-Light-Mode.png" 
                alt="Kuba" 
                className="h-10 w-auto dark:hidden" 
             />
             <img 
                src="/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png" 
                alt="Kuba" 
                className="h-10 w-auto hidden dark:block" 
             />
            <span className="sr-only">KUBA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
                <Link key={item.id} href={item.url} className="text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors tracking-tight">
                  {item.label}
                </Link>
            ))}
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
                        <img src={getAvatarUrl(user.avatar_url) || ""} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-sky-600 text-white font-black text-xs">
                          {user.name.substring(0, 2)}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-gray-100 shadow-xl">
                    <DropdownMenuLabel className="font-black text-[10px] tracking-widest text-gray-400">Account</DropdownMenuLabel>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-black text-[#1E293B] truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate tracking-tighter">{user.role} member</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer">
                      <Link href="/" className="flex items-center gap-2 font-bold text-xs tracking-wider">
                        <Home className="w-4 h-4" /> Back to Home
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xs tracking-wider">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer">
                      <div className="flex items-center gap-2 font-bold text-xs tracking-wider w-full">
                        <LogOut className="w-4 h-4" /> Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sm font-semibold text-gray-700 dark:text-white hover:text-primary transition-colors cursor-pointer">
                      Sign In
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-gray-100 dark:border-white/10 shadow-xl p-2">
                    <DropdownMenuLabel className="font-black text-[10px] tracking-widest text-gray-400 uppercase">Sign in as</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/10" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 dark:focus:bg-sky-500/10 focus:text-sky-600 cursor-pointer py-3">
                      <Link href="/login?role=client" className="flex items-center gap-3 font-bold text-sm">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Client</p>
                          <p className="text-[10px] text-gray-400 font-medium">Book home services</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer py-3">
                      <Link href="/login/provider" className="flex items-center gap-3 font-bold text-sm">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Provider</p>
                          <p className="text-[10px] text-gray-400 font-medium">Manage your services</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-pro-button rounded-full px-6">
                  <Link href="/register/provider">Sign up as a Provider</Link>
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
                  {navItems.map(item => (
                      <Link key={item.id} href={item.url} className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                        {item.label}
                      </Link>
                  ))}
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sign in as</p>
                  <Link href="/login?role=client" className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Sign in as Client</p>
                      <p className="text-xs text-gray-400">Book home services</p>
                    </div>
                  </Link>
                  <Link href="/login/provider" className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Sign in as Provider</p>
                      <p className="text-xs text-gray-400">Manage your services</p>
                    </div>
                  </Link>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full w-full">
                    <Link href="/register/provider">Sign up as a Provider</Link>
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
