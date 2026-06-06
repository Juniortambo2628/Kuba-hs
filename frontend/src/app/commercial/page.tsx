"use client";

import { motion } from "framer-motion";
import { Building2, CheckCircle2, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { CTABanner } from "@/components/shared/CTABanner";
import Image from "next/image";

export default function CommercialPage() {
  const { getS, getImg } = useCMS();
  const { features: categories } = usePageFeatures('commercial');
  const hero = useMarketingHero("commercial");

  return (
    <MarketingPage hero={hero}>
      <MarketingSection>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                {getS('sections', 'commercial_thesis_title', 'Consolidated Excellence for Modern Enterprise')}
              </h2>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium text-lg">
                {getS('sections', 'commercial_thesis_body', 'Kuba provides a unified service infrastructure for organizations that demand quality and accountability. From daily janitorial needs to complex facility management, we scale with your business.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { 
                  icon: BarChart3, 
                  title: getS('sections', 'commercial_value_prop_1_title', 'Consolidated Billing'), 
                  desc: getS('sections', 'commercial_value_prop_1_desc', 'One monthly invoice for all services booked across your company locations.') 
                },
                { 
                  icon: Users, 
                  title: getS('sections', 'commercial_value_prop_2_title', 'Account Manager'), 
                  desc: getS('sections', 'commercial_value_prop_2_desc', 'A dedicated point of contact to handle all your scheduling and custom requests.') 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm tracking-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted shadow-2xl relative">
              <Image 
                src={getImg('market_narratives', 'commercial_thesis_image', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')} 
                fill
                className="object-cover" 
                alt="Commercial Excellence" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                <div className="text-white space-y-2">
                  <span className="text-[10px] font-bold tracking-widest capitalize text-blue-400">Institutional Grade</span>
                  <h3 className="text-2xl font-bold tracking-tight">Scale your operations with Kuba Business</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </MarketingSection>

      <MarketingSection className="bg-slate-50 dark:bg-zinc-950/40">
          <div className="max-w-2xl mb-16">
             <h2 className="text-3xl font-bold tracking-tight mb-4">
               {getS('sections', 'commercial_categories_title', 'Commercial Service Categories')}
             </h2>
             <p className="text-muted-foreground font-medium">
               {getS('sections', 'commercial_categories_subtitle', 'Tailored solutions for every industry vertical.')}
             </p>
          </div>

          <FeatureCardGrid
            features={categories}
            columns={3}
            accentColor="primary"
            fallbackIcon={Building2}
            showChecklist={true}
          />
      </MarketingSection>

      <CTABanner
        title={getS('sections', 'commercial_cta_title', 'Need a customized service package?')}
        subtitle={getS('sections', 'commercial_cta_subtitle', 'Our team can design a bespoke solution that fits your specific business requirements and budget.')}
        buttonText="Start Configuration"
        buttonHref="/quotes/apply?type=commercial_custom"
        footerText={getS('sections', 'commercial_cta_contact', `or call ${getS('general', 'site_phone', '+254 700 000 000')}`)}
        bgColor="bg-primary"
      />
    </MarketingPage>
  );
}
