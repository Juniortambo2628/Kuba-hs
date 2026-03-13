"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Search, CalendarCheck, CreditCard, Shield, Star, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCMS } from "@/hooks/useCMS";
import { Skeleton } from "@/components/ui/skeleton";

export function About() {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const steps = [
    {
      id: "search",
      title: "Search & Compare",
      icon: Search,
      description: "Browse verified professionals, read real reviews, and compare prices for your specific needs.",
      details: [
        "Filter by service type, location, and availability",
        "Read verified customer reviews and ratings",
        "Compare pricing upfront before you commit"
      ],
      image: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "book",
      title: "Book Instantly",
      icon: CalendarCheck,
      description: "Select an available time slot and book your service professional directly through our platform.",
      details: [
        "Real-time availability calendar",
        "Instant booking confirmation",
        "Automated reminders before your appointment"
      ],
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "pay",
      title: "Secure Payment",
      icon: CreditCard,
      description: "Pay securely online only after the job is completed to your satisfaction.",
      details: [
        "Encrypted payment processing via Stripe",
        "Pay only when the job is done",
        "100% satisfaction guarantee or your money back"
      ],
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-300 border-t border-gray-200 dark:border-white/5">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6 uppercase tracking-wider">
            How It Works
          </div>
          <div 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
            role="heading"
            aria-level={2}
          >
            {cmsLoading ? (
               <Skeleton className="h-12 w-3/4 mx-auto rounded-xl" />
            ) : (
               getS('about', 'about_title', 'The smartest way to hire local professionals.')
            )}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {cmsLoading ? (
               <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
            ) : (
              getS('about', 'about_description_1', 'Three simple steps to get expert help for your home. No endless phone calls, no uncertainty.')
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl h-14 p-1 mb-12">
              {steps.map((step) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-sm transition-all"
                >
                  <step.icon className="w-4 h-4 mr-2" />
                  {step.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                    <ul className="space-y-4 pt-4">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 font-medium">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { icon: Shield, label: "Insured & Bonded", value: "100%" },
            { icon: Star, label: "Average Rating", value: "4.9/5" },
            { icon: Clock, label: "Response Time", value: "<1 hr" },
            { icon: CheckCircle2, label: "Satisfaction Rate", value: "98%" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-6 h-6 text-blue-500 mb-3" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
