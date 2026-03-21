"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get('/api/faqs');
        setFaqs(response.data.data ?? response.data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section className="py-32 bg-muted relative overflow-hidden transition-colors duration-300">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-[600px] w-full bg-white dark:bg-white/5 animate-pulse rounded-[2.5rem]" />
          </div>
        ) : (
          <>
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm tracking-tight mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Got Questions?
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
              </h2>
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about KUBA. Can't find an answer? Feel free to contact our support team anytime.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-6">
                    {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
                      <AccordionItem
                        key={`col1-${faq.id}`}
                        value={`item-col1-${faq.id}`}
                        className="group bg-card border border-gray-200 dark:border-white/5 rounded-[2rem] overflow-hidden px-8 shadow-sm hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 data-[state=open]:shadow-2xl data-[state=open]:border-primary/50 dark:data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 dark:data-[state=open]:bg-primary/10"
                      >
                        <AccordionTrigger className="text-left text-gray-900 dark:text-white font-bold hover:no-underline py-8 text-xl tracking-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 [&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed pb-8 font-medium">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
                {isLoading ? (
                   <div className="space-y-6">
                     {Array.from({ length: 3 }).map((_, i) => (
                       <Skeleton key={`skel-${i}`} className="h-20 w-full rounded-2xl" />
                     ))}
                   </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-6">
                    {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => (
                      <AccordionItem
                        key={`col2-${faq.id}`}
                        value={`item-col2-${faq.id}`}
                        className="group bg-card border border-gray-200 dark:border-white/5 rounded-[2rem] overflow-hidden px-8 shadow-sm hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 data-[state=open]:shadow-2xl data-[state=open]:border-primary/50 dark:data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 dark:data-[state=open]:bg-primary/10"
                      >
                        <AccordionTrigger className="text-left text-gray-900 dark:text-white font-bold hover:no-underline py-8 text-xl tracking-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 [&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed pb-8 font-medium">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
