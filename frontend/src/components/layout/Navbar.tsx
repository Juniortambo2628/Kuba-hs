"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, Briefcase } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserAccountDropdown } from "@/components/shared/UserAccountDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { ServiceMegamenu } from "./ServiceMegamenu";

export function Navbar() {
  const { getS, getImg } = useCMS();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
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
    const navString = getS('identity', 'navigation_menu', '');
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
                  <div className="relative h-8 w-32 dark:hidden">
                    <Image src="/assets/Kuba-Header-footter-Logo-for-Light-Mode.png" alt="Kuba" fill sizes="(max-width: 768px) 128px, 128px" className="object-contain" priority />
                  </div>
                  <div className="relative h-8 w-32 hidden dark:block">
                    <Image src="/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png" alt="Kuba" fill sizes="(max-width: 768px) 128px, 128px" className="object-contain" priority />
                  </div>
                </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300"
      onMouseLeave={() => setIsMegamenuOpen(false)}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative h-8 w-32 dark:hidden">
                <Image src={getImg('identity', 'logo_light', '/assets/Kuba-Header-footter-Logo-for-Light-Mode.png')} alt="Kuba" fill sizes="(max-width: 768px) 128px, 128px" className="object-contain" priority />
              </div>
              <div className="relative h-8 w-32 hidden dark:block">
                <Image src={getImg('identity', 'logo_dark', '/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png')} alt="Kuba" fill sizes="(max-width: 768px) 128px, 128px" className="object-contain" priority />
              </div>
            <span className="sr-only">KUBA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = pathname === item.url;
              const isServices = item.label.toLowerCase() === "services";
              
              if (isServices) {
                return (
                  <div 
                    key={item.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setIsMegamenuOpen(true)}
                  >
                    <Link 
                      href={item.url} 
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 tracking-tight flex items-center gap-1 ${
                        isActive || isMegamenuOpen
                          ? "bg-primary/10 text-primary" 
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              const solutionLabels = ["investors", "commercial", "cooperatives", "solutions"];
              if (solutionLabels.includes(item.label.toLowerCase())) return null;

              return (
                <Link 
                  key={item.id} 
                  href={item.url} 
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 tracking-tight flex items-center h-fit ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-sm font-bold rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 tracking-tight flex items-center gap-1 outline-none">
                  Solutions
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 mt-2 rounded-2xl border-gray-100 dark:border-white/10 shadow-xl p-2">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer py-3 px-4">
                  <Link href="/investors" className="font-bold text-sm">Investors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer py-3 px-4">
                  <Link href="/commercial" className="font-bold text-sm">Commercial</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer py-3 px-4">
                  <Link href="/cooperatives" className="font-bold text-sm">Cooperatives</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Global Search */}
            <GlobalSearch />

            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <UserAccountDropdown variant="navbar" />
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sm font-semibold text-gray-700 dark:text-white hover:text-primary transition-colors cursor-pointer ml-2">
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
                          <p className="font-bold text-gray-900 dark:text-white">Customer</p>
                          <p className="text-[10px] text-gray-400 font-medium">Book a verified pro</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer py-3">
                      <Link href="/login/provider" className="flex items-center gap-3 font-bold text-sm">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Pro</p>
                          <p className="text-[10px] text-gray-400 font-medium">Manage your jobs</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-pro-button rounded-full px-6">
                  <Link href="/register/provider">Join as a Pro</Link>
                </Button>
              </>
            )}
          </div>

          {/* Megamenu Overlay */}
          <ServiceMegamenu 
            isOpen={isMegamenuOpen} 
            onClose={() => setIsMegamenuOpen(false)} 
          />

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] bg-white dark:bg-[#0B0F19] border-l border-gray-100 dark:border-white/5 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-6 pt-8 pb-4 border-b border-gray-100 dark:border-white/5">
                    <Link href="/" className="inline-flex items-center gap-2">
                      <div className="relative h-7 w-28 dark:hidden">
                        <Image src={getImg('identity', 'logo_light', '/assets/Kuba-Header-footter-Logo-for-Light-Mode.png')} alt="Kuba" fill sizes="112px" className="object-contain" />
                      </div>
                      <div className="relative h-7 w-28 hidden dark:block">
                        <Image src={getImg('identity', 'logo_dark', '/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png')} alt="Kuba" fill sizes="112px" className="object-contain" />
                      </div>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <p className="px-3 mb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Navigate</p>
                    {navItems.filter(item => !["investors", "commercial", "cooperatives"].includes(item.label.toLowerCase())).map(item => {
                      const isActive = pathname === item.url;
                      return (
                        <Link 
                          key={item.id} 
                          href={item.url} 
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                            isActive 
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                          {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />}
                        </Link>
                      );
                    })}

                    <div className="h-px bg-gray-100 dark:bg-white/5 my-4 mx-3" />

                    <p className="px-3 mb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Solutions</p>
                    {[
                      { label: "Investors", url: "/investors", icon: "📊" },
                      { label: "Commercial", url: "/commercial", icon: "🏢" },
                      { label: "Cooperatives", url: "/cooperatives", icon: "🤝" },
                    ].map(item => (
                      <Link 
                        key={item.label} 
                        href={item.url} 
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="px-6 py-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] space-y-3">
                    {user ? (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                        <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 font-bold">
                          {user.first_name?.[0] || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.first_name} {user.last_name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link href="/login?role=client" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Customer Login</p>
                            <p className="text-[10px] text-gray-400 font-medium">Book a verified pro</p>
                          </div>
                        </Link>
                        <Link href="/login/provider" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Pro Login</p>
                            <p className="text-[10px] text-gray-400 font-medium">Manage your jobs</p>
                          </div>
                        </Link>
                        <Button asChild className="w-full h-12 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 mt-2">
                          <Link href="/register/provider">Join as a Pro</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
