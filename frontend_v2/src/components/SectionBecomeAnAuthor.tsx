import React, { FC } from "react";
import rightImgDemo from "@/images/BecomeAnAuthorImg.png";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Logo from "@/shared/Logo";
import Image from "next/image";

export interface SectionBecomeAnAuthorProps {
  className?: string;
  rightImg?: any;
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = "",
  rightImg,
}) => {
  const src = (rightImg && typeof rightImg === "string" && rightImg.trim() !== "") ? rightImg : rightImgDemo;
  return (
    <div
      className={`nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center  ${className}`}
      data-nc-id="SectionBecomeAnAuthor"
    >
      <div className="flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-20" />
        <h2 className="font-semibold text-3xl sm:text-4xl mt-6 sm:mt-11">
          Join the Kuba Professional Network
        </h2>
        <span className="block mt-6 text-neutral-500 dark:text-neutral-400">
          Are you a skilled professional in Nairobi? Grow your business with Kuba. 
          Connect with clients looking for your expertise in cleaning, wellness, 
          legal services, and more. Manage your bookings and payments all in one place.
        </span>
        <ButtonPrimary href="/signup" className="mt-6 sm:mt-11">
          Become a Service Provider
        </ButtonPrimary>
      </div>
      <div className="flex-grow">
        <Image 
          alt="" 
          src={src} 
          width={800} 
          height={600} 
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default SectionBecomeAnAuthor;
