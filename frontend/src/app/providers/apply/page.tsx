"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Loader2,
  Briefcase,
  Star,
  Users,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";
import { toast } from "sonner";

export default function ProviderApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    experience_years: "",
    bio: "",
    email: "",
    password: "",
    password_confirmation: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // This will handle both User creation and Provider record creation as 'pending'
      await axiosInstance.post("/api/auth/register-provider", formData);
      setIsSuccess(true);
      toast.success("Application submitted!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Application failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 relative overflow-hidden bg-[#0F172A] text-white">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
         <div className="container relative z-10 mx-auto px-6 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={designSystem.typography.hero.badge + " !bg-blue-600/20 !text-blue-400"}
            >
              Join the Network
            </motion.span>
            <h1 className={designSystem.typography.hero.title}>Grow Your Business with Kuba</h1>
            <p className={designSystem.typography.hero.subtitle + " text-white/60"}>
              Connect with thousands of customers looking for your expertise. Apply today to become a verified professional.
            </p>
         </div>
      </section>

      <section className="py-24 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column: Benefits */}
            <div className="space-y-12">
               <div className="space-y-4">
                  <h2 className={designSystem.typography.section.title}>Why Partner with Us?</h2>
                  <p className={designSystem.typography.section.subtitle}>We provide the platform, you provide the talent. Together, we build trust.</p>
               </div>

               <div className="grid gap-8">
                  {[
                    { icon: Star, title: "Premium Branding", desc: "Showcase your work on a platform that values quality over quantity." },
                    { icon: Users, title: "Steady Lead Flow", desc: "Access a consistent stream of customers in your local area." },
                    { icon: ShieldCheck, title: "Secure Payments", desc: "Guaranteed payments for completed jobs via our secure escrow." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-6 p-6 rounded-3xl bg-muted/30 border border-gray-100 dark:border-white/5">
                       <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                          <benefit.icon className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 p-12 shadow-2xl relative overflow-hidden">
               <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                       <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                         <CheckCircle2 className="w-10 h-10 text-green-500" />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-2xl font-bold">Application Sent!</h2>
                          <p className="text-muted-foreground text-sm">We've received your credentials. Our vetting team will review your application and email you with the next steps.</p>
                       </div>
                       <Button asChild className="rounded-2xl h-12 px-8 font-bold">
                          <Link href="/">Back to Kuba</Link>
                       </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="space-y-6">
                          <div className="space-y-4">
                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Business Information</h3>
                             <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                   <Label className={designSystem.typography.auth.label}>Business or Professional Name</Label>
                                   <Input 
                                     required
                                     className={designSystem.typography.auth.input}
                                     value={formData.business_name}
                                     onChange={e => setFormData({...formData, business_name: e.target.value})}
                                     placeholder="e.g. John Doe Plumbing"
                                   />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label className={designSystem.typography.auth.label}>Years of Experience</Label>
                                      <Input 
                                        type="number"
                                        required
                                        className={designSystem.typography.auth.input}
                                        value={formData.experience_years}
                                        onChange={e => setFormData({...formData, experience_years: e.target.value})}
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <Label className={designSystem.typography.auth.label}>Primary Category</Label>
                                      <Input 
                                        required
                                        className={designSystem.typography.auth.input}
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        placeholder="e.g. Cleaning"
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Account Credentials</h3>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <Label className={designSystem.typography.auth.label}>Email Address</Label>
                                   <Input 
                                     type="email"
                                     required
                                     className={designSystem.typography.auth.input}
                                     value={formData.email}
                                     onChange={e => setFormData({...formData, email: e.target.value})}
                                   />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label className={designSystem.typography.auth.label}>Password</Label>
                                      <Input 
                                        type="password"
                                        required
                                        className={designSystem.typography.auth.input}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <Label className={designSystem.typography.auth.label}>Confirm Password</Label>
                                      <Input 
                                        type="password"
                                        required
                                        className={designSystem.typography.auth.input}
                                        value={formData.password_confirmation}
                                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-2 pt-4">
                             <Label className={designSystem.typography.auth.label}>Brief Bio / Portfolio Link</Label>
                             <Textarea 
                               required
                               className={designSystem.typography.auth.input + " min-h-[100px] pt-4"}
                               value={formData.bio}
                               onChange={e => setFormData({...formData, bio: e.target.value})}
                               placeholder="Tell us about your skills..."
                             />
                          </div>
                       </div>

                       <Button 
                         disabled={isSubmitting}
                         className={designSystem.typography.auth.button + " group overflow-hidden"}
                       >
                          <span className="relative z-10 font-black">
                             {isSubmitting ? "Submitting..." : "Apply to Join Kuba"}
                          </span>
                          {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />}
                       </Button>

                       <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest pt-4">
                          By applying, you agree to our <Link href="/legal/provider-agreement" className="text-primary hover:underline">Provider Terms</Link>
                       </p>
                    </form>
                  )}
               </AnimatePresence>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
