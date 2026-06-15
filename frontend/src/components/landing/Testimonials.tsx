"use client";

import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/lib/utils";
import { LandingSectionHeader } from "@/components/shared/LandingSectionHeader";
import { LandingButton } from "@/components/shared/LandingButton";
import Image from "next/image";
import { LandingSection } from "@/components/landing/LandingSection";
import { useCMS } from "@/contexts/CMSContext";
import {
  landingTitleParts,
  LandingGradientTitle,
} from "@/lib/landing-section-header-copy";

interface TestimonialItem {
  id: number;
  client_name: string;
  client_role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop";

/** Single consistent card: full-bleed image + glass footer (all slides match) */
function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  const imageSrc = getMediaUrl(testimonial.image_url, "testimonial") || FALLBACK_AVATAR;

  return (
    <article className="relative h-[min(420px,52vh)] min-h-[360px] rounded-[2rem] overflow-hidden shadow-xl border border-border/40">
      <Image src={imageSrc} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

      <button
        type="button"
        className="absolute top-5 right-5 z-10 h-11 w-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center"
        aria-label="Save testimonial"
      >
        <Heart className="h-5 w-5 text-white" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
        <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-5 md:p-6 space-y-4">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, testimonial.rating || 5) }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {testimonial.client_name}
            </h3>
            {testimonial.client_role && (
              <p className="text-sm text-white/80 mt-1">{testimonial.client_role}</p>
            )}
          </div>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-3">{testimonial.content}</p>
          <LandingButton asChild size="md" className="w-full sm:w-auto">
            <Link href="/services">Book a professional</Link>
          </LandingButton>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const { getS } = useCMS();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const testimonialsTitle = getS("landing_sections", "testimonials_title", "Loved by customers");
  const { part1: testTitle1, part2: testTitle2 } = landingTitleParts(
    testimonialsTitle,
    "customers"
  );

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get("/api/testimonials");
        setTestimonials(response.data.data ?? response.data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <LandingSection variant="default" className="relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full">
        <LandingSectionHeader
          badge={getS("landing_sections", "testimonials_badge", "Testimonials")}
          title={<LandingGradientTitle part1={testTitle1} part2={testTitle2} />}
          subtitle={getS(
            "landing_sections",
            "testimonials_subtitle",
            "Don't just take our word for it. Here's what people are saying about their experience with KUBA professionals."
          )}
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-[420px] rounded-[2rem]" />
              <Skeleton className="h-[420px] rounded-[2rem] hidden md:block" />
              <Skeleton className="h-[420px] rounded-[2rem] hidden lg:block" />
            </div>
          ) : (
            <Carousel opts={{ align: "start", loop: testimonials.length > 1 }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-6">
                {testimonials.map((testimonial) => (
                  <CarouselItem
                    key={testimonial.id}
                    className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 px-4">
                  <CarouselPrevious
                    variant="outline"
                    className="!static !relative !top-auto !left-auto !right-auto !translate-x-0 !translate-y-0 h-11 w-11 rounded-full"
                  />
                  <CarouselNext
                    variant="outline"
                    className="!static !relative !top-auto !left-auto !right-auto !translate-x-0 !translate-y-0 h-11 w-11 rounded-full"
                  />
                </div>
              )}
            </Carousel>
          )}
        </motion.div>
      </div>
    </LandingSection>
  );
}
