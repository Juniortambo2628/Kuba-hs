"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  ChevronRight, ArrowRight, Star, Clock, MapPin, 
  Wrench, Car, Home, Heart, Briefcase, Building2, Sparkles, Droplet, Zap,
  CheckCircle2, ShieldCheck, User, Plus
} from "lucide-react";
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

const iconMap: Record<string, React.ReactNode> = {
    wrench: <Wrench className="w-8 h-8 text-blue-500" />,
    car: <Car className="w-8 h-8 text-rose-500" />,
    home: <Home className="w-8 h-8 text-blue-500" />,
    heart: <Heart className="w-8 h-8 text-pink-500" />,
    briefcase: <Briefcase className="w-8 h-8 text-indigo-500" />,
    building: <Building2 className="w-8 h-8 text-emerald-500" />,
    sparkles: <Sparkles className="w-8 h-8 text-purple-500" />,
    droplet: <Droplet className="w-8 h-8 text-cyan-500" />,
    bolt: <Zap className="w-8 h-8 text-yellow-500" />,
};

const imageMap: Record<string, string> = {
    // Dynamic images could be added here
};

export default function CategoryDetailPage() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) return;
            try {
                const res = await axiosInstance.get(`/api/categories/${id}`);
                setCategory(res.data.data || res.data);
            } catch (err) {
                console.error("Failed to fetch category:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const Icon = category?.icon && iconMap[category.icon] ? iconMap[category.icon] : <Wrench className="w-8 h-8 text-blue-500" />;
    const bgImage = (id && typeof id === 'string' && imageMap[id]) || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/50">
                <Navbar />
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
                    <Skeleton className="h-12 w-64 rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tighter">Category Not Found</h1>
                <Link href="/services">
                    <Button variant="outline" className="rounded-xl px-8 font-bold">Back to Services</Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#0B0F19] selection:bg-blue-500/30 transition-colors duration-300">
            <Navbar />
            
            <HighImpactHero
                title={category.name}
                subtitle={category.description || `Discover specialized ${category.name.toLowerCase()} solutions tailored for your requirements.`}
                breadcrumbs={[
                    { label: "Services", href: "/services" },
                    { label: category.name }
                ]}
                bgImage={bgImage}
            >
                <div className="flex flex-wrap gap-4 mt-2">
                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary tracking-widest capitalize">Verified Ecosystem</span>
                    </div>
                </div>
            </HighImpactHero>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Services Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground italic flex items-center gap-3">
                                   <div className="w-8 h-1 bg-primary rounded-full hidden md:block" /> {category.name} <span className="text-muted-foreground font-medium NOT-italic">Specializations</span>
                                </h2>
                                <p className="text-muted-foreground font-medium text-sm mt-2 font-sans">Select a specific service profile to view active professionals in your region.</p>
                            </div>
                            <span className="shrink-0 bg-primary/5 text-primary font-bold text-[10px] px-4 py-2 rounded-xl tracking-widest border border-primary/10 capitalize">
                                {category.services?.length || 0} Domains Available
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {category.services?.map((service, i) => (
                                <motion.div 
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={`/providers?service=${service.id}`} className="group block h-full">
                                        <Card className="h-full bg-white dark:bg-black border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-[2.5rem] overflow-hidden group-hover:border-primary/30">
                                            <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                                                <div className="space-y-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40 shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                                                        <Plus className="w-6 h-6 text-primary group-hover:text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                                                        {service.name}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <div className="pt-6 border-t border-border/10 flex items-center text-[10px] font-bold text-primary tracking-widest group-hover:translate-x-2 transition-transform duration-500 capitalize">
                                                    Explore Professionals <ArrowRight className="ml-2 w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / CTA Column */}
                    <div className="space-y-10">
                        <div className="bg-primary dark:bg-indigo-950/40 border border-primary/20 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
                            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20">
                                   <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tighter leading-tight italic">Consolidated <span className="text-white/60">Professional</span> Ecosystem.</h3>
                                <div className="space-y-4 pt-4">
                                    {[
                                        "Industry Verified Expertise",
                                        "Unified Transaction Layer",
                                        "Institutional Compliance",
                                        "Strategic Support Framework"
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                               <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-white/80 tracking-tight">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-14 bg-white text-primary hover:bg-slate-50 hover:scale-[1.02] transition-all rounded-2xl font-bold tracking-widest text-[10px] capitalize shadow-xl mt-6">
                                    Partner with Kuba
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-border/40 space-y-8">
                            <h4 className="text-[11px] font-bold text-muted-foreground tracking-widest capitalize flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> Emerging Talent
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { name: "Alex Johnson", rating: 5, status: "PLATINUM" },
                                    { name: "Sarah Miller", rating: 4, status: "VERIFIED" }
                                ].map((pro, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-black rounded-2xl border border-border/40 hover:border-primary/20 transition-colors shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-muted-foreground border border-border/20">
                                               {pro.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight text-foreground">{pro.name}</p>
                                                <div className="flex gap-0.5 text-amber-500">
                                                    {Array.from({ length: pro.rating }).map((_, j) => (
                                                        <Star key={j} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-lg border ${i === 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            {pro.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
