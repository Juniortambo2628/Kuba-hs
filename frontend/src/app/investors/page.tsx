"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2,
  Loader2,
  Rocket
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useCMS } from "@/hooks/useCMS";
import { usePageFeatures } from "@/hooks/usePageFeatures";
import { resolveIcon } from "@/lib/icon-map";
import { HighImpactHero } from "@/components/shared/HighImpactHero";

export default function InvestorsPage() {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
  const { features: metrics } = usePageFeatures('investors');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    investment_range: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axiosInstance.post("/api/investors/inquire", formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgImage = getImg('hero_media', 'investors_hero_image', '');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={getS('hero_media', 'investors_hero_title', 'Scaling the Future of Home Services.')}
        subtitle={getS('hero_media', 'investors_hero_subtitle', 'Join us in transforming how millions of homeowners connect with verified professionals.')}
        badge={getS('hero_media', 'investors_hero_badge', "Investor Relations")}
        cmsKey="investors_hero_image"
        cmsGroup="hero_media"
      />

      {/* Stats/Metrics */}
      <section className="py-20 bg-muted/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((stat, idx) => {
              const IconComp = resolveIcon(stat.icon, TrendingUp);
              return (
                <motion.div 
                  key={stat.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 border border-border dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm"
                >
                  <IconComp className="w-6 h-6 mx-auto mb-4 text-indigo-600 dark:text-indigo-500" />
                  <div className="text-3xl font-bold mb-1">{stat.title}</div>
                  <div className="text-[10px] text-muted-foreground dark:text-muted-foreground tracking-widest font-semibold">{stat.subtitle || stat.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">{getS('market_narratives', 'investors_thesis_title', 'Our Investment Thesis')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed mb-6 font-medium">
                {getS('market_narratives', 'investors_thesis_body', 'The home service industry remains one of the last analog frontiers.')}
              </p>
              
              <ul className="space-y-4">
                {getS('sections', 'investors_thesis_points', "Verified professional network using proprietary trust scoring\nAutomated dispatching and dynamic pricing engines\nUnified financial layer for payments and escrow\nHyper-local expansion model with high operational efficiency")
                  .split('\n')
                  .filter(line => line.trim())
                  .map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 rounded-3xl dark:from-indigo-600/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Rocket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                {getS('sections', 'investors_series_b_title', 'Series B in Progress')}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6 font-medium">
                {getS('sections', 'investors_series_b_body', 'We are currently entertaining interest for our Series B funding round. Focusing on market expansion and AI-driven service matching.')}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider">
                {getS('sections', 'investors_series_b_footer', 'Quarterly Report 2024 Available')} <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="bg-white dark:bg-[#111] p-10 rounded-[2.5rem] border border-border dark:border-white/5 shadow-2xl relative overflow-hidden transition-all duration-300">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Inquiry Received</h3>
                <p className="text-muted-foreground dark:text-muted-foreground text-sm font-medium">
                  Thank you for your interest. Our Investor Relations team will reach out via the provided email within 48 hours.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-8 border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5 rounded-xl font-semibold text-[10px] tracking-widest px-8 h-12"
                >
                  SEND ANOTHER INQUIRY
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-10 text-center lg:text-left">
                  <h3 className="text-2xl font-semibold text-foreground dark:text-white tracking-tight mb-2">Connect with Us</h3>
                  <p className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground tracking-[0.2em]">Please provide your details below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-muted-foreground tracking-widest ml-1">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        required
                        className="bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 h-14 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 text-sm font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-semibold text-muted-foreground tracking-widest ml-1">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@firm.com" 
                        required
                        className="bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 h-14 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 text-sm font-bold"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-muted-foreground tracking-widest ml-1">Firm / Company</label>
                      <Input 
                        placeholder="Venture Capital Ltd" 
                        className="bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 h-14 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 text-sm font-bold"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-semibold text-muted-foreground tracking-widest ml-1">Investment Range</label>
                      <select 
                        className="flex h-14 w-full rounded-2xl border border-border dark:border-white/10 bg-muted/50 dark:bg-white/5 px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none appearance-none transition-all dark:text-white"
                        value={formData.investment_range}
                        required
                        onChange={(e) => setFormData({...formData, investment_range: e.target.value})}
                      >
                        <option value="" disabled className="bg-white dark:bg-black">Select Range</option>
                        <option value="KES 100M - KES 500M" className="bg-white dark:bg-black">KES 100M - KES 500M</option>
                        <option value="KES 500M - KES 2B" className="bg-white dark:bg-black">KES 500M - KES 2B</option>
                        <option value="KES 2B - KES 5B" className="bg-white dark:bg-black">KES 2B - KES 5B</option>
                        <option value="KES 5B+" className="bg-white dark:bg-black">KES 5B+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-semibold text-muted-foreground tracking-widest ml-1">Message / Interests</label>
                    <Textarea 
                      placeholder="Tell us about your area of interest..." 
                      className="bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 min-h-[140px] rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 text-sm font-bold p-6"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-semibold tracking-widest rounded-xl text-center">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary dark:bg-indigo-600 hover:bg-primary dark:hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-gray-100 dark:shadow-indigo-900/10 transition-all tracking-widest text-[11px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "SUBMIT INVESTMENT INQUIRY"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
