"use client";

import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { KubaSidebar } from "@/components/layout/KubaSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Robust check for login page to avoid redirect loops and stuck loaders
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login");

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!user || user.role !== 'admin')) {
      router.push("/admin/login?redirect=/admin");
    }
  }, [user, isLoading, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  // Loader state while checking auth or if not authorized
  const showLoader = isLoading || !user || user.role !== 'admin';

  if (showLoader) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E293B]">Securing Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <KubaSidebar />
      <main className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
        {/* Simple Header for Admin */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Admin Portal</span>
                <span className="text-gray-200">|</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-sky-600">Control Center</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all group">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] font-black text-[#1E293B] uppercase leading-tight group-hover:text-sky-600 transition-colors">{user?.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-tight mt-0.5 group-hover:text-sky-500 transition-colors">{user?.role} member</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center overflow-hidden border border-sky-100 group-hover:border-sky-200 transition-all shadow-sm shadow-sky-100/50">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-sky-600" />
                        )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-gray-100 shadow-xl p-2">
                  <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-gray-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-50 mx-1" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer p-3">
                    <Link href="/" className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider">
                      <Home className="w-4 h-4" /> Back to Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer p-3">
                    <Link href="/dashboard" className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider">
                      <LayoutDashboard className="w-4 h-4" /> Client Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-50 mx-1" />
                  <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer p-3">
                    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
