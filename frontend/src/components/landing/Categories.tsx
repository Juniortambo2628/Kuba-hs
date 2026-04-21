"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { cn, getMediaUrl } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ChevronRight,
  Grid,
} from "lucide-react";
import Link from "next/link";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { iconMap, getCategoryIcon } from "@/lib/category-icons";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  dynamic_icon_url: string | null;
  services_count: number;
  slug: string;
  image_url: string | null;
  services: any[];
}

const getCategoryDisplayIcon = (category: Category) => {
  const dynamicUrl = category.dynamic_icon_url;
  const isMedia = dynamicUrl && (dynamicUrl.includes('/') || dynamicUrl.includes('.') || dynamicUrl.startsWith('http'));

  if (isMedia) {
    return (
      <div className="relative w-5 h-5">
        <Image 
          src={getMediaUrl(dynamicUrl) || "/placeholders/kuba-placeholder.png"} 
          alt={category.name} 
          fill
          sizes="40px"
          className="object-contain"
        />
      </div>
    );
  }

  // Use icon property from category with the imported helper
  return getCategoryIcon(category.icon, "w-8 h-8 text-blue-500", category.name);
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
    <section className="pt-24 pb-0 bg-background relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={designSystem.typography.section.title}>
              Explore All Categories
            </h2>
            <p className={designSystem.typography.section.subtitle}>
              Find the right help for your home or business from our list of services.
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
      </div>

      <div className="w-full bg-slate-50 dark:bg-white/5 border-y border-gray-100 dark:border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col lg:flex-row gap-12 text-blue-500">
              <div className="w-full lg:w-1/3 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
                ))}
              </div>
              <div className="w-full lg:w-2/3 space-y-6">
                <Skeleton className="h-[500px] w-full rounded-[2.5rem] bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
          ) : categories.length > 0 ? (
            <Tabs defaultValue={categories[0]?.id.toString()} className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start" orientation="vertical">
            
            {/* Left Column: Category Tabs (Scrollable) */}
            <div className="w-full lg:w-1/3 shrink-0 lg:sticky lg:top-24 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar lg:pb-12">
              <TabsList className="flex flex-col h-auto w-full bg-transparent gap-3 p-0 data-[orientation=vertical]:flex-col items-start justify-start relative">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id.toString()}
                    className="w-full justify-start text-left px-5 py-4 rounded-2xl border-2 border-transparent data-[state=active]:bg-background data-[state=active]:shadow-xl data-[state=active]:border-blue-600/20 dark:data-[state=active]:border-blue-500/20 data-[state=active]:text-primary group transition-all duration-300 hover:bg-white dark:hover:bg-white/5"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center group-data-[state=active]:bg-blue-600 group-data-[state=active]:text-white shadow-sm transition-all duration-300">
                            {getCategoryDisplayIcon(category)}
                          </div>
                          <div className="text-left">
                            <div className="font-extrabold text-gray-900 dark:text-gray-200 group-data-[state=active]:text-blue-600 dark:group-data-[state=active]:text-blue-400 text-lg tracking-tighter">
                              {category.name}
                            </div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {category.services_count || 0} Specializations
                            </div>
                          </div>
                      </div>
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Right Column: Sticky Preview Card */}
            <div className="w-full lg:w-2/3 lg:sticky lg:top-24">
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()} className="mt-0 outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-white/5 relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    
                    <div className="relative z-10">
                      <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                           Market Focus <ArrowRight className="w-3 h-3" />
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter leading-none">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                          {category.description || `High-performance ${category.name} solutions tailored for your specific environment.`}
                        </p>
                      </div>

                      <div className="space-y-4 mb-12">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Top Specializations</div>
                        {category.services && category.services.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {category.services.slice(0, 5).map((service) => (
                              <Link 
                                key={service.id}
                                href={`/services/${service.id}?type=general`}
                                className="group/item flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-600/20 dark:hover:border-blue-500/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 opacity-20 group-hover/item:opacity-100 transition-opacity" />
                                  <span className="font-bold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                    {service.name}
                                  </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transform translate-x-0 group-hover/item:translate-x-1 transition-all" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                            No specializations listed yet.
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] h-14 px-8 shadow-xl shadow-blue-600/20">
                          <Link href={`/services?category=${category.id}`}>
                            See All {category.name} <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full sm:w-auto rounded-2xl font-bold text-gray-500 hover:text-blue-600 transition-colors h-14">
                           <Link href="/services">Browse Marketplace</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : null}
      </div></div>
      
      <div className="py-8 flex justify-center md:hidden bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
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
