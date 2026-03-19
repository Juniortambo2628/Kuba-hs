"use client";
import { avatarColors } from "@/contains/contants";
import React, { FC } from "react";
import avatar1 from "@/images/avatars/Image-1.png";
import Image, { StaticImageData } from "next/image";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string | StaticImageData;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl = avatar1,
  userName,
  hasChecked,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getValidUrl = () => {
    if (!imgUrl) return null;
    if (typeof imgUrl === "string" && imgUrl.trim().length === 0) return null;
    return imgUrl;
  };
  const url = getValidUrl();

  const name = userName || "John Doe";
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(
      name.charCodeAt(0) % avatarColors.length
    );
    return avatarColors[backgroundIndex];
  };

  const finalUrl = (isMounted && url) ? url : null;

  return (
    <div
      className={`wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: finalUrl ? undefined : _setBgColor(name) }}
    >
      {finalUrl ? (
        <Image
          className={`object-cover ${radius}`}
          src={finalUrl}
          fill
          alt={name}
          sizes="100px"
          unoptimized={typeof finalUrl === "string" && finalUrl.startsWith("http")}
        />
      ) : null}
      <span className="wil-avatar__name">{name[0]}</span>

      {hasChecked && (
        <span
          className={` bg-teal-500 rounded-full text-white absolute  ${hasCheckedClass}`}
        >
          <i className="las la-check  text-xs"></i>
        </span>
      )}
    </div>
  );
};

export default Avatar;
