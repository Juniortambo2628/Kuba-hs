import React, { FC } from "react";
import HIW1img from "@/images/HIW1.png";
import HIW2img from "@/images/HIW2.png";
import HIW3img from "@/images/HIW3.png";
import VectorImg from "@/images/VectorHIW.svg";
import Image, { StaticImageData } from "next/image";
import Heading from "@/shared/Heading";

export interface SectionHowItWorkProps {
  className?: string;
  data?: {
    id: number;
    title: string;
    desc: string;
    img: StaticImageData;
    imgDark?: StaticImageData;
  }[];
}

const DEMO_DATA: SectionHowItWorkProps["data"] = [
  {
    id: 1,
    img: HIW1img,
    title: "Find a professional",
    desc: "Browse through our vetted categories of home, wellness, and digital services.",
  },
  {
    id: 2,
    img: HIW2img,
    title: "Book your service",
    desc: "Select a date and time that works for you. Secure payments handled via the platform.",
  },
  {
    id: 3,
    img: HIW3img,
    title: "Relax & Rate",
    desc: "Enjoy your service and let us know about your experience to maintain high standards.",
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-SectionHowItWork  ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <Heading isCenter desc="Simple. Secure. Reliable.">
        How it works
      </Heading>
      <div className="mt-20 relative grid md:grid-cols-3 gap-20">
        <Image
          className="hidden md:block absolute inset-x-0 top-10"
          src={VectorImg}
          alt=""
        />
        {data.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            {item.imgDark ? (
              <>
                <Image
                  className="dark:hidden block mb-8 max-w-[180px] mx-auto"
                  src={item.img || HIW2img || "/placeholder-light.png"}
                  alt=""
                />
                <Image
                  alt=""
                  className="hidden dark:block mb-8 max-w-[180px] mx-auto"
                  src={item.imgDark || HIW2img || "/placeholder-dark.png"}
                />
              </>
            ) : (
              <Image
                alt=""
                className="mb-8 max-w-[180px] mx-auto"
                src={item.img || HIW1img || "/placeholder-light.png"}
              />
            )}
            <div className="text-center mt-auto">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHowItWork;
