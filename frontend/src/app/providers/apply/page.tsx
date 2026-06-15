"use client";

import { useState } from "react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { ApplyFormLayout } from "@/components/shared/ApplyFormLayout";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, CheckCircle2, Briefcase, Star, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";
import { toast } from "sonner";

export default function ProviderApplyPage() {
  const hero = useMarketingHero("providerApply");
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
  const [acceptPolicies, setAcceptPolicies] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptPolicies) {
      toast.error("You must accept the provider policies before applying.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/auth/register-provider", formData);
      setIsSuccess(true);
      toast.success("Application submitted!");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Application failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebar = (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className={designSystem.typography.section.title}>Why Partner with Us?</h2>
        <p className={designSystem.typography.section.subtitle}>
          We provide the platform, you provide the talent. Together, we build trust.
        </p>
      </div>
      <div className="grid gap-8">
        {[
          { icon: Star, title: "Premium Branding", desc: "Showcase your work on a platform that values quality over quantity." },
          { icon: Users, title: "Steady Lead Flow", desc: "Access a consistent stream of customers in your local area." },
          { icon: ShieldCheck, title: "Secure Payments", desc: "Guaranteed payments for completed jobs via our secure escrow." },
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
  );

  const successView = (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Application Sent!</h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ve received your credentials. Our vetting team will review your application and email you with the next steps.
        </p>
      </div>
      <Button asChild className="rounded-2xl h-12 px-8 font-bold">
        <Link href="/">Back to Kuba</Link>
      </Button>
    </div>
  );

  return (
    <MarketingPage hero={hero} shellClassName="min-h-screen flex flex-col">
      <MarketingSection className="py-24 max-w-6xl mx-auto">
        <ApplyFormLayout
          sidebar={sidebar}
          isSuccess={isSuccess}
          successView={successView}
          variant="two-column"
        >
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
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={designSystem.typography.auth.label}>Primary Category</Label>
                      <Input
                        required
                        className={designSystem.typography.auth.input}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={designSystem.typography.auth.label}>Confirm Password</Label>
                      <Input
                        type="password"
                        required
                        className={designSystem.typography.auth.input}
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your skills..."
                />
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="accept-policies-apply"
                checked={acceptPolicies}
                onCheckedChange={(checked) => setAcceptPolicies(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="accept-policies-apply"
                className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none"
              >
                I have read and agree to the{" "}
                <a
                  href="/policies/Kuba_Comprehensive_Service_Provider_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Comprehensive Service Provider Policy
                </a>
                ,{" "}
                <a
                  href="/policies/Kuba_Risk_Management_and_Professional_Conduct_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Risk Management &amp; Professional Conduct Policy
                </a>
                ,{" "}
                <a
                  href="/policies/Kuba_Service_Provider_Code_of_Conduct_and_Accountability_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Code of Conduct &amp; Accountability Policy
                </a>
                , and the{" "}
                <Link href="/legal/provider-agreement" className="font-semibold text-primary hover:underline">
                  Provider Agreement
                </Link>
                .
              </label>
            </div>
            <Button
              disabled={isSubmitting || !acceptPolicies}
              className={designSystem.typography.auth.button + " group overflow-hidden"}
            >
              <span className="relative z-10 font-black">{isSubmitting ? "Submitting..." : "Apply to Join Kuba"}</span>
              {!isSubmitting && (
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              )}
            </Button>
          </form>
        </ApplyFormLayout>
      </MarketingSection>
    </MarketingPage>
  );
}
