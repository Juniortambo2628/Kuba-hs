"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CalendarCheck, CheckCircle2, Check, ArrowRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCMS } from "@/hooks/useCMS";

export function About() {
  const { getS, getImg } = useCMS();
  const [activeStep, setActiveStep] = useState("search");
  const steps = [
    {
      id: "search",
      number: "1",
      title: getS('about_page', 'step_1_title', 'Tell us what you need'),
      icon: Search,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      description: getS('about_page', 'step_1_desc', 'Tell us what you need so we can find the right pro for you.')
    },
    {
      id: "time",
      number: "2",
      title: getS('about_page', 'step_2_title', 'Choose a time'),
      icon: CalendarCheck,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      description: getS('about_page', 'step_2_desc', 'Pick a day and time that works for you.')
    },
    {
      id: "done",
      number: "3",
      title: getS('about_page', 'step_3_title', 'We handle the rest'),
      icon: Check,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      description: getS('about_page', 'step_3_desc', 'Our trusted pros will show up on time and do a great job.')
    }
  ];

  return (
    <section className="py-24 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Sticky Image Container */}
          <div className="hidden lg:block sticky top-32 h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-white/5 border-4 border-white dark:border-white/10 relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep}
                src={
                  activeStep === "search" ? getImg('about_page', 'step_1_image', 'https://images.unsplash.com/photo-1590400813936-cefaef6c8ac5?q=80&w=800&auto=format&fit=crop') :
                  activeStep === "time" ? getImg('about_page', 'step_2_image', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop') :
                  getImg('about_page', 'step_3_image', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop')
                }
                alt="How it works"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-10 left-10 right-10 flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center shadow-inner">
                {activeStep === "search" ? <Search className="w-7 h-7" /> : activeStep === "time" ? <CalendarCheck className="w-7 h-7" /> : <Check className="w-7 h-7" />}
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight">
                  {steps.find(s => s.id === activeStep)?.title}
                </h4>
                <p className="text-sm text-gray-200 mt-1">Experience seamless service delivery.</p>
              </div>
            </div>
          </div>

          {/* Right: Content & Accordion */}
          <div className="flex flex-col justify-center h-full pt-10 lg:pt-20">
            <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-sm tracking-tight">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                {getS('about_page', 'about_badge', 'Simple Process')}
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                {getS('about_page', 'about_title_1', 'How we')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">{getS('about_page', 'about_title_2', 'operate')}</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {getS('about_page', 'about_desc', 'Getting the services you need has never been easier. Just three simple steps to connect with trusted professionals in your area.')}
              </p>
            </div>

            <Accordion 
              type="single" 
              collapsible 
              value={activeStep} 
              onValueChange={(val) => val && setActiveStep(val)}
              className="w-full space-y-6"
            >
              {steps.map((step, idx) => (
                <AccordionItem 
                  key={step.id} 
                  value={step.id} 
                  className="group border-none bg-gray-50 dark:bg-white/5 rounded-[2rem] px-8 py-4 data-[state=open]:bg-white dark:data-[state=open]:bg-card data-[state=open]:shadow-xl data-[state=open]:ring-2 data-[state=open]:ring-sky-500/20 transition-all duration-300"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-6 text-left">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-colors duration-300 ${activeStep === step.id ? 'bg-sky-500 text-white' : 'bg-background text-gray-400 group-hover:text-sky-500'}`}>
                        <span className="text-2xl font-black">{step.number}</span>
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${activeStep === step.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                        {step.title}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6 pl-[5.5rem] text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {step.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 flex pt-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl group">
                Find exactly what you need
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
