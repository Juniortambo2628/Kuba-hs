"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Briefcase, ChevronRight, ShieldCheck, Zap, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { designSystem } from "@/lib/design-system";

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold tracking-widest capitalize text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-colors z-10">
        <ChevronLeft className="w-4 h-4" /> Return to Home
      </Link>
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 mt-12">
        
        {/* Client Choice */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative"
        >
          <Link href="/register/client">
            <div className="h-full p-8 rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 capitalize tracking-tight">I'm a Customer</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                I'm looking for trusted pros for my home or business.
              </p>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold capitalize text-xs tracking-widest">
                Join as a Customer <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Provider Choice */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative"
        >
          <Link href="/register/provider">
            <div className="h-full p-8 rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all duration-300 shadow-xl shadow-transparent hover:shadow-emerald-500/5">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 capitalize tracking-tight">I'm a Pro</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                I want to offer my services and grow my business with Kuba.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold capitalize text-xs tracking-widest">
                Join as a Pro <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>

      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
