import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";

export interface SectionCorporateProps {
  className?: string;
  rightImg?: string;
}

const SectionCorporate: FC<SectionCorporateProps> = ({
  className = "",
  rightImg,
}) => {
  const src = (rightImg && typeof rightImg === "string" && rightImg.trim() !== "") ? rightImg : "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg";
  return (
    <div
      className={`nc-SectionCorporate relative flex flex-col lg:flex-row-reverse items-center ${className}`}
    >
      <div className="flex-shrink-0 mb-16 lg:mb-0 lg:ml-10 lg:w-2/5">
        <h2 className="font-semibold text-3xl sm:text-4xl">
          Kuba Corporate Solutions
        </h2>
        <span className="block mt-6 text-neutral-500 dark:text-neutral-400">
          Streamline your company's maintenance and wellness needs. 
          Verified professionals for facility management, employee grooming, 
          and IT support. Trusted oversight for your business operations in Nairobi.
        </span>
        <ButtonPrimary href="/contact" className="mt-6 sm:mt-11">
          Partner with Kuba
        </ButtonPrimary>
      </div>
      <div className="flex-grow">
        <Image 
          alt="Corporate Solutions" 
          src={src} 
          width={800} 
          height={600} 
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default SectionCorporate;
