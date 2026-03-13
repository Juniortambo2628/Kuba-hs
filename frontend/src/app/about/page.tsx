"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Trophy, Gem, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Quality First",
    desc: "We vet every provider to ensure only the highest standards of service for your home.",
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Full Transparency",
    desc: "Upfront pricing and clear communication between providers and customers.",
    icon: Gem,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Safety Guaranteed",
    desc: "Your security is paramount. Every transaction and provider is monitored for safety.",
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 py-24 md:py-32 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">About KUBA</h1>
            <div className="flex items-center justify-center gap-2 text-white/70 font-medium text-sm">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">About Us</span>
            </div>
          </motion.div>
        </div>
      </section>

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
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
                  alt="Professional at work"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-[2] flex flex-col gap-4">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative">
                  <img
                    src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop"
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
              <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[4px] text-xs mb-4 block">Our Story</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Redefining Home Services Excellence
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-lg italic mb-8 border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-2">
                Born from a simple frustration: finding quality home help shouldn't be this hard.
              </p>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                <p>
                  KUBA was founded with a mission to connect homeowners with the best local service professionals. We believe everyone deserves access to reliable, transparent, and affordable home services.
                </p>
                <p>
                  Our platform rigorously vets every professional, provides upfront pricing, and ensures secure payments — so you can focus on what matters most while we handle the rest.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-200 dark:border-white/10">
                <div>
                  <h4 className="text-4xl font-black text-gray-900 dark:text-white mb-1">5k+</h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Providers</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">98%</h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Satisfaction Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-900/50 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[4px] text-xs mb-4 block">Our Values</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">The Principles That Drive Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 text-center hover:-translate-y-2 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className={`w-16 h-16 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
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
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
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
