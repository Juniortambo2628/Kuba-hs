"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { ContactForm } from "@/components/shared/ContactForm";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { useCMS } from "@/contexts/CMSContext";

export default function ContactPage() {
  const { getS } = useCMS();
  const hero = useMarketingHero("contact");

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: getS("contact", "contact_phone", "+254 700 000 000"),
      sub: getS("contact", "contact_phone_hours", "Mon-Fri from 8am to 6pm"),
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: getS("contact", "contact_email", "info@kuba.co.ke"),
      sub: "Online support 24/7",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: getS("contact", "contact_address", "Nairobi, Kenya"),
      sub: getS("contact", "contact_address_sub", "Business District"),
    },
  ];

  return (
    <MarketingPage hero={hero} shellClassName="min-h-screen flex flex-col">
      <MarketingSection className="py-20 flex-1">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                Contact Information
              </h2>
              <div className="grid gap-6">
                {contactInfo.map((item) => (
                  <Card key={item.title} className="bg-transparent border-none shadow-none group">
                    <CardContent className="p-0 flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">{item.details}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">{item.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" /> Trust & Support
              </h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our dedicated support team is here to ensure you have the best experience on Kuba. We verify every
                professional on our platform.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">99.9%</span>
                  <span className="text-xs text-blue-200">Uptime</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">24/7</span>
                  <span className="text-xs text-blue-200">Response</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </MarketingSection>
    </MarketingPage>
  );
}
