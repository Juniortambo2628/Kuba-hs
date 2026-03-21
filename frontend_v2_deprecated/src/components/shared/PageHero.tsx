"use client";

import { motion } from "framer-motion";
import { Search, Home, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  bgImage: string;
  gradientFrom?: string;
  gradientTo?: string;
  searchAction?: string;
  searchPlaceholder?: string;
  defaultSearch?: string;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  bgImage,
  gradientFrom = "from-blue-600",
  gradientTo = "to-purple-700",
  searchAction,
  searchPlaceholder = "Search...",
  defaultSearch = "",
}: PageHeroProps) {
  return (
    <section className="relative pt-20 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />
      <div className="absolute inset-0">
        <img src={bgImage || "/placeholder-light.png"} alt="" className="w-full h-full object-cover opacity-30" />
      </div>
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">{title}</h1>
            <p className="text-white/70 text-lg max-w-xl mb-5">{subtitle}</p>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/60 font-medium text-sm mb-8">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  {crumb.href ? (
                    <Link href={crumb.href as any} className="hover:text-white transition-colors">{crumb.label}</Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>

            {/* Search Bar */}
            {searchAction && (
              <form className="flex gap-2 max-w-lg" action={searchAction}>
                <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-xl px-4 border border-white/20">
                  <Search className="text-white/50 w-5 h-5 mr-3 shrink-0" />
                  <Input
                    name="search"
                    type="text"
                    defaultValue={defaultSearch}
                    placeholder={searchPlaceholder}
                    className="bg-transparent border-none text-white placeholder:text-white/40 focus-visible:ring-0 px-0 shadow-none"
                  />
                </div>
                <Button type="submit" className="bg-white text-blue-700 hover:bg-white/90 font-bold rounded-xl px-6">
                  Search
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
