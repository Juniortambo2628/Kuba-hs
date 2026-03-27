"use client";

import { motion } from "framer-motion";
import { Users, MapPin, Clock, Heart } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { designSystem } from "@/lib/design-system";
import Image from "next/image";

export function Stats() {
  const { getS, isLoading } = useCMS();

  const stats = [
    { 
      id: 1, 
      name: getS('site_stats', 'stat_1_label', 'Verified Providers'), 
      value: getS('site_stats', 'stat_1_value', '500+'), 
      icon: Users, 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/20' 
    },
    { 
      id: 2, 
      name: getS('site_stats', 'stat_2_label', 'Cities Covered'), 
      value: getS('site_stats', 'stat_2_value', '10+'), 
      icon: MapPin, 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/20' 
    },
    { 
      id: 3, 
      name: getS('site_stats', 'stat_3_label', 'Support Available'), 
      value: getS('site_stats', 'stat_3_value', '24/7'), 
      icon: Clock, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-400/20' 
    },
    { 
      id: 4, 
      name: getS('site_stats', 'stat_4_label', 'Happy Customers'), 
      value: getS('site_stats', 'stat_4_value', '10k+'), 
      icon: Heart, 
      color: 'text-pink-400', 
      bg: 'bg-pink-400/20' 
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 z-[1]" />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <motion.div
          className="absolute top-10 left-[10%] w-24 h-24 rounded-full bg-blue-400/10 blur-xl"
          animate={{ y: [0, 40, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
           className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-purple-400/10 blur-2xl"
           animate={{ y: [0, -50, 0], opacity: [0.2, 0.5, 0.2] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-[100px]"
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${designSystem.typography.section.title} text-white mb-4`}>
            Why Thousands Trust KUBA
          </h2>
          <p className={`${designSystem.typography.section.subtitle} text-white/60 mx-auto`}>
            We are building the largest network of trusted home service providers.
          </p>
        </motion.div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              className="flex flex-col items-center justify-center text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <dd className="text-4xl font-bold tracking-tight text-white mb-2">{stat.value}</dd>
              <dt className="text-sm font-medium text-white/60 tracking-tight">{stat.name}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
