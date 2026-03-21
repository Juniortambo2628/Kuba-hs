"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { ChevronRight, Sparkles, Wrench, Droplet, Zap, Home, Briefcase, Building2, Heart, Car } from "lucide-react";

interface Service {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  services: Service[];
  icon: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  wrench: <Wrench className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  droplet: <Droplet className="w-4 h-4" />,
  bolt: <Zap className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  building: <Building2 className="w-4 h-4" />,
};

interface ServiceMegamenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceMegamenu({ isOpen, onClose }: ServiceMegamenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories for megamenu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-white dark:bg-[#0B0F19] border-b border-gray-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            <div className="container mx-auto px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                {isLoading ? (
                  // Loading Skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-4 animate-pulse">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded" />
                        <div className="h-3 w-5/6 bg-gray-100 dark:bg-white/5 rounded" />
                        <div className="h-3 w-4/6 bg-gray-100 dark:bg-white/5 rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="space-y-6 group/cat">
                      <Link 
                        href={`/services?category=${category.id}`}
                        onClick={onClose}
                        className="flex items-center gap-2 group"
                      >
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 group-hover:bg-primary/10 transition-colors">
                          {category.icon && iconMap[category.icon] ? (
                            <span className="text-primary">{iconMap[category.icon]}</span>
                          ) : (
                            <Sparkles className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors capitalize tracking-tight">
                          {category.name}
                        </h3>
                      </Link>
                      
                      <ul className="space-y-3">
                        {category.services?.slice(0, 6).map((service: any) => (
                          <li key={service.id}>
                            <Link 
                              href={`/providers?service=${service.id}`}
                              onClick={onClose}
                              className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-between group/link"
                            >
                              <span className="truncate">{service.name}</span>
                              <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                            </Link>
                          </li>
                        ))}
                        {category.services?.length > 6 && (
                          <li>
                            <Link 
                              href={`/services/[id]?id=${category.id}`}
                              onClick={onClose}
                              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              See all {category.name} <ChevronRight className="w-3 h-3" />
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              {/* Footer of Megamenu */}
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0B0F19] bg-gray-200 dark:bg-white/10" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Join <span className="text-gray-900 dark:text-white font-bold">5,000+</span> verified pros on the platform
                  </p>
                </div>
                <Link 
                  href="/services" 
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-bold text-primary group"
                >
                  Explore all categories
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
