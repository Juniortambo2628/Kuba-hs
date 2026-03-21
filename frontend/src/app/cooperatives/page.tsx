"use client";

import { motion } from "framer-motion";
import { Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { useCMS } from "@/hooks/useCMS";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { CTABanner } from "@/components/shared/CTABanner";

export default function CooperativesPage() {
  const { getS, getImg } = useCMS();
  const { features: categories } = usePageFeatures('cooperatives');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={getS('hero_media', 'cooperatives_hero_title', 'Community Centered & Scalable Solutions')}
        subtitle={getS('hero_media', 'cooperatives_hero_subtitle', 'Serving multiple members under one structure. Kuba empowers cooperatives with negotiated rates and community-driven service allocation.')}
        badge={getS('hero_media', 'cooperatives_hero_badge', 'Kuba Cooperatives & Groups')}
        cmsKey="cooperatives_hero_image"
        cmsGroup="hero_media"
      />

      {/* Thesis Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                {getS('sections', 'cooperatives_thesis_title', 'Stronger Together through Shared Services')}
              </h2>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium text-lg">
                {getS('sections', 'cooperatives_thesis_body', 'We help gated communities and SACCOs leverage collective bargaining power to secure premium home services at negotiated rates, managed via a single platform.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { 
                  icon: Users, 
                  title: getS('sections', 'cooperatives_value_prop_1_title', 'Scalable Infrastructure'), 
                  desc: getS('sections', 'cooperatives_value_prop_1_desc', 'Easily onboard hundreds of members into professional home service programs.') 
                },
                { 
                  icon: Zap, 
                  title: getS('sections', 'cooperatives_value_prop_3_title', 'Efficient Deployment'), 
                  desc: getS('sections', 'cooperatives_value_prop_3_desc', 'Coordinated service delivery to maximize coverage across member locations.') 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40">
                  <item.icon className="w-5 h-5 text-indigo-600 shrink-0" />
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
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted shadow-2xl">
              <img 
                src={getImg('sections', 'cooperatives_thesis_image', 'https://images.unsplash.com/photo-1577416416181-f2842399183b?auto=format&fit=crop&q=80')} 
                className="w-full h-full object-cover" 
                alt="Community Focus" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                <div className="text-white space-y-2">
                  <span className="text-[10px] font-bold tracking-widest capitalize text-indigo-400">Community Driven</span>
                  <h3 className="text-2xl font-bold tracking-tight">Collective power for individual comfort</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid - Styled like Journal Cards */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
             <h2 className="text-3xl font-bold tracking-tight mb-4">
               {getS('sections', 'cooperatives_categories_title', 'Cooperative Service Layers')}
             </h2>
             <p className="text-muted-foreground font-medium">
               {getS('sections', 'cooperatives_categories_subtitle', "Built to grow with your community's needs.")}
             </p>
          </div>

          <FeatureCardGrid
            features={categories}
            columns={3}
            accentColor="indigo"
            fallbackIcon={Users}
            showChecklist={true}
          />
        </div>
      </section>

      <CTABanner
        title={getS('sections', 'cooperatives_cta_title', 'Empower your group with Kuba.')}
        subtitle={getS('sections', 'cooperatives_cta_subtitle', 'From apartment clusters to large cooperative unions, we provide the service infrastructure your members deserve.')}
        buttonText="Start Group Consultation"
        buttonHref="/quotes/apply?type=cooperative_custom"
        footerText={getS('sections', 'cooperatives_cta_footer', `or call ${getS('general', 'site_phone', '+254 700 000 000')}`)}
        bgColor="bg-indigo-600"
      />

      <Footer />
    </div>
  );
}
