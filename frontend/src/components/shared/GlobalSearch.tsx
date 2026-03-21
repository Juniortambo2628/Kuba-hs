"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Command, 
  ArrowRight, 
  Sparkles, 
  User, 
  Briefcase, 
  Settings,
  LayoutDashboard,
  Home,
  MessageSquare,
  Calendar,
  Layers,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { cn, getMediaUrl } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: React.ReactNode;
  category: "Pages" | "Services" | "Account" | "Quick Actions";
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const staticItems: SearchItem[] = [
    { id: "home", title: "Home", url: "/", icon: <Home className="w-4 h-4" />, category: "Pages" },
    { id: "services", title: "All Services", url: "/services", icon: <Sparkles className="w-4 h-4" />, category: "Pages" },
    { id: "providers", title: "Find Providers", url: "/providers", icon: <User className="w-4 h-4" />, category: "Pages" },
    { id: "about", title: "About Kuba", url: "/about", icon: <LayoutDashboard className="w-4 h-4" />, category: "Pages" },
    { id: "dashboard", title: "My Dashboard", url: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, category: "Quick Actions" },
    { id: "bookings", title: "My Bookings", url: "/dashboard/client/bookings", icon: <Calendar className="w-4 h-4" />, category: "Quick Actions" },
    { id: "messages", title: "Conversation History", url: "/dashboard/client/messages", icon: <MessageSquare className="w-4 h-4" />, category: "Quick Actions" },
    { id: "profile", title: "Account Settings", url: "/dashboard/client/profile", icon: <Settings className="w-4 h-4" />, category: "Account" },
  ];

  const [categories, setCategories] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data.data.map((cat: any) => ({
          id: `cat-${cat.id}`,
          title: cat.name,
          description: `View all ${cat.name} services`,
          url: `/services?category=${cat.id}`,
          icon: <Layers className="w-4 h-4" />,
          category: "Services"
        })));
      } catch (err) {
        console.error("Failed to fetch categories for search", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  // Debounced server-side search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([...staticItems, ...categories].slice(0, 8));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await axiosInstance.get(`/api/search?search=${query}`);
        const dynamicItems: SearchItem[] = (data.data || []).map((item: any) => ({
          id: `pro-${item.id}`,
          title: item.business_name,
          description: item.location_name || 'Verified Pro',
          url: `/providers/${item.id}`,
          icon: item.logo ? (
            <img 
              src={getMediaUrl(item.logo, 'avatar')} 
              alt="" 
              className="w-full h-full object-cover rounded shadow-inner" 
            />
          ) : <User className="w-4 h-4" />,
          category: "Providers"
        }));

        const filteredStatic = [...staticItems, ...categories].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );

        setResults([...filteredStatic, ...dynamicItems]);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Global search dynamic fetch failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, categories]);

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex].url);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border hover:bg-muted transition-all text-muted-foreground group"
      >
        <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold tracking-tight">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-[70vh] m-4"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center px-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  placeholder="What are you looking for?"
                  className="flex-1 h-14 bg-transparent border-none outline-none px-4 text-sm font-semibold placeholder:text-muted-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin mr-2" />
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="p-2">
                {results.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="text-sm font-semibold">No results found for "{query}"</p>
                    <p className="text-xs mt-1">Try searching for services or help guides.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Grouping could be added here, but keep it simple for now */}
                    {results.map((item, index) => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelect(item.url)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                          index === selectedIndex ? "bg-primary/10 border-primary/20" : "hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          index === selectedIndex ? "bg-white dark:bg-sky-500/20 text-primary shadow-sm" : "bg-muted text-muted-foreground"
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-black transition-colors",
                            index === selectedIndex ? "text-primary" : "text-foreground"
                          )}>
                            {item.title}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                            {item.category} {item.description && `• ${item.description}`}
                          </p>
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-primary animate-in fade-in slide-in-from-left-2 duration-300" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><kbd className="px-1 border rounded bg-background">↵</kbd> Select</span>
                  <span className="flex items-center gap-1.5"><kbd className="px-1 border rounded bg-background">↑↓</kbd> Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 opacity-60">Powered by</span>
                  <span className="text-foreground tracking-tighter text-sm font-black">KUBA</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
