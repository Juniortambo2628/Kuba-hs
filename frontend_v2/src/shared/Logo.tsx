"use client";
import React from "react";
import logoImg from "../../public/Kuba-Header-footter-Logo-for-Light-Mode.png";
import logoLightImg from "../../public/Kuba-Header-Footer-Logo-for-Dark-Mode.png";
import LogoSvgLight from "./LogoSvgLight";
import LogoSvg from "./LogoSvg";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

export interface LogoProps {
  img?: StaticImageData | string;
  imgLight?: StaticImageData | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "w-24",
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderLogo = (source: string | StaticImageData | undefined, isLight: boolean) => {
    if (!isMounted || !source) return null;
    
    // Convert source to string for checking if it's an empty string
    const sourceStr = typeof source === "string" ? source.trim() : "STATIC_IMG";
    if (sourceStr.length === 0) return null;

    return (
      <Image
        key={isLight ? "light-logo" : "dark-logo"}
        className={`${isLight ? "hidden dark:block" : "block dark:hidden"} object-contain object-left`}
        src={source}
        alt={isLight ? "Logo-Light" : "Logo"}
        fill
        priority
        sizes="200px"
      />
    );
  };

  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block focus:outline-none focus:ring-0 ${className}`}
    >
      <div className="relative h-10 w-40">
        {renderLogo(img, false)}
        {renderLogo(imgLight, true)}
        {!isMounted && <span className="text-xl font-bold opacity-0">Kuba</span>}
      </div>
    </Link>
  );
};

export default Logo;
