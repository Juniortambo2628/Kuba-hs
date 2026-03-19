"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={bgImage} alt={category.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent dark:from-[#0B0F19] dark:via-[#0B0F19]/60 dark:to-transparent" />
                </div>
                
                <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-auto w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8"
                    >
                        {Icon}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-semibold text-white tracking-tighter"
                    >
                        {category.name}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 font-medium max-w-2xl mx-auto"
                    >
                        {category.description}
                    </motion.p>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Services Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold text-foreground dark:text-white tracking-tighter leading-none">
                                Browse <span className="text-sky-600">{category.name}</span> Services
                            </h2>
                            <span className="bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold text-[10px] px-3 py-1 rounded-full tracking-widest border border-sky-100 dark:border-sky-500/20">
                                {category.services?.length || 0} Specializations Available
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {category.services?.map((service, i) => (
                                <motion.div 
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link href={`/providers?service=${service.id}`} className="group block h-full">
                                        <Card className="h-full bg-gray-50 dark:bg-white/5 border-none shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-white/10 transition-all duration-500 rounded-[2rem] overflow-hidden">
                                            <CardContent className="p-8 space-y-4 flex flex-col justify-between h-full">
                                                <div className="space-y-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 transition-all duration-500">
                                                        <Plus className="w-5 h-5 text-sky-600 group-hover:text-white transition-colors" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-foreground dark:text-white group-hover:text-sky-600 transition-colors leading-tight">
                                                        {service.name}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                                                    Find active providers <ArrowRight className="ml-2 w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / CTA Column */}
                    <div className="space-y-8">
                        <Card className="bg-primary border-none rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-600/30 rounded-full blur-[100px] group-hover:bg-sky-600/50 transition-all duration-1000"></div>
                            <div className="relative z-10 space-y-6">
                                <ShieldCheck className="w-12 h-12 text-sky-400" />
                                <h3 className="text-2xl font-semibold tracking-tighter italic">Why trust <span className="text-sky-400">KUBA</span>?</h3>
                                <div className="space-y-4">
                                    {[
                                        "Vetted & Verified Professionals",
                                        "Secure Integrated Payments",
                                        "24/7 Priority Support",
                                        "100% Satisfaction Guarantee"
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-bold text-gray-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-14 bg-white text-foreground hover:bg-sky-50 hover:scale-[1.02] transition-all rounded-2xl font-semibold tracking-widest text-[11px] mt-4">
                                    Become a Provider
                                </Button>
                            </div>
                        </Card>

                        <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-border dark:border-white/10 space-y-6">
                            <h4 className="text-sm font-semibold text-foreground dark:text-white tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-sky-600" /> Popular in this category
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-border dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground dark:text-white">Alex Johnson</p>
                                            <div className="flex text-amber-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">VERIFIED</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-border dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground dark:text-white">Sarah Miller</p>
                                            <div className="flex text-amber-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">VERIFIED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
