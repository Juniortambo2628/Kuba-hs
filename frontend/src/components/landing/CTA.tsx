"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 bg-white dark:bg-[#0B0F19] relative transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {/* Aesthetic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 z-0" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[100px] z-0" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-[100px] z-0" />
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
            <span className="bg-blue-500/10 dark:bg-white/10 text-blue-600 dark:text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-blue-500/20 dark:border-white/20 backdrop-blur-sm">
                Get Started Today
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Ready to find a professional?
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
              Join thousands of happy customers who have already found reliable help through KUBA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-full shadow-lg shadow-blue-900/20 w-full sm:w-auto">
                    <Link href="/services">Browse Services</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold h-14 px-8 rounded-full w-full sm:w-auto">
                    <Link href="/register?role=provider">Join as a Pro</Link>
                </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
