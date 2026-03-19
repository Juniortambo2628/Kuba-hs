"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { 
  Mail, Phone, MapPin, Clock, 
  Send, MessageCircle, Globe, Shield, Loader2, CheckCircle2 
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useCMS } from "@/hooks/useCMS";

export default function ContactPage() {
  const { getS } = useCMS();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
      const res = await axiosInstance.post("/api/contact", formData);
      toast.success(res.data.message || "Message sent successfully!");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: getS('contact', 'contact_phone', '+254 700 000 000'),
      sub: getS('contact', 'contact_phone_hours', 'Mon-Fri from 8am to 6pm'),
      color: "blue"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: getS('contact', 'contact_email', 'info@kuba.co.ke'),
      sub: "Online support 24/7",
      color: "purple"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: getS('contact', 'contact_address', 'Nairobi, Kenya'),
      sub: getS('contact', 'contact_address_sub', 'Business District'),
      color: "cyan"
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />

      <PageHero
        title="Get in Touch"
        subtitle="Have questions? We're here to help you find the best services for your home."
        breadcrumbs={[{ label: "Contact" }]}
        bgImage="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
        gradientFrom="from-purple-600"
        gradientTo="to-blue-600"
      />

      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Send us a Message</h2>
                <p className="text-muted-foreground dark:text-gray-400">Fill out the form below and our team will get back to you within 24 hours.</p>
              </div>

              {isSubmitted ? (
                <Card className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 rounded-3xl overflow-hidden shadow-xl">
                  <CardContent className="p-12 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Message Sent!</h3>
                    <p className="text-emerald-600 dark:text-emerald-300">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4 border-emerald-300 text-emerald-700 rounded-xl">
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted dark:bg-white/5 border-border dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
                  <CardContent className="p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                          <Input 
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                          <Input 
                            type="email" 
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                        <Input 
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                        <Textarea 
                          placeholder="Tell us more about your inquiry..." 
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-2xl min-h-[150px] focus-visible:ring-blue-500 pt-4"
                        />
                      </div>

                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Contact Info Side */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Contact Information</h2>
                <div className="grid gap-6">
                  {contactInfo.map((item, i) => (
                    <Card key={i} className="bg-transparent border-none shadow-none group">
                      <CardContent className="p-0 flex items-start gap-5">
                        <div className={`w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform`}>
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
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
                
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" /> Trust & Support
                </h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Our dedicated support team is here to ensure you have the best experience on Kuba. We verify every professional on our platform.
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
        </div>
      </section>

      <Footer />
    </main>
  );
}

