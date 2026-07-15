"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DynamicImageProps extends ImageProps {
  wrapperClassName?: string;
}

export function DynamicImage({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}: DynamicImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-none" />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
