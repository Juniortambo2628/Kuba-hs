"use client";

import { motion } from "framer-motion";
import { Users, Heart, Share2, Scale, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { designSystem } from "@/lib/design-system";
import Link from "next/link";

import { useCMS } from "@/hooks/useCMS";

export default function CooperativesPage() {
  const { getS } = useCMS();
  
  const categories = [
    {
      title: "Community Services",
      description: "Shared services for gated communities, apartments, and cooperatives.",
      icon: Users,
      features: ["Common Area Cleaning", "Estate Maintenance", "Group Security", "Solar Maintenance"]
    },
    {
      title: "Member Welfare",
      description: "Scalable wellness and personal packages for cooperative members.",
      icon: Heart,
       features: ["Mobile Health Clinics", "Home Grooming Sets", "Childcare Clusters", "Elderly Support"]
    },
    {
      title: "Group Financials",
      description: "Consolidated procurement and billing for group-negotiated rates.",
      icon: Scale,
      features: ["Bulk Supply Rates", "Installment Payments", "Revenue Transparency", "Usage Analytics"]
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-indigo-600">
         <div className="absolute inset-0 bg-black/10" />
         <div className="container relative z-10 mx-auto px-6 text-center text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={designSystem.typography.hero.badge}
            >
              <Share2 className="w-3.5 h-3.5 inline mr-2" />
              {getS('cooperative_page', 'hero_badge', 'KUBA COOPERATIVES & GROUPS')}
            </motion.div>
            
            <h1 className={designSystem.typography.hero.title}>
              {getS('cooperative_page', 'hero_title', 'Community Centered & Scalable Solutions')}
            </h1>
            
            <p className={designSystem.typography.hero.subtitle + " text-white/70"}>
               {getS('cooperative_page', 'hero_subtitle', 'Serving multiple members under one structure. Kuba empowers cooperatives with negotiated rates and community-driven service allocation.')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-white text-indigo-600 hover:bg-white/90 h-14 px-8 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105">
                <Link href="/quotes/apply?type=cooperative">Enroll Your Cooperative</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold text-sm">
                Request Member Package
              </Button>
            </div>
         </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Users, 
              title: getS('cooperative_page', 'value_prop_1_title', 'Scalable Infrastructure'), 
              desc: getS('cooperative_page', 'value_prop_1_desc', 'Easily onboard hundreds of members into professional home service programs.') 
            },
            { 
              icon: Heart, 
              title: getS('cooperative_page', 'value_prop_2_title', 'Community Focused'), 
              desc: getS('cooperative_page', 'value_prop_2_desc', 'Shared goals and negotiated group rates that benefit every individual member.') 
            },
            { 
              icon: Zap, 
              title: getS('cooperative_page', 'value_prop_3_title', 'Efficient Deployment'), 
              desc: getS('cooperative_page', 'value_prop_3_desc', 'Coordinated service delivery to maximize coverage across member locations.') 
            }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-indigo-600" />
               </div>
               <h3 className={designSystem.typography.section.cardTitle}>{item.title}</h3>
               <p className={designSystem.typography.section.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 space-y-16">
          <div className="max-w-2xl">
             <h2 className={designSystem.typography.section.title}>
               {getS('cooperative_page', 'categories_title', 'Cooperative Service Layers')}
             </h2>
             <p className={designSystem.typography.section.subtitle}>
               {getS('cooperative_page', 'categories_subtitle', "Built to grow with your community's needs.")}
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="p-8 bg-background border border-border rounded-[2.5rem] space-y-6 group hover:border-indigo-600/50 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className={designSystem.typography.section.cardTitle}>{cat.title}</h3>
                  <p className={designSystem.typography.section.cardText + " italic"}>{cat.description}</p>
                </div>
                <ul className="space-y-3 pt-4">
                  {cat.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 opacity-40" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request CTA */}
      <section className="py-24 container mx-auto px-6">
        <div className="p-12 md:p-20 bg-indigo-600 rounded-[3rem] text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 max-w-2xl space-y-8 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                {getS('cooperative_page', 'cta_title', 'Empower your group with Kuba.')}
              </h2>
              <p className="text-lg text-white/70">
                {getS('cooperative_page', 'cta_subtitle', 'From apartment clusters to large cooperative unions, we provide the service infrastructure your members deserve.')}
              </p>
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                  <Button asChild className="bg-white text-indigo-600 hover:bg-white/90 h-14 px-8 rounded-2xl font-black">
                     <Link href="/quotes/apply?type=cooperative_custom">Start Group Consultation</Link>
                  </Button>
                  <span className="text-sm font-bold opacity-60">
                    {getS('cooperative_page', 'cta_footer', 'Custom member portal available')}
                  </span>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
