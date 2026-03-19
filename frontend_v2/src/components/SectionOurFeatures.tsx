import React, { FC } from "react";
import rightImgPng from "@/images/our-features.png";
import Image, { StaticImageData } from "next/image";
import Badge from "@/shared/Badge";

export interface SectionOurFeaturesProps {
  className?: string;
  rightImg?: StaticImageData;
  type?: "type1" | "type2";
}

const SectionOurFeatures: FC<SectionOurFeaturesProps> = ({
  className = "lg:py-14",
  rightImg = rightImgPng,
  type = "type1",
}) => {
  return (
    <div
      className={`nc-SectionOurFeatures relative flex flex-col items-center ${
        type === "type1" ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      data-nc-id="SectionOurFeatures"
    >
      <div className="flex-grow">
        <Image src={rightImg || "/placeholder-light.png"} alt="" />
      </div>
      <div
        className={`max-w-2xl flex-shrink-0 mt-10 lg:mt-0 lg:w-2/5 ${
          type === "type1" ? "lg:pl-16" : "lg:pr-16"
        }`}
      >
        <span className="uppercase text-sm text-gray-400 tracking-widest">
          Why Kuba?
        </span>
        <h2 className="font-semibold text-4xl mt-5">Trusted by thousands in Nairobi</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-16">
          <li className="space-y-4">
            <Badge name="Verified" />
            <span className="block text-xl font-semibold">
              Verified Providers
            </span>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
              Every professional on our platform undergoes a rigorous vetting process 
              to ensure quality and safety for your home.
            </span>
          </li>
          <li className="space-y-4">
            <Badge color="green" name="Secure" />
            <span className="block text-xl font-semibold">
              Secure Payments
            </span>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
              Your funds are held securely in escrow and only released once you 
              confirm the service has been completed to your satisfaction.
            </span>
          </li>
          <li className="space-y-4">
            <Badge color="red" name="Transparent" />
            <span className="block text-xl font-semibold">
              Transparent Pricing
            </span>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
              No hidden fees. See upfront pricing for every service before you book, 
              allowing you to stay within your budget.
            </span>
          </li>
          <li className="space-y-4">
            <Badge color="blue" name="On-Demand" />
            <span className="block text-xl font-semibold">
              On-Demand Booking
            </span>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
              Book services instantly or schedule them for a later time. Our 
              flexible platform adapts to your busy lifestyle.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SectionOurFeatures;
