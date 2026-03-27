"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";

export function CTA() {
  const { getS } = useCMS();
  return (
    <section className="py-24 bg-background relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 dark:bg-[#0f1523] border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {/* Aesthetic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10 z-0" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] z-0 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] z-0 translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
            
            {/* Left Content Area */}
            <div className="p-10 md:p-16 lg:p-24 flex flex-col justify-center text-left">
              <div className={designSystem.typography.section.badge}>
                Get Started Today
              </div>
              
              <h2 className={designSystem.typography.section.title}>
                {getS('home_hero', 'cta_title', 'Ready to find a professional?')}
              </h2>
              
              <p className={designSystem.typography.section.subtitle}>
                {getS('home_hero', 'cta_description', 'Join thousands of happy customers who have already found reliable help through KUBA. The smart way to handle home services.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-16 px-10 rounded-full shadow-2xl shadow-blue-600/30 transition-transform hover:-translate-y-1 w-full sm:w-auto text-lg">
                      <Link href="/services">Browse Services</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold h-16 px-10 rounded-full w-full sm:w-auto text-lg transition-transform hover:-translate-y-1">
                      <Link href="/register?role=provider">Join as a Pro</Link>
                  </Button>
              </div>
            </div>

            {/* Right Rich Media Collage */}
            <div className="max-lg:hidden relative h-full w-full min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50 dark:to-[#0f1523] z-10 w-24" />
                <Image 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" 
                    alt="Professionals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-left rounded-r-[3rem]"
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                {/* Floating Stats */}
                <motion.div 
                    className="absolute top-1/4 -left-12 bg-background p-6 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 z-20"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center font-black text-2xl">
                            ✓
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">10k+</p>
                            <p className="text-sm font-bold tracking-tight text-gray-500 dark:text-gray-400">Jobs Done</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="absolute bottom-1/4 right-12 bg-background p-6 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 z-20"
                    initial={{ y: 0 }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center font-black text-2xl">
                            ★
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">4.9</p>
                            <p className="text-sm font-bold tracking-tight text-gray-500 dark:text-gray-400">Avg Rating</p>
                        </div>
                    </div>
                </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
