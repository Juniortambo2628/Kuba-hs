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

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Homeowner',
      content: '"I found an amazing electrician through KUBA within minutes. The service was professional, and the price was transparent. Highly recommended for anyone looking for reliable help!"',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Manager',
      content: '"Managing multiple properties is tough, but KUBA makes finding verified professionals incredibly easy. The background checks give me peace of mind every time I book."',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Homeowner',
      content: '"The booking process is seamless. I love being able to see upfront pricing and read real reviews before making a decision. KUBA is my go-to for all home repairs."',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 4,
      name: 'David Rodriguez',
      role: 'Small Business Owner',
      content: '"As a landlord with several rentals, I rely on KUBA to quickly find plumbers and electricians. The quality of service has been consistently excellent."',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Loved by our customers
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what people are saying about their experience with KUBA professionals.
          </p>
        </motion.div>

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
                  <Card className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm relative group hover:border-blue-500/20 dark:hover:border-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-8 pt-10 flex flex-col h-full">
                      <Quote className="absolute top-6 right-8 w-12 h-12 text-gray-200 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-300" />
                      
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic relative z-10 flex-1">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/10 shrink-0">
                          <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-bold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
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
