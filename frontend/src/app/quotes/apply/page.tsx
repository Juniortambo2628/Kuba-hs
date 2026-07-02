"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MarketingSection } from "@/components/shared/MarketingSection";
import { ApplyFormLayout } from "@/components/shared/ApplyFormLayout";
import { useMarketingHero } from "@/hooks/useMarketingHero";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Briefcase, Globe, ShieldCheck } from "lucide-react";
import { QuoteRequestForm } from "@/components/marketing/QuoteRequestForm";

export default function QuoteRequestPage() {
  const hero = useMarketingHero("quotesApply");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
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
          <QuoteRequestForm
            source="corporate"
            onSuccess={handleSuccess}
            submitLabel="Submit Quote Request"
            compact={false}
          />
        </ApplyFormLayout>
      </MarketingSection>
    </MarketingPage>
  );
}
