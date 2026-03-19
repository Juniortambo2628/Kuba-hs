"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, CheckCircle2, Check } from "lucide-react";

export function About() {
  const steps = [
    {
      id: "search",
      number: "1",
      title: "Tell us what you need",
      icon: Search,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      description: "Describe your service requirement in detail so we can match you with the perfect provider."
    },
    {
      id: "time",
      number: "2",
      title: "Choose a time",
      icon: CalendarCheck,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      description: "Select your preferred date and time that works best for your schedule."
    },
    {
      id: "done",
      number: "3",
      title: "We handle the rest",
      icon: Check,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      description: "Our vetted professionals will arrive on time and deliver exceptional service."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">How it works</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-muted-foreground leading-relaxed italic">
            Getting the services you need has never been easier. Just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-[10%] right-[10%] h-0.5 bg-gray-100 dark:bg-white/5 -z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="relative mb-8">
                 {/* Step Number Badge */}
                 <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white dark:border-[#0B0F19] text-white text-[10px] font-semibold flex items-center justify-center shadow-lg">
                    {step.number}
                 </div>
                 
                 {/* Icon Container */}
                 <div className={`w-20 h-20 rounded-full ${step.iconBg} dark:bg-white/5 flex items-center justify-center shadow-inner`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                 </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed max-w-[240px] font-medium italic">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
