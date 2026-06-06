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
import Link from "next/link";
import { Send, CheckCircle2, Loader2, Briefcase, Globe, ShieldCheck } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { designSystem } from "@/lib/design-system";
import { toast } from "sonner";

export default function QuoteRequestPage() {
  const hero = useMarketingHero("quotesApply");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: "",
    contact_person: "",
    email: "",
    phone: "",
    organization_type: "commercial",
    service_category: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/quotes", formData);
      setIsSuccess(true);
      toast.success("Quote request submitted!");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebar = (
    <>
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Why Kuba Enterprise?</h3>
        <div className="space-y-4">
          {[
            { icon: Globe, title: "Scalable Coverage", desc: "Serving multiple locations with one contract." },
            { icon: ShieldCheck, title: "Verified Compliance", desc: "Rigorous vetting for your safety." },
            { icon: Briefcase, title: "Account Management", desc: "Dedicated support for your team." },
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
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Our corporate relations team is available for urgent consultations.
        </p>
        <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-primary">
          Call +254 700 000 000
        </Button>
      </div>
    </>
  );

  const successView = (
    <>
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Request Received</h2>
        <p className="text-muted-foreground text-sm">
          Our enterprise team will review your requirements and reach out within 24 hours.
        </p>
      </div>
      <Button asChild className="rounded-2xl h-12 px-8 font-bold">
        <Link href="/">Return to Home</Link>
      </Button>
    </>
  );

  return (
    <MarketingPage hero={hero} shellClassName="min-h-screen flex flex-col">
      <MarketingSection className="py-24 max-w-4xl mx-auto">
        <ApplyFormLayout
          sidebar={sidebar}
          isSuccess={isSuccess}
          successView={successView}
          variant="split-card"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className={designSystem.typography.auth.label}>Organization Name</Label>
                  <Input
                    required
                    className={designSystem.typography.auth.input}
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={designSystem.typography.auth.label}>Entity Type</Label>
                    <select
                      className={designSystem.typography.auth.input + " w-full flex"}
                      value={formData.organization_type}
                      onChange={(e) => setFormData({ ...formData, organization_type: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={designSystem.typography.auth.label}>Phone Number</Label>
                    <Input
                      className={designSystem.typography.auth.input}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className={designSystem.typography.auth.label}>Service Categories Interested In</Label>
                  <Input
                    required
                    className={designSystem.typography.auth.input}
                    value={formData.service_category}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    placeholder="e.g. Facility Management, Wellness, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label className={designSystem.typography.auth.label}>Scope of Requirements</Label>
                  <Textarea
                    required
                    className={designSystem.typography.auth.input + " min-h-[120px] pt-4"}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please describe your needs, estimated volume, and any specific locations..."
                  />
                </div>
              </div>
            </div>
            <Button disabled={isSubmitting} className={designSystem.typography.auth.button + " group"}>
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
        </ApplyFormLayout>
      </MarketingSection>
    </MarketingPage>
  );
}
