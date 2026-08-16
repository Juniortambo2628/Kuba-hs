import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  MessageSquare,
  DollarSign,
  Star,
  User,
  Clock,
  ClipboardList,
  ShieldCheck,
  Heart,
  Shield,
} from "lucide-react";
import type { ActivityCounts } from "@/hooks/useActivityCounts";

export type DashboardBadgeKey = keyof Pick<
  ActivityCounts,
  "bookings" | "messages" | "verification"
>;

export interface DashboardNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badgeKey: DashboardBadgeKey | null;
}

export const CLIENT_SIDEBAR_ITEMS: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard/client", icon: LayoutDashboard, badgeKey: null },
  { title: "Bookings", url: "/dashboard/client/bookings", icon: Calendar, badgeKey: "bookings" },
  { title: "Favorites", url: "/dashboard/client/favorites", icon: Heart, badgeKey: null },
  { title: "Addresses", url: "/dashboard/client/services", icon: Briefcase, badgeKey: null },
  { title: "Messages", url: "/dashboard/client/messages", icon: MessageSquare, badgeKey: "messages" },
  { title: "Billing", url: "/dashboard/client/billing", icon: DollarSign, badgeKey: null },
  { title: "Loyalty", url: "/dashboard/client/loyalty", icon: Star, badgeKey: null },
  { title: "Security", url: "/dashboard/client/security", icon: Shield, badgeKey: null },
  { title: "Profile", url: "/dashboard/client/profile", icon: User, badgeKey: null },
];

export const PROVIDER_SIDEBAR_ITEMS: DashboardNavItem[] = [
  { title: "Dashboard", url: "/dashboard/provider", icon: LayoutDashboard, badgeKey: null },
  { title: "Services", url: "/dashboard/provider/services", icon: Briefcase, badgeKey: null },
  { title: "Availability", url: "/dashboard/provider/availability", icon: Clock, badgeKey: null },
  { title: "Bookings", url: "/dashboard/provider/bookings", icon: ClipboardList, badgeKey: "bookings" },
  { title: "Verification", url: "/dashboard/provider/verification", icon: ShieldCheck, badgeKey: "verification" },
  { title: "Messages", url: "/dashboard/provider/messages", icon: MessageSquare, badgeKey: "messages" },
  { title: "Reviews", url: "/dashboard/provider/reviews", icon: Star, badgeKey: null },
  { title: "Security", url: "/dashboard/provider/security", icon: Shield, badgeKey: null },
  { title: "Profile", url: "/dashboard/provider/profile", icon: User, badgeKey: null },
];
