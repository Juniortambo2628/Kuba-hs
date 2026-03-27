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
  return getCategoryIcon(category.icon, "w-8 h-8 text-blue-500");
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

      <div className="w-full bg-gray-50 dark:bg-white/5 border-y border-gray-100 dark:border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/3 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
                ))}
              </div>
              <div className="w-full lg:w-2/3 space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-20 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-20 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
          ) : categories.length > 0 ? (
            <Tabs defaultValue={categories[0]?.id.toString()} className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12" orientation="vertical">
            
            {/* Left Column: Category Tabs */}
            <div className="w-full lg:w-1/3 shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2 p-0 data-[orientation=vertical]:flex-col items-start justify-start relative">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id.toString()}
                    className="w-full justify-start text-left px-6 py-4 rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-lg dark:data-[state=active]:border-primary/30 data-[state=active]:text-primary group transition-all"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center group-data-[state=active]:bg-blue-50 dark:group-data-[state=active]:bg-blue-500/10 transition-colors">
                            {getCategoryDisplayIcon(category)}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-900 dark:text-gray-300 group-data-[state=active]:text-blue-600 dark:group-data-[state=active]:text-blue-400 text-lg tracking-tight">
                              {category.name}
                            </div>
                            <div className="text-xs font-medium text-gray-500 tracking-tight">
                              {category.services_count || 0} services
                            </div>
                          </div>
                      </div>
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Right Column: Accordions for Services */}
            <div className="w-full lg:w-2/3">
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()} className="mt-0 outline-none">
                  <div className="bg-background rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="mb-8">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                        {category.name} Services
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                        {category.description || `Browse top-rated ${category.name} professionals and services.`}
                      </p>
                    </div>

                    {category.services && category.services.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {category.services.map((service, idx) => (
                          <AccordionItem
                            key={service.id}
                            value={`service-${service.id}`}
                            className="group bg-muted border border-transparent rounded-2xl overflow-hidden px-6 transition-all hover:border-gray-200 dark:hover:border-white/10 data-[state=open]:bg-background data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
                          >
                            <AccordionTrigger className="text-left text-gray-900 dark:text-white font-bold hover:no-underline py-5 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                              {service.name}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-400 text-sm xl:text-base leading-relaxed pb-6 font-medium">
                              Looking for trustworthy {service.name.toLowerCase()} professionals? We have verified experts ready to help with your project. Get guaranteed quality and transparent pricing.
                              <div className="mt-6">
                                <Button asChild size="sm" className="rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-bold border-0 shadow-none px-6">
                                  <Link href={`/services/${service.id}?type=general`}>
                                    Service Details <ArrowRight className="ml-2 w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">No specific services listed yet under this category.</p>
                        <Button asChild variant="outline" className="rounded-full font-bold px-8">
                           <Link href={`/services/${category.id}`}>Explore Category</Link>
                        </Button>
                      </div>
                    )}
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
