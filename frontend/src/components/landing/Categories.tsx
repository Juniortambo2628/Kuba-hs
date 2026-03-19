"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Star, MapPin, Clock, ShieldCheck, 
  CheckCircle2, Users, ArrowRight, MessageSquare, ChevronRight,
  Wrench, Sparkles, Droplet, Zap, Home, Briefcase, Building2, Grid,
  HeartPulse, GraduationCap, Gavel, Soup, Truck, Activity
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  slug: string;
  services: any[];
}

const iconMap: Record<string, React.ReactNode> = {
  wrench: <Wrench className="w-8 h-8 text-blue-500" />,
  sparkles: <Sparkles className="w-8 h-8 text-purple-500" />,
  droplet: <Droplet className="w-8 h-8 text-cyan-500" />,
  droplets: <Droplet className="w-8 h-8 text-cyan-500" />,
  bolt: <Zap className="w-8 h-8 text-yellow-500" />,
  zap: <Zap className="w-8 h-8 text-yellow-500" />,
  car: <Wrench className="w-8 h-8 text-rose-500" />,
  home: <Home className="w-8 h-8 text-blue-500" />,
  heart: <Activity className="w-8 h-8 text-pink-500" />,
  heartpulse: <HeartPulse className="w-8 h-8 text-rose-500" />,
  briefcase: <Briefcase className="w-8 h-8 text-indigo-500" />,
  building: <Building2 className="w-8 h-8 text-emerald-500" />,
  building2: <Building2 className="w-8 h-8 text-emerald-500" />,
  graduationcap: <GraduationCap className="w-8 h-8 text-blue-600" />,
  gavel: <Gavel className="w-8 h-8 text-amber-600" />,
  soup: <Soup className="w-8 h-8 text-orange-500" />,
  truck: <Truck className="w-8 h-8 text-slate-500" />,
};

const getCategoryIcon = (iconName: string | null) => {
  if (!iconName) return <Wrench className="w-8 h-8 text-blue-500" />;
  const normalized = iconName.toLowerCase();
  return iconMap[normalized] || <Grid className="w-8 h-8 text-gray-500" />;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F19] relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        className="flex justify-between items-end mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Browse Categories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
            Find the perfect service professional for your needs from our curated list of categories.
          </p>
        </div>
        <Link 
          href="/services" 
          className="hidden md:flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View all categories
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-white/10 mb-6" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10" />
                </CardContent>
             </Card>
          ))
        ) : (
          categories.map((category, i) => {
            const IconComponent = getCategoryIcon(category.icon);

            return (
              <motion.div
                key={category.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Link href={`/services/${category.id}`}>
                  <Card className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/10 hover:border-blue-500/20 transition-all cursor-pointer group h-full">
                    <CardContent className="p-6 flex flex-col h-full justify-between">
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          {IconComponent}
                        </div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">{category.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {category.description || `Browse top-rated ${category.name} professionals.`}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                        {category.services?.length || 0} services available
                        <ChevronRight className="ml-1 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>
      
      <div className="mt-8 flex justify-center md:hidden">
         <Link 
          href="/services" 
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View all categories
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
