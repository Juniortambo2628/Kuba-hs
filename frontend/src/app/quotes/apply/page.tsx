"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Send, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Briefcase,
  Globe,
  ShieldCheck
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";
import { toast } from "sonner";

export default function QuoteRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: "",
    contact_person: "",
    email: "",
    phone: "",
    organization_type: "commercial",
    service_category: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/quotes", formData);
      setIsSuccess(true);
      toast.success("Quote request submitted!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 overflow-hidden relative bg-primary">
         <div className="absolute inset-0 bg-black/20" />
         <div className="container relative z-10 mx-auto px-6 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={designSystem.typography.hero.badge}
            >
              Enterprise & Groups
            </motion.span>
            <h1 className={designSystem.typography.hero.title}>Request a Custom Quote</h1>
            <p className={designSystem.typography.hero.subtitle + " text-white/70"}>
              Scalable, reliable, and professional solutions tailored to your organization's unique requirements.
            </p>
         </div>
      </section>

      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 h-full">
            {/* Sidebar Info */}
            <div className="md:col-span-2 bg-muted/30 p-12 space-y-8 border-r border-gray-100 dark:border-white/10">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight">Why Kuba Enterprise?</h3>
                  <div className="space-y-4">
                     {[
                       { icon: Globe, title: "Scalable Coverage", desc: "Serving multiple locations with one contract." },
                       { icon: ShieldCheck, title: "Verified Compliance", desc: "Rigorous vetting for your safety." },
                       { icon: Briefcase, title: "Account Management", desc: "Dedicated support for your team." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4">
                          <item.icon className="w-5 h-5 text-primary shrink-0" />
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="p-6 bg-primary/5 rounded-2xl space-y-3">
                  <p className="text-xs font-bold leading-tight uppercase tracking-tighter">Need Immediate Assistance?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Our corporate relations team is available for urgent consultations.</p>
                  <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-primary">Call +254 700 000 000</Button>
               </div>
            </div>

            {/* Form Area */}
            <div className="md:col-span-3 p-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold">Request Received</h2>
                       <p className="text-muted-foreground text-sm">Our enterprise team will review your requirements and reach out within 24 hours.</p>
                    </div>
                    <Button asChild className="rounded-2xl h-12 px-8 font-bold">
                       <Link href="/">Return to Home</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label className={designSystem.typography.auth.label}>Organization Name</Label>
                          <Input 
                            required
                            className={designSystem.typography.auth.input}
                            value={formData.organization_name}
                            onChange={e => setFormData({...formData, organization_name: e.target.value})}
                            placeholder="e.g. Acme Corp or Sunshine Coop"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className={designSystem.typography.auth.label}>Contact Person</Label>
                              <Input 
                                required
                                className={designSystem.typography.auth.input}
                                value={formData.contact_person}
                                onChange={e => setFormData({...formData, contact_person: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className={designSystem.typography.auth.label}>Entity Type</Label>
                              <select 
                                className={designSystem.typography.auth.input + " w-full flex"}
                                value={formData.organization_type}
                                onChange={e => setFormData({...formData, organization_type: e.target.value})}
                              >
                                <option value="commercial">Commercial Business</option>
                                <option value="cooperative">Cooperative / Group</option>
                                <option value="other">Other Organization</option>
                              </select>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className={designSystem.typography.auth.label}>Corporate Email</Label>
                              <Input 
                                type="email"
                                required
                                className={designSystem.typography.auth.input}
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className={designSystem.typography.auth.label}>Phone Number</Label>
                              <Input 
                                className={designSystem.typography.auth.input}
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                          <Label className={designSystem.typography.auth.label}>Service Categories Interested In</Label>
                          <Input 
                            required
                            className={designSystem.typography.auth.input}
                            value={formData.service_category}
                            onChange={e => setFormData({...formData, service_category: e.target.value})}
                            placeholder="e.g. Facility Management, Wellness, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className={designSystem.typography.auth.label}>Scope of Requirements</Label>
                          <Textarea 
                            required
                            className={designSystem.typography.auth.input + " min-h-[120px] pt-4"}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Please describe your needs, estimated volume, and any specific locations..."
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      disabled={isSubmitting}
                      className={designSystem.typography.auth.button + " group"}
                    >
                       {isSubmitting ? (
                         <Loader2 className="w-4 h-4 animate-spin mr-2" />
                       ) : (
                         <>
                           Submit Quote Request
                           <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </>
                       )}
                    </Button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
