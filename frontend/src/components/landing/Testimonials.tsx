"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

interface TestimonialItem {
  id: number;
  client_name: string;
  client_role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
}


export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get('/api/testimonials');
        setTestimonials(response.data.data ?? response.data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LandingSectionHeader 
          title="Loved by our customers"
          subtitle="Don't just take our word for it. Here's what people are saying about their experience with KUBA professionals."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <Card className="bg-card border border-gray-200 dark:border-white/10 shadow-xl relative group hover:border-primary/40 dark:hover:border-primary/30 transition-all duration-500 h-full rounded-[2.5rem] overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="p-10 pt-12 flex flex-col h-full bg-gradient-to-br from-gray-50/50 to-white dark:from-white/[0.02] dark:to-transparent">
                      <Quote className="absolute top-8 right-10 w-16 h-16 text-gray-100 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-500 -rotate-12 group-hover:rotate-0" />
                      
                      <div className="flex gap-1.5 mb-8">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-10 leading-relaxed font-medium relative z-10 flex-1">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex items-center gap-5 mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <img 
                              src={getMediaUrl(testimonial.image_url, 'testimonial')} 
                              alt={testimonial.client_name} 
                              className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-black tracking-tight text-lg">{testimonial.client_name}</h4>
                          {testimonial.client_role && <p className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-tight mt-1">{testimonial.client_role}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800" />
            <CarouselNext className="hidden md:flex -right-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
