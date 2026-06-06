"use client";

import Image from "next/image";
import { getCategoryIcon } from "@/lib/category-icons";
import {
  resolveCategoryCardImageSrc,
  type CategoryMediaFields,
} from "@/lib/category-media";

interface CategoryIconDisplayProps extends CategoryMediaFields {
  className?: string;
  imageClassName?: string;
}

/** Renders uploaded category image, Spatie icon, or Lucide fallback. */
export function CategoryIconDisplay({
  name,
  icon,
  dynamic_icon_url,
  icon_url,
  image_url,
  className = "w-6 h-6",
  imageClassName = "object-cover",
}: CategoryIconDisplayProps) {
  const src = resolveCategoryCardImageSrc({
    name,
    icon,
    dynamic_icon_url,
    icon_url,
    image_url,
  });

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={name}
          fill
          sizes="80px"
          className={imageClassName}
        />
      </div>
    );
  }

  return (
    <>
      {getCategoryIcon(
        icon || icon_url,
        `${className} text-primary group-hover:text-white transition-colors`,
        name
      )}
    </>
  );
}
