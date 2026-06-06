"use client";

import Link from "next/link";
import { AppButton, PageContainer } from "@/components/shared/ui";

interface CTABannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  footerText?: string;
  /** Background color class, e.g. "bg-primary", "bg-indigo-600" */
  bgColor?: string;
}

export function CTABanner({
  title,
  subtitle,
  buttonText,
  buttonHref,
  footerText,
  bgColor = "bg-primary",
}: CTABannerProps) {
  return (
    <PageContainer as="section" section>
      <div className={`p-12 md:p-20 ${bgColor} rounded-[3rem] text-white overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-2xl space-y-8 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-white/70 font-medium">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
            <AppButton
              asChild
              tone="secondary"
              scale="lg"
              className="!bg-white !text-primary hover:!bg-white/90 h-14 border-0"
            >
              <Link href={buttonHref}>{buttonText}</Link>
            </AppButton>
            {footerText && (
              <span className="text-sm font-bold opacity-60 tracking-tight">
                {footerText}
              </span>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
