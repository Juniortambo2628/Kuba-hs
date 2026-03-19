"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Home, 
  Heart, 
  Settings, 
  Zap, 
  Briefcase, 
  ChevronRight,
  Loader2,
  Building2,
  ShieldCheck,
  TrendingUp,
  Globe
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";

const ICON_MAP: Record<string, any> = {
  'Home Essentials': Home,
  'Personal & Wellness': Heart,
  'Automotive Care': Zap,
  'Professional & Digital': Settings,
  'Event & Commercial': Building2,
  'Corporate Solutions': ShieldCheck,
  'Financial Services': TrendingUp,
  'Global Reach': Globe
};

interface Category {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  dynamic_icon_url: string;
  services_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 mx-auto px-6 text-center text-white">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={designSystem.typography.hero.badge}
          >
            Explore Kuba
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={designSystem.typography.hero.title}
          >
            Service Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={designSystem.typography.hero.subtitle + " text-white/70"}
          >
            Find the right professional for any task across our specialized industry verticals.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 container mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Industry Verticals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => {
              const IconComponent = ICON_MAP[category.name] || Briefcase;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/services?category_id=${category.id}`}
                    className="group block p-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className={designSystem.typography.section.cardTitle}>{category.name}</h3>
                      <p className={designSystem.typography.section.cardText + " line-clamp-2"}>
                        {category.description || `Comprehensive ${category.name.toLowerCase()} for your home and business needs.`}
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {category.services_count || 0} Professional Services
                      </span>
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View More
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
