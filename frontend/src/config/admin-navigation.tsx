import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarCheck,
  Quote,
  Users,
  ShieldCheck,
  ClipboardList,
  Grid3X3,
  Briefcase,
  DollarSign,
  Gift,
  PenTool,
  MessageSquare,
  Mail,
  Inbox,
  Bell,
  HelpCircle,
  Star,
  Monitor,
  Settings,
  Ticket,
  TestTube,
} from "lucide-react";
import type { ActivityCounts } from "@/hooks/useActivityCounts";

export type AdminBadgeKey = keyof Pick<
  ActivityCounts,
  "bookings" | "messages" | "payments" | "verification" | "quotes"
>;

export type AdminNavCategory = "Primary" | "Content" | "Operations" | "System";

export interface AdminNavItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  category: AdminNavCategory;
  badgeKey: AdminBadgeKey | null;
}

/** Single source of truth for admin sidebar + command palette */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "dash", title: "Dashboard", url: "/admin", icon: LayoutDashboard, category: "Primary", badgeKey: null },
  { id: "anal", title: "Analytics", url: "/admin/analytics", icon: TrendingUp, category: "Primary", badgeKey: null },
  { id: "book", title: "Bookings", url: "/admin/bookings", icon: CalendarCheck, category: "Primary", badgeKey: "bookings" },
  { id: "quot", title: "Quotes", url: "/admin/quotes", icon: Quote, category: "Primary", badgeKey: "quotes" },
  { id: "user", title: "Users", url: "/admin/users", icon: Users, category: "Primary", badgeKey: null },
  { id: "prov", title: "Providers", url: "/admin/providers", icon: Briefcase, category: "Primary", badgeKey: null },
  { id: "veri", title: "Verification", url: "/admin/workforce/verification", icon: ShieldCheck, category: "Operations", badgeKey: "verification" },
  { id: "comp", title: "Compliance", url: "/admin/compliance", icon: ClipboardList, category: "Operations", badgeKey: null },
  { id: "cate", title: "Service Categories", url: "/admin/categories", icon: Grid3X3, category: "Operations", badgeKey: null },
  { id: "paym", title: "Finance & Payments", url: "/admin/payments", icon: DollarSign, category: "Operations", badgeKey: "payments" },
  { id: "cont", title: "Contact", url: "/admin/contact", icon: Mail, category: "System", badgeKey: null },
  { id: "feed", title: "Reviews", url: "/admin/feedback", icon: Star, category: "Content", badgeKey: null },
  { id: "loya", title: "Loyalty", url: "/admin/loyalty", icon: Gift, category: "Operations", badgeKey: null },
  { id: "prom", title: "Promotions", url: "/admin/promotions", icon: Ticket, category: "Primary", badgeKey: null },
  { id: "blog", title: "Blog", url: "/admin/blog", icon: PenTool, category: "Content", badgeKey: null },
  { id: "inv", title: "Investors", url: "/admin/investors", icon: Briefcase, category: "System", badgeKey: null },
  { id: "msg_hub", title: "Inbox", url: "/admin/messages", icon: Inbox, category: "Primary", badgeKey: "messages" },
  { id: "chat_mod", title: "Chat Moderation", url: "/admin/chat", icon: MessageSquare, category: "Operations", badgeKey: null },
  { id: "notif", title: "Notifications", url: "/admin/notifications", icon: Bell, category: "System", badgeKey: null },
  { id: "repo", title: "Reports", url: "/admin/reports", icon: ClipboardList, category: "System", badgeKey: null },
  { id: "mail", title: "Email Templates", url: "/admin/email-templates", icon: Mail, category: "System", badgeKey: null },
  { id: "email_test", title: "Email Testing", url: "/admin/email-test", icon: TestTube, category: "System", badgeKey: null },
  { id: "faq", title: "FAQs", url: "/admin/faqs", icon: HelpCircle, category: "Content", badgeKey: null },
  { id: "test", title: "Testimonials", url: "/admin/testimonials", icon: Star, category: "Content", badgeKey: null },
  { id: "trust", title: "Trust Partners", url: "/admin/trust-partners", icon: ShieldCheck, category: "Content", badgeKey: null },
  { id: "feat", title: "Page Features", url: "/admin/page-features", icon: Monitor, category: "Content", badgeKey: null },
  { id: "sett", title: "Platform CMS", url: "/admin/settings", icon: Settings, category: "System", badgeKey: null },
];

/** Sidebar-friendly shape (title/url/icon/badgeKey) */
export const ADMIN_SIDEBAR_ITEMS = ADMIN_NAV_ITEMS.map(({ title, url, icon, badgeKey }) => ({
  title,
  url,
  icon,
  badgeKey,
}));
