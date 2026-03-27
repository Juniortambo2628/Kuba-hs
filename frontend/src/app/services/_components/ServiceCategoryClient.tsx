"use client";

import { use, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { HeroSkeleton, CardSkeleton } from "@/components/shared/AdvancedSkeleton";
import Link from "next/link";
import { motion } from "framer-motion";

interface Service {
    id: string;
    name: string;
    description: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    icon: string | null;
    services: Service[];
}

export default function ServiceCategoryClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: category, isLoading } = useData<Category>(id ? `/api/categories/${id}` : null);

    const bgImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070";

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <HeroSkeleton />
                <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
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
                subtitle={category.description || `Discover specialized ${category.name.toLowerCase()} solutions.`}
                breadcrumbs={[
                    { label: "Services", href: "/services" },
                    { label: category.name }
                ]}
                bgImage={bgImage}
            />

            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {category.services?.map((service) => (
                        <Link key={service.id} href={`/services/${service.id}?type=general`}>
                            <Card className="rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all border-border/50 group">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-4 italic group-hover:text-primary transition-colors">{service.name}</h3>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed">{service.description}</p>
                                    <div className="mt-8 pt-6 border-t border-border/40 flex justify-between items-center">
                                        <Link 
                                            href={`/services?category=${category.id}`}
                                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                                        >
                                            <motion.span whileHover={{ x: 5 }} className="text-xs font-bold text-foreground">Explore Professionals →</motion.span>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
