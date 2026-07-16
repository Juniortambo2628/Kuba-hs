"use client";

import { useEffect, useState, useRef, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  Briefcase,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { ADMIN_NAV_ITEMS } from "@/config/admin-navigation";

interface AdminCommandItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: React.ReactNode;
  category: string;
}

const navActions: AdminCommandItem[] = ADMIN_NAV_ITEMS.map((item) => {
  const Icon = item.icon;
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    icon: <Icon className="w-4 h-4" />,
    category: item.category,
  };
});

function iconForRecordCategory(category: string): React.ReactNode {
  switch (category) {
    case "Users":
      return <Users className="w-4 h-4" />;
    case "Bookings":
      return <Calendar className="w-4 h-4" />;
    case "Providers":
      return <Briefcase className="w-4 h-4" />;
    case "Services":
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Command className="w-4 h-4" />;
  }
}

export function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recordResults, setRecordResults] = useState<AdminCommandItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const staticFiltered = navActions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filtered =
    query.length >= 2
      ? [
          ...staticFiltered,
          ...recordResults.filter(
            (r) => !staticFiltered.some((s) => s.url === r.url && s.title === r.title)
          ),
        ]
      : staticFiltered;

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const setPaletteOpen = useCallback((open: boolean) => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setRecordResults([]);
      setIsOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(!isOpen);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setPaletteOpen]);

  useEffect(() => {
    if (!isOpen || query.length < 2) {
      setRecordResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await axiosInstance.get(
          `/api/dashboard/search?search=${encodeURIComponent(query)}`
        );
        setRecordResults(
          (data.data || []).map(
            (item: {
              id: string;
              title: string;
              description?: string;
              url: string;
              category: string;
            }) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              url: item.url,
              icon: iconForRecordCategory(item.category),
              category: `Records · ${item.category}`,
            })
          )
        );
        setSelectedIndex(0);
      } catch {
        setRecordResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (url: string) => {
    router.push(url);
    setPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!filtered.length) return;
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

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPaletteOpen(false)}
                  className="absolute inset-0 bg-background/60 backdrop-blur-md"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.2, ease: "circOut" }}
                  className="relative w-full max-w-2xl bg-white dark:bg-background border border-gray-200 dark:border-white/10 rounded-3xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden m-4 flex flex-col max-h-[70vh]"
                  onKeyDown={handleKeyDown}
                >
                  <div className="flex items-center px-6 border-b border-gray-100 dark:border-white/5">
                    <Zap className="w-5 h-5 text-primary animate-pulse shrink-0" />
                    <input
                      ref={inputRef}
                      placeholder="Jump to a module or search users, bookings, providers…"
                      className="flex-1 h-16 bg-transparent border-none outline-none px-4 text-sm font-bold placeholder:text-muted-foreground/50"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(0);
                      }}
                    />
                    {isSearching && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin mr-2" />
                    )}
                    <kbd className="h-6 px-2 rounded-md bg-muted flex items-center text-[10px] font-black opacity-40">
                      ESC
                    </kbd>
                  </div>

                  <div className="max-h-[50vh] overflow-y-auto p-3 kuba-scroll">
                    {filtered.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <p className="text-sm font-bold text-foreground">
                          No results for &ldquo;{query}&rdquo;
                        </p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          Try a booking ref, email, or module name
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 py-2">
                        {categories.map((cat) => {
                          const group = filtered.filter((i) => i.category === cat);
                          if (group.length === 0) return null;
                          return (
                            <div key={cat} className="space-y-1">
                              <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
                                {cat}
                              </h3>
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
                                      isSelected
                                        ? "bg-primary/10 border-primary/20"
                                        : "hover:bg-muted/50"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                                        isSelected
                                          ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={cn(
                                          "text-[13px] font-bold transition-colors truncate",
                                          isSelected ? "text-primary" : "text-foreground"
                                        )}
                                      >
                                        {item.title}
                                      </p>
                                      <p className="text-[10px] font-bold text-muted-foreground/60 leading-none mt-1 truncate">
                                        {item.description ?? item.url}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <ArrowRight className="w-4 h-4 text-primary shrink-0" />
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
                        <kbd className="px-1.5 py-0.5 border border-border rounded bg-card text-[9px]">
                          ⏎
                        </kbd>{" "}
                        Open
                      </span>
                      <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase opacity-60">
                        <kbd className="px-1.5 py-0.5 border border-border rounded bg-card text-[9px]">
                          ⌘K
                        </kbd>{" "}
                        Toggle
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-muted-foreground italic uppercase">
                        Admin search
                      </span>
                      <Command className="w-3.5 h-3.5 text-primary" />
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
