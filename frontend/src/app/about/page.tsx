"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCMS } from "@/hooks/useCMS";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import { FeatureCardGrid } from "@/components/shared/FeatureCardGrid";
import { Shield } from "lucide-react";

export default function AboutPage() {
  const { getS, getImg } = useCMS();
  const { features: values } = usePageFeatures('about');



  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={getS('hero_media', 'about_hero_title', 'About KUBA')}
        subtitle={getS('hero_media', 'about_hero_subtitle', 'Redefining how home services are delivered across the continent.')}
        badge={getS('hero_media', 'about_hero_badge', 'Who We Are')}
        cmsKey="about_hero_image"
        cmsGroup="hero_media"
      />

      {/* Our Story */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex-[3] relative rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
                <img
                  src={getImg('about_page', 'about_story_image_1', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop')}
                  alt="Professional at work"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-[2] flex flex-col gap-4">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                  <img
                    src={getImg('about_page', 'about_story_image_2', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop')}
                    alt="Team collaboration"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                  <img
                    src={getImg('about_page', 'about_story_image_3', 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop')}
                    alt="Customer service"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-[4px] text-xs mb-4 block">Our Story</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {getS('about_page', 'about_headline', 'Redefining Home Services Excellence')}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-lg italic mb-8 border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-2">
                {getS('about_page', 'about_tagline', "Born from a simple frustration: finding quality home help shouldn't be this hard.")}
              </p>
              <div className="space-y-6 text-gray-600 dark:text-muted-foreground leading-relaxed mb-10">
                <p>
                  {getS('about_page', 'about_paragraph_1', 'KUBA was founded with a mission to connect homeowners with the best local service professionals. We believe everyone deserves access to reliable, transparent, and affordable home services.')}
                </p>
                <p>
                  {getS('about_page', 'about_paragraph_2', 'Our platform rigorously vets every professional, provides upfront pricing, and ensures secure payments — so you can focus on what matters most while we handle the rest.')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-border dark:border-white/10">
                <div>
                  <h4 className="text-4xl font-semibold text-gray-900 dark:text-white mb-1">{getS('about_page', 'about_stat_providers', '5k+')}</h4>
                  <p className="text-xs font-bold text-muted-foreground dark:text-muted-foreground tracking-widest">Active Providers</p>
                </div>
                <div>
                  <h4 className="text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-1">{getS('about_page', 'about_stat_satisfaction', '98%')}</h4>
                  <p className="text-xs font-bold text-muted-foreground dark:text-muted-foreground tracking-widest">Satisfaction Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-muted dark:bg-zinc-900/50 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-[4px] text-xs mb-4 block">Our Values</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">The Principles That Drive Us</h2>
          </motion.div>
          <FeatureCardGrid
            features={values}
            columns={3}
            accentColor="blue"
            fallbackIcon={Shield}
            variant="centered"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to get started?</h2>
          <p className="text-muted-foreground dark:text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Whether you need a quick repair or a full renovation, KUBA connects you with trusted local professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-full">
              <Link href="/services">Browse Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold h-14 px-8 rounded-full">
              <Link href="/providers">Find Professionals</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
