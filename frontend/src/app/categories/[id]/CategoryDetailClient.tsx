"use client";

import { use, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { designSystem } from "@/lib/design-system";
import { Card } from "@/components/ui/card";
import { useData, prefetchData } from "@/hooks/useData";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { HeroSkeleton, CardSkeleton } from "@/components/shared/AdvancedSkeleton";

interface Service {
  id: string;
  name: string;
  description: string;
  starting_price: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export default function CategoryDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: category, isLoading } = useData<Category>(id ? `/api/categories/${id}` : null);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <HeroSkeleton />
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HighImpactHero
        title={category.name}
        subtitle={category.description || `Discover top-rated professionals specialized in ${category.name.toLowerCase()}.`}
        cmsKey="category_detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name }
        ]}
      />

      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.services?.map((service) => (
            <Link 
              key={service.id} 
              href={`/services/${service.id}?type=general`} 
              className="group block h-full"
              onMouseEnter={() => prefetchData(`/api/services/${service.id}`)}
            >
              <Card className="h-full rounded-[2.5rem] overflow-hidden hover:border-primary transition-all border border-border/50 shadow-sm hover:shadow-xl">
                <div className="p-8 space-y-4">
                  <h3 className={designSystem.typography.section.cardTitle}>{service.name}</h3>
                  <p className={designSystem.typography.section.cardText + " line-clamp-2"}>{service.description}</p>
                  <div className="pt-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                      <span>Starting KES {Number(service.starting_price || 0).toLocaleString()}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Detail</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
