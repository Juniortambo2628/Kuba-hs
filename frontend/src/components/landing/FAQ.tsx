"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCMS } from "@/hooks/useCMS";
import { useEffect, useState } from "react";

export function FAQ() {
  const { getS } = useCMS();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    {
      question: getS('faq', 'faq_1_q', "How do I book a service on KUBA?"),
      answer: getS('faq', 'faq_1_a', "Simply search for the service you need, browse verified professionals, select a time slot that works for you, and confirm your booking. You'll receive an instant confirmation email with all the details.")
    },
    {
      question: getS('faq', 'faq_2_q', "Are all service providers verified?"),
      answer: getS('faq', 'faq_2_a', "Yes! Every professional on our platform goes through a thorough verification process including identity checks, background screening, and skills assessment. We also monitor ongoing reviews to maintain quality standards.")
    },
    {
      question: getS('faq', 'faq_3_q', "What if I'm not satisfied with the service?"),
      answer: getS('faq', 'faq_3_a', "We offer a 100% satisfaction guarantee. If you're not happy with the work, contact our support team within 48 hours and we'll arrange a free re-service or issue a full refund.")
    },
    {
      question: getS('faq', 'faq_4_q', "How does payment work?"),
      answer: getS('faq', 'faq_4_a', "Payments are processed securely through Stripe. You only pay after the service is completed to your satisfaction. We support all major credit cards, debit cards, and digital wallets.")
    },
    {
      question: getS('faq', 'faq_5_q', "Can I become a service provider on KUBA?"),
      answer: getS('faq', 'faq_5_a', "Absolutely! If you're a skilled professional, you can apply to join our platform. Create an account, complete the verification process, set your services and pricing, and start receiving bookings from customers in your area.")
    },
    {
      question: getS('faq', 'faq_6_q', "What areas does KUBA cover?"),
      answer: getS('faq', 'faq_6_a', "We currently operate in over 10 cities and expanding rapidly. Enter your location in the search bar to check if services are available in your area. New locations are added every month.")
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-300 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {!mounted ? (
          <div className="space-y-4">
            <div className="h-64 w-full bg-gray-200 dark:bg-white/5 animate-pulse rounded-xl" />
          </div>
        ) : (
          <>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6 tracking-wider">
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about KUBA. Can't find an answer? Contact our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden px-6 data-[state=open]:border-blue-500/30"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-white font-semibold hover:no-underline hover:text-blue-600 dark:hover:text-blue-400 py-5 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
