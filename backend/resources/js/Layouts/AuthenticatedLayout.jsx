import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/Components/Sidebar';
import NotificationDropdown from '@/Components/NotificationDropdown';
import { Menu, Search, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Sheet, SheetContent, SheetTitle } from '@/Components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const portalLabel = user.role === 'admin' 
        ? 'Admin Portal' 
        : user.role === 'provider' 
            ? 'Provider Portal' 
            : 'Client Portal';

    const roleLabel = user.role === 'admin' 
        ? 'Administrator' 
        : user.role === 'provider' 
            ? 'Service Provider' 
            : 'Member';

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/10">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64 bg-[hsl(var(--sidebar-background))]">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative z-10 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card/95 backdrop-blur px-4 lg:px-8 shrink-0">
                    <div className="flex flex-1 items-center gap-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        
                        {/* Portal Label + Welcome */}
                        <div className="flex items-center gap-3 flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:inline">
                                {portalLabel}
                            </span>
                            <span className="hidden sm:inline text-muted-foreground/40">—</span>
                            <span className="text-sm font-bold text-foreground hidden sm:inline">
                                Welcome Back
                            </span>
                        </div>
                        
                        {/* Right side: Search, Notifications, Profile */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex relative w-56">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search..." 
                                    className="pl-8 bg-muted/50 border-none h-9 text-sm"
                                />
                            </div>

                            {/* Notifications */}
                            <NotificationDropdown />

                            {/* User Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1.5 hover:bg-muted">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold leading-none">{user.name}</p>
                                            <p className="text-[10px] font-medium text-primary uppercase tracking-wider mt-0.5">{roleLabel}</p>
                                        </div>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar_url} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                                {user.first_name?.[0]}{user.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('profile.edit')}>Profile Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/">
                                            <Home className="mr-2 h-4 w-4" />
                                            Back to Home
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                                        <Link href={route('logout')} method="post" as="button" className="w-full">
                                            Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                
                {/* Content Container */}
                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <motion.div
                        className="max-w-7xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>

                <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground bg-card">
                    <div className="flex justify-center gap-4 mb-1">
                        <Link href="/" className="hover:text-foreground transition-colors">Support</Link>
                        <Link href="/" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                    <span>&copy; {new Date().getFullYear()} Home Service Platform. All Rights Reserved.</span>
                </footer>
            </main>
        </div>
    );
}
