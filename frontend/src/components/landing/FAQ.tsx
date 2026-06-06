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
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export function FAQ() {
  const { getS } = useCMS();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const faqTitle = getS("landing_sections", "faq_title", "Frequently Asked Questions");
  const { part1: faqTitle1, part2: faqTitle2 } = landingTitleParts(faqTitle, "Questions");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get("/api/faqs");
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
    <LandingSection variant="muted" className="relative transition-colors duration-300">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <LandingSectionHeader
          badge={getS("landing_sections", "faq_badge", "Got Questions?")}
          title={<LandingGradientTitle part1={faqTitle1} part2={faqTitle2} />}
          subtitle={getS(
            "landing_sections",
            "faq_subtitle",
            "Everything you need to know about KUBA. Can't find an answer? Contact our support team anytime."
          )}
          align="center"
        />

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <Accordion type="single" collapsible className="w-full space-y-6">
                {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq) => (
                  <AccordionItem
                    key={`col1-${faq.id}`}
                    value={`item-col1-${faq.id}`}
                    className="group bg-card border border-border/60 rounded-[2rem] overflow-hidden px-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 data-[state=open]:shadow-2xl data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5"
                  >
                    <AccordionTrigger className="text-left text-foreground font-bold hover:no-underline py-8 text-xl tracking-tight transition-colors group-hover:text-primary [&[data-state=open]]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-8 font-medium">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Accordion type="single" collapsible className="w-full space-y-6">
                {faqs.slice(Math.ceil(faqs.length / 2)).map((faq) => (
                  <AccordionItem
                    key={`col2-${faq.id}`}
                    value={`item-col2-${faq.id}`}
                    className="group bg-card border border-border/60 rounded-[2rem] overflow-hidden px-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 data-[state=open]:shadow-2xl data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5"
                  >
                    <AccordionTrigger className="text-left text-foreground font-bold hover:no-underline py-8 text-xl tracking-tight transition-colors group-hover:text-primary [&[data-state=open]]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-8 font-medium">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        )}
      </div>
    </LandingSection>
  );
}
