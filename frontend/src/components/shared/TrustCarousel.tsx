"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { LandingSection } from "@/components/landing/LandingSection";
import { getMediaUrl } from "@/lib/utils";

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
    <LandingSection variant="muted" className="border-y border-border/40">
      <p className="text-center text-sm font-semibold text-muted-foreground mb-8">
        Trusted by industry leaders
      </p>

      <div className="relative flex overflow-hidden w-full">
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
                  src={getMediaUrl(partner.logo_path, "service")}
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
    </LandingSection>
  );
}
