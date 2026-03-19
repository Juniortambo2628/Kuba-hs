"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Loader2, 
  ArrowLeft, 
  Star, 
  MapPin, 
  ChevronRight,
  Search,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  description: string;
  base_price: string;
  dynamic_image_url?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      // Assuming the API expects ID. If it's slug-based, we'd need to adjust.
      const res = await axiosInstance.get(`/api/categories/${id}`);
      setCategory(res.data.data || res.data || null);
    } catch (err) {
      console.error("Failed to fetch category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading industry detail...</p>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the industry vertical you're looking for.</p>
        <Button asChild>
          <Link href="/categories">Back to Categories</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <Link href="/categories" className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to All Categories
          </Link>
          
          <div className="max-w-4xl space-y-6">
            <h1 className={designSystem.typography.hero.title + " !text-foreground"}>{category.name}</h1>
            <p className={designSystem.typography.hero.subtitle}>
              {category.description || `Discover top-rated professionals specialized in ${category.name.toLowerCase()}.`}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className={designSystem.typography.section.title}>Available Services</h2>
                <p className={designSystem.typography.section.subtitle}>Choose a specific service to find matching providers.</p>
            </div>
            <div className="hidden md:block">
                <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold uppercase text-[10px] tracking-widest">
                    <Search className="w-4 h-4 mr-2" />
                    Filter Results
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.services?.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                href={`/services/${service.id}`}
                className="group block bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {service.dynamic_image_url ? (
                        <img src={service.dynamic_image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                            <CheckCircle2 className="w-20 h-20" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 dark:bg-black/90 text-primary border-none shadow-sm backdrop-blur-sm">
                            From ${service.base_price}
                        </Badge>
                    </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h3 className={designSystem.typography.section.cardTitle}>{service.name}</h3>
                  <p className={designSystem.typography.section.cardText + " line-clamp-2"}>
                    {service.description}
                  </p>
                  
                  <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between group-hover:text-primary transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">Book Expert</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${className}`}>
            {children}
        </span>
    );
}
