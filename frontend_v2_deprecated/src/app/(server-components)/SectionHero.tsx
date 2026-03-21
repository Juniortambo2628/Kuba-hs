import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-semibold text-4xl md:text-5xl xl:text-7xl !leading-[110%] tracking-tight text-neutral-900 dark:text-neutral-100">
            Everything You Need. <br />
            <span className="text-primary-6000">One Platform.</span>
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
            Find and book trusted local professionals in Nairobi. 
            From home maintenance to personal wellness and professional support.
          </span>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <ButtonPrimary href="/listing-service" sizeClass="px-8 py-4 sm:px-10 !rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all">
              Book a Service
            </ButtonPrimary>
            <ButtonPrimary 
              href="/signup" 
              fontSize="text-base sm:text-lg"
              className="px-8 py-4 sm:px-10 !rounded-2xl font-semibold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg transition-all"
            >
              Become a Service Provider
            </ButtonPrimary>
          </div>
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={imagePng || "/placeholder-light.png"} alt="hero" priority />
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-40 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;
