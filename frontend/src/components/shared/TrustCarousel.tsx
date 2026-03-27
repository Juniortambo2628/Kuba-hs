"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo_path: string;
}

export function TrustCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axiosInstance.get("/api/trust-partners");
        setPartners(response.data);
      } catch (error) {
        console.error("Failed to fetch trust partners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (!isLoading && partners.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-zinc-900/30 border-y border-gray-100 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <p className="text-center text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider">
          Trusted by Industry Leaders
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        {/* First reel */}
        <motion.div 
          className="flex whitespace-nowrap gap-12 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-32 h-12 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse" />
            ))
          ) : (
            [...partners, ...partners, ...partners].map((partner, i) => (
              <div key={i} className="grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 px-4">
                <Image 
                  src={partner.logo_path} 
                  alt={partner.name} 
                  width={120}
                  height={40}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
