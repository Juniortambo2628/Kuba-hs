"use client";

import { motion } from "framer-motion";
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CorporateSolutions() {
  return (
    <section className="py-24 bg-primary overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className={designSystem.typography.section.badge}>
              <Building2 className="w-3.5 h-3.5 inline mr-2" />
              For Enterprises & SMEs
            </div>
            
            <h2 className={designSystem.typography.section.title + " text-white"}>
              Streamline Your <br />
              <span className="text-white/60">Business Operations</span>
            </h2>
            
            <p className={designSystem.typography.section.subtitle + " text-white/70"}>
              Kuba provides tailored service packages for corporate clients. From office maintenance to professional consulting, manage everything through one centralized dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Consolidated Monthly Billing",
                "Dedicated Account Manager",
                "Priority Service Allocation",
                "Vetted Enterprise Pros"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95">
                <Link href="/contact?type=corporate">Get a Corporate Quote</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold text-sm">
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="relative p-8 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className={designSystem.typography.legal.meta + " text-white/40"}>Elite Status</p>
                    <p className={designSystem.typography.section.cardTitle + " text-white leading-tight"}>Guaranteed Quality</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-white" 
                      />
                   </div>
                   <div className="flex justify-between text-[10px] font-semibold text-white/60 tracking-widest uppercase">
                      <span>Service Efficiency</span>
                      <span>99.9%</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                      <Zap className="w-6 h-6 text-white" />
                      <p className={designSystem.typography.section.cardText + " text-white"}>Instant Deployment</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                      <Building2 className="w-6 h-6 text-white" />
                      <p className={designSystem.typography.section.cardText + " text-white"}>Multiple Branches</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
