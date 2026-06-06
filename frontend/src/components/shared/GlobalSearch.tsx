"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Command, 
  Sparkles, 
  User, 
  Briefcase, 
  Settings,
  LayoutDashboard,
  Home,
  MessageSquare,
  Calendar,
  Layers,
  Loader2,
  Grid3X3,
  MapPin,
  Receipt,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { ScrollRegion } from "@/components/shared/ScrollRegion";
import { ProviderSearchRow, SearchResultRow, type ProviderSearchRowData } from "@/components/marketplace";
import { providerHref } from "@/lib/provider-urls";
import {
  ADMIN_SEARCH_ENTRIES,
  CLIENT_SEARCH_ENTRIES,
  dedupeSearchEntries,
  PROVIDER_SEARCH_ENTRIES,
  PUBLIC_SEARCH_ENTRIES,
  type GlobalSearchCategory,
  type GlobalSearchStaticEntry,
} from "@/config/global-search-static";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: React.ReactNode;
  category: GlobalSearchCategory;
  provider?: ProviderSearchRowData;
}

function iconForCategory(category: GlobalSearchCategory): React.ReactNode {
  switch (category) {
    case "Bookings":
      return <Calendar className="w-4 h-4" />;
    case "Addresses":
      return <MapPin className="w-4 h-4" />;
    case "Billing":
      return <Receipt className="w-4 h-4" />;
    case "Providers":
      return <User className="w-4 h-4" />;
    case "Services":
      return <Sparkles className="w-4 h-4" />;
    case "Account":
      return <Settings className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
}

function iconForEntry(entry: GlobalSearchStaticEntry): React.ReactNode {
  switch (entry.id) {
    case "page-home":
      return <Home className="w-4 h-4" />;
    case "page-services":
      return <Sparkles className="w-4 h-4" />;
    case "page-providers":
      return <User className="w-4 h-4" />;
    case "page-about":
    case "client-dashboard":
    case "provider-dashboard":
    case "admin-dashboard":
      return <LayoutDashboard className="w-4 h-4" />;
    case "client-bookings":
      return <Calendar className="w-4 h-4" />;
    case "client-messages":
    case "provider-messages":
      return <MessageSquare className="w-4 h-4" />;
    case "client-profile":
    case "provider-profile":
      return <Settings className="w-4 h-4" />;
    case "provider-bookings":
    case "provider-services":
      return <Briefcase className="w-4 h-4" />;
    case "client-addresses":
      return <MapPin className="w-4 h-4" />;
    case "client-billing":
      return <Receipt className="w-4 h-4" />;
    case "admin-categories":
      return <Grid3X3 className="w-4 h-4" />;
    case "admin-users":
      return <User className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
}

function staticEntryToItem(entry: GlobalSearchStaticEntry): SearchItem {
  return {
    ...entry,
    icon: iconForEntry(entry),
  };
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStaticItems = () => {
    const entries = [...PUBLIC_SEARCH_ENTRIES];
    if (user?.role === "customer") entries.push(...CLIENT_SEARCH_ENTRIES);
    else if (user?.role === "provider") entries.push(...PROVIDER_SEARCH_ENTRIES);
    else if (user?.role === "admin") entries.push(...ADMIN_SEARCH_ENTRIES);
    return entries.map(staticEntryToItem);
  };

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
          url: `/services?category=${cat.slug || cat.id}`,
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
    const staticItems = getStaticItems();
    if (!query || query.length < 2) {
      setResults(dedupeSearchEntries([...staticItems, ...categories]).slice(0, 8));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const staticItems = getStaticItems();
        const filteredStatic = [...staticItems, ...categories].filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        const fetches: Promise<SearchItem[]>[] = [];

        if (user && (user.role === "customer" || user.role === "provider")) {
          fetches.push(
            axiosInstance
              .get(`/api/dashboard/search?search=${encodeURIComponent(query)}`)
              .then((res) =>
                (res.data.data || []).map(
                  (item: {
                    id: string;
                    title: string;
                    description?: string;
                    url: string;
                    category: GlobalSearchCategory;
                  }) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    url: item.url,
                    icon: iconForCategory(item.category),
                    category: item.category,
                  })
                )
              )
              .catch(() => [] as SearchItem[])
          );
        }

        if (!user || user.role === "customer") {
          fetches.push(
            axiosInstance
              .get(`/api/search?search=${encodeURIComponent(query)}`)
              .then((res) =>
                (res.data.data || []).map((item: Record<string, unknown>) => ({
                  id: `pro-${item.id}`,
                  title: String(item.business_name),
                  description: String(item.location_name || "Verified Pro"),
                  url: providerHref(item as Parameters<typeof providerHref>[0]),
                  icon: <User className="w-4 h-4" />,
                  category: "Providers" as const,
                  provider: {
                    id: item.id as string,
                    business_name: item.business_name as string,
                    location_name: item.location_name as string | undefined,
                    rating: item.rating as number | undefined,
                    logo: item.logo as string | undefined,
                    services: item.services,
                    user: item.user,
                  },
                }))
              )
              .catch(() => [] as SearchItem[])
          );
        }

        const dynamicGroups = await Promise.all(fetches);
        const dynamicItems = dynamicGroups.flat();

        setResults(dedupeSearchEntries([...filteredStatic, ...dynamicItems]));
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
    if ((url.startsWith('/dashboard') || url.startsWith('/admin')) && !user) {
      router.push(`/login?redirect=${encodeURIComponent(url)}`);
    } else {
      router.push(url);
    }
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
        <span className="text-xs font-bold tracking-tight hidden md:inline">Search…</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {mounted && createPortal(
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
                className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] m-4"
                onKeyDown={handleKeyDown}
              >
                <div className="flex items-center px-4 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    placeholder={
                      user?.role === "customer" || user?.role === "provider"
                        ? "Bookings, addresses, services, pages…"
                        : "What are you looking for?"
                    }
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

                <ScrollRegion className="flex-1 min-h-0 p-2">
                  {results.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <p className="text-sm font-semibold">No results found for "{query}"</p>
                      <p className="text-xs mt-1">Try searching for services or help guides.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {results.map((item, index) =>
                        item.provider ? (
                          <div
                            key={`${item.category}:${item.id}`}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <ProviderSearchRow
                              variant="command"
                              provider={item.provider}
                              selected={index === selectedIndex}
                              subtitle={`${item.category}${item.description ? ` • ${item.description}` : ""}`}
                              onClick={() => handleSelect(item.url)}
                            />
                          </div>
                        ) : (
                          <div
                            key={`${item.category}:${item.id}`}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <SearchResultRow
                              variant="command"
                              selected={index === selectedIndex}
                              title={item.title}
                              icon={item.icon}
                              subtitle={`${item.category}${item.description ? ` • ${item.description}` : ""}`}
                              onClick={() => handleSelect(item.url)}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </ScrollRegion>

                <div className="shrink-0 p-3 bg-muted/30 border-t border-border flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1 border rounded bg-background text-[10px]">↵</kbd> Select
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1 border rounded bg-background text-[10px]">↑↓</kbd> Navigate
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary">Kuba</span>
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
