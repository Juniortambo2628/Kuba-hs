import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Bell,
  Clock,
  Settings,
  LogOut,
  X,
  Star,
  CheckCircle,
  MessageSquare,
  Shield,
  Monitor,
  Users,
  DollarSign,
  TrendingUp,
  BookOpen,
  Mail,
  Home,
  Wrench,
  Award,
  Search,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function Sidebar({ onClose }) {
  const { auth } = usePage().props;
  const user = auth.user;

  const adminNavItems = [
    { title: "Dashboard", href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
    { title: "Bookings", href: route('admin.bookings.index'), icon: Calendar, active: route().current('admin.bookings.*') },
    { title: "User Management", href: route('admin.users.index'), icon: Users, active: route().current('admin.users.*') },
    { title: "Payments", href: route('admin.payments.index'), icon: DollarSign, active: route().current('admin.payments.*') },
    { title: "CMS Settings", href: route('admin.cms.index'), icon: Monitor, active: route().current('admin.cms.*') },
    { title: "Analytics", href: route('admin.analytics.index'), icon: TrendingUp, active: route().current('admin.analytics.*') },
    { title: "Feedback", href: route('admin.feedback.index'), icon: Star, active: route().current('admin.feedback.*') },
    { title: "Blog", href: route('admin.blog.index'), icon: BookOpen, active: route().current('admin.blog.*') },
    { title: "Messages", href: route('admin.contact.index'), icon: Mail, active: route().current('admin.contact.*') },
    { title: "Services", href: route('admin.services.index'), icon: Wrench, active: route().current('admin.services.*') || route().current('admin.categories.*') },
  ];

  const customerNavItems = [
    { title: "Overview", href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
    { title: "My Bookings", href: route('bookings.index'), icon: ClipboardList, active: route().current('bookings.index') },
    { title: "Notifications", href: route('notifications.index'), icon: Bell, active: route().current('notifications.index') },
    { title: "Loyalty Program", href: route('dashboard'), icon: Award, active: false },
    { title: "Find Services", href: route('marketplace.search'), icon: Search, active: route().current('marketplace.search') },
    { title: "Messages", href: route('chat.index'), icon: MessageSquare, active: route().current('chat.*') },
  ];

  const providerNavItems = [
    { title: "Overview", href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
    { title: "Bookings", href: route('bookings.index'), icon: ClipboardList, active: route().current('bookings.index') },
    { title: "Notifications", href: route('notifications.index'), icon: Bell, active: route().current('notifications.index') },
    { title: "My Services", href: route('provider.edit'), icon: Briefcase, active: route().current('provider.edit') },
    { title: "Schedule", href: route('schedule.index'), icon: Clock, active: route().current('schedule.index') },
    { title: "Reviews", href: route('reviews.index'), icon: Star, active: route().current('reviews.index') },
    { title: "Messages", href: route('chat.index'), icon: MessageSquare, active: route().current('chat.*') },
  ];

  const navItems = user.role === 'admin' 
    ? adminNavItems 
    : (user.role === 'provider' ? providerNavItems : customerNavItems);

  const primaryAction = user.role === 'admin' 
    ? null 
    : user.role === 'provider' 
      ? null
      : { label: "Book Service", href: route('marketplace.search'), icon: Calendar };

  return (
    <aside className="w-64 bg-[hsl(var(--sidebar-background))] flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[hsl(var(--sidebar-border))]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[hsl(var(--sidebar-primary))] flex items-center justify-center text-white">
            <Home className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[hsl(var(--sidebar-foreground))]">
            HomeServ
          </span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Primary Action */}
      {primaryAction && (
        <div className="px-4 pt-5 pb-2">
          <Button
            asChild
            className="w-full bg-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-primary))]/90 text-white font-semibold shadow-lg shadow-[hsl(var(--sidebar-primary))]/20"
          >
            <Link href={primaryAction.href}>
              <primaryAction.icon className="h-4 w-4 mr-2" />
              {primaryAction.label}
            </Link>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <p className="px-3 text-[10px] font-semibold text-[hsl(var(--sidebar-muted-foreground))] uppercase tracking-widest mb-3">
          {user.role === 'admin' ? 'Administration' : 'Main Menu'}
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))]" 
                    : "text-[hsl(var(--sidebar-muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-[hsl(var(--sidebar-primary))]")} />
                {item.title}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--sidebar-primary))]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="mt-6 pt-4 border-t border-[hsl(var(--sidebar-border))]">
          <p className="px-3 text-[10px] font-semibold text-[hsl(var(--sidebar-muted-foreground))] uppercase tracking-widest mb-3">
            Settings
          </p>
          <div className="space-y-0.5">
            <Link
              href={route('profile.edit')}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                route().current('profile.edit') 
                  ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))]" 
                  : "text-[hsl(var(--sidebar-muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]"
              )}
            >
              <User className="h-4 w-4" />
              Profile Settings
            </Link>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom section */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(var(--sidebar-muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))]/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[hsl(var(--sidebar-primary))]/20 flex items-center justify-center font-bold text-[hsl(var(--sidebar-primary))] text-xs uppercase border border-[hsl(var(--sidebar-primary))]/30">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))] truncate">{user.name}</span>
            <span className="text-[10px] font-medium text-[hsl(var(--sidebar-muted-foreground))] flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sidebar-primary))]" />
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
