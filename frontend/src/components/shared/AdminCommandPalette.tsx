"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Command, 
  ArrowRight, 
  LayoutDashboard,
  TrendingUp,
  CalendarCheck,
  Quote,
  Users,
  ShieldCheck,
  Ticket,
  Grid3X3,
  Briefcase,
  DollarSign,
  Gift,
  PenTool,
  MessageSquare,
  ClipboardList,
  Mail,
  Inbox,
  HelpCircle,
  Star,
  Monitor,
  Settings,
  Plus,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminCommandItem {
  id: string;
  title: string;
  url: string;
  icon: React.ReactNode;
  category: "Primary" | "Content" | "Operations" | "System";
  shortcut?: string;
}

const adminActions: AdminCommandItem[] = [
  { id: "dash", title: "Dashboard Overview", url: "/admin", icon: <LayoutDashboard className="w-4 h-4" />, category: "Primary" },
  { id: "msg_hub", title: "Messaging Hub", url: "/admin/messages", icon: <Inbox className="w-4 h-4" />, category: "Primary" },
  { id: "anal", title: "Analytics & Growth", url: "/admin/analytics", icon: <TrendingUp className="w-4 h-4" />, category: "Primary" },
  { id: "book", title: "Booking Registry", url: "/admin/bookings", icon: <CalendarCheck className="w-4 h-4" />, category: "Primary" },
  { id: "quot", title: "Enterprise Quotes", url: "/admin/quotes", icon: <Quote className="w-4 h-4" />, category: "Primary" },
  { id: "user", title: "User Directory", url: "/admin/users", icon: <Users className="w-4 h-4" />, category: "Primary" },
  { id: "prom", title: "Growth & Promotions", url: "/admin/promotions", icon: <Ticket className="w-4 h-4" />, category: "Primary" },
  
  { id: "veri", title: "Workforce Verification", url: "/admin/workforce/verification", icon: <ShieldCheck className="w-4 h-4" />, category: "Operations" },
  { id: "comp", title: "Compliance & Audits", url: "/admin/compliance", icon: <ClipboardList className="w-4 h-4" />, category: "Operations" },
  { id: "cate", title: "Service Categories", url: "/admin/categories", icon: <Grid3X3 className="w-4 h-4" />, category: "Operations" },
  { id: "paym", title: "Payment Ledger", url: "/admin/payments", icon: <DollarSign className="w-4 h-4" />, category: "Operations" },
  { id: "loya", title: "Loyalty Architecture", url: "/admin/loyalty", icon: <Gift className="w-4 h-4" />, category: "Operations" },
  
  { id: "blog", title: "Blog Engine", url: "/admin/blog", icon: <PenTool className="w-4 h-4" />, category: "Content" },
  { id: "feed", title: "User Feedback", url: "/admin/feedback", icon: <MessageSquare className="w-4 h-4" />, category: "Content" },
  { id: "faq", title: "FAQs Management", url: "/admin/faqs", icon: <HelpCircle className="w-4 h-4" />, category: "Content" },
  { id: "test", title: "Testimonials", url: "/admin/testimonials", icon: <Star className="w-4 h-4" />, category: "Content" },
  { id: "feat", title: "Page Features", url: "/admin/page-features", icon: <Monitor className="w-4 h-4" />, category: "Content" },
  
  { id: "sett", title: "Platform CMS", url: "/admin/settings", icon: <Settings className="w-4 h-4" />, category: "System" },
  { id: "mail", title: "Email Templates", url: "/admin/email-templates", icon: <Mail className="w-4 h-4" />, category: "System" },
  { id: "cont", title: "Support Inquiries", url: "/admin/contact", icon: <Inbox className="w-4 h-4" />, category: "System" },
  { id: "repo", title: "System Reports", url: "/admin/reports", icon: <ClipboardList className="w-4 h-4" />, category: "System" },
];

export function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = adminActions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].url);
    }
  };

  return (
    <>
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="relative w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-3xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden m-4 flex flex-col max-h-[70vh]"
                onKeyDown={handleKeyDown}
              >
            <div className="flex items-center px-6 border-b border-gray-100 dark:border-white/5">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
              <input
                ref={inputRef}
                placeholder="Jump to module..."
                className="flex-1 h-16 bg-transparent border-none outline-none px-4 text-sm font-bold placeholder:text-muted-foreground/50"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-2">
                <kbd className="h-6 px-2 rounded-md bg-muted flex items-center text-[10px] font-black opacity-40">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <p className="text-sm font-bold text-foreground">No modules matching "{query}"</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform Integrity Audit: 0 results</p>
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  {["Primary", "Operations", "Content", "System"].map(cat => {
                    const group = filtered.filter(i => i.category === cat);
                    if (group.length === 0) return null;
                    return (
                        <div key={cat} className="space-y-1">
                            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">{cat} Core</h3>
                            {group.map((item) => {
                                const globalIndex = filtered.indexOf(item);
                                const isSelected = globalIndex === selectedIndex;
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleSelect(item.url)}
                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all border border-transparent",
                                            isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                            isSelected ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-[13px] font-bold transition-colors",
                                                isSelected ? "text-primary" : "text-foreground"
                                            )}>
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 leading-none mt-1 uppercase tracking-tight">
                                                Registry: {item.url}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <ArrowRight className="w-4 h-4 text-primary animate-in fade-in slide-in-from-left-2 duration-300" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase opacity-60">
                    <kbd className="px-1.5 py-0.5 border border-border rounded bg-card text-[9px]">⏎</kbd> Execute
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase opacity-60">
                    <kbd className="px-1.5 py-0.5 border border-border rounded bg-card text-[9px]">↑↓</kbd> Traverse
                  </span>
                </div>
                <div className="flex items-center gap-2 group">
                  <span className="text-[10px] font-black text-muted-foreground italic uppercase">Advanced Operational Layer</span>
                  <Command className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
                </div>
            </div>
          </motion.div>
        </div>
      )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
