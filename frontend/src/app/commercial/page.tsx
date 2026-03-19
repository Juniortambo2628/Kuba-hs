"use client";

import { motion } from "framer-motion";
import { Building2, ShieldCheck, Zap, ArrowRight, CheckCircle2, Users, BarChart3, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { designSystem } from "@/lib/design-system";
import Link from "next/link";

import { useCMS } from "@/hooks/useCMS";

export default function CommercialPage() {
  const { getS } = useCMS();
  
  const categories = [
    {
      title: "Facility Management",
      description: "End-to-end maintenance for offices, retail spaces, and warehouses.",
      icon: Building2,
      features: ["Janitorial Services", "HVAC Maintenance", "Security Systems", "Plumbing & Electrical"]
    },
    {
      title: "Staff Wellness",
      description: "On-site wellness programs to boost employee morale and productivity.",
      icon: Heart,
       features: ["Office Massage", "Fitness Training", "Mental Health Support", "Ergonomics Consulting"]
    },
    {
      title: "Bulk Operations",
      description: "High-volume services for large-scale properties or scheduled fleets.",
      icon: Zap,
      features: ["Fleet Cleaning", "Bulk Laundry", "Periodic Pesticide", "Relocation Support"]
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-primary">
         <div className="absolute inset-0 bg-black/20" />
         <div className="container relative z-10 mx-auto px-6 text-center text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={designSystem.typography.hero.badge}
            >
              <Building2 className="w-3.5 h-3.5 inline mr-2" />
              {getS('commercial_page', 'hero_badge', 'Kuba Business Solutions')}
            </motion.div>
            
            <h1 className={designSystem.typography.hero.title}>
              {getS('commercial_page', 'hero_title', 'Services for Modern Organizations')}
            </h1>
            
            <p className={designSystem.typography.hero.subtitle + " text-white/70"}>
               {getS('commercial_page', 'hero_subtitle', 'From facility management to staff wellness, Kuba supports your business operations with verified professionals and consolidated management.')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105">
                <Link href="/quotes/apply?type=commercial">Request a Corporate Quote</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold text-sm">
                Book Consultation
              </Button>
            </div>
         </div>
         
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* Value Prop */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: BarChart3, 
              title: getS('commercial_page', 'value_prop_1_title', 'Consolidated Billing'), 
              desc: getS('commercial_page', 'value_prop_1_desc', 'One monthly invoice for all services booked across your company locations.') 
            },
            { 
              icon: Users, 
              title: getS('commercial_page', 'value_prop_2_title', 'Account Manager'), 
              desc: getS('commercial_page', 'value_prop_2_desc', 'A dedicated point of contact to handle all your scheduling and custom requests.') 
            },
            { 
              icon: ShieldCheck, 
              title: getS('commercial_page', 'value_prop_3_title', 'Compliance Ready'), 
              desc: getS('commercial_page', 'value_prop_3_desc', 'Fully insured and vetted professionals meeting your corporate safety standards.') 
            }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
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
               {getS('commercial_page', 'categories_title', 'Commercial Service Categories')}
             </h2>
             <p className={designSystem.typography.section.subtitle}>
               {getS('commercial_page', 'categories_subtitle', 'Tailored solutions for every industry vertical.')}
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="p-8 bg-background border border-border rounded-[2.5rem] space-y-6 group hover:border-primary/50 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className={designSystem.typography.section.cardTitle}>{cat.title}</h3>
                  <p className={designSystem.typography.section.cardText + " italic"}>{cat.description}</p>
                </div>
                <ul className="space-y-3 pt-4">
                  {cat.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-primary opacity-40" />
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
        <div className="p-12 md:p-20 bg-primary rounded-[3rem] text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 max-w-2xl space-y-8 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                {getS('commercial_page', 'cta_title', 'Need a customized service package?')}
              </h2>
              <p className="text-lg text-white/70">
                {getS('commercial_page', 'cta_subtitle', 'Our team can design a bespoke solution that fits your specific business requirements and budget.')}
              </p>
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                  <Button asChild className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-2xl font-black">
                     <Link href="/quotes/apply?type=commercial_custom">Start Configuration</Link>
                  </Button>
                  <span className="text-sm font-bold opacity-60">
                    {getS('commercial_page', 'cta_contact', 'or call +254 700 000 000')}
                  </span>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Subcomponent fix
const Heart = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
