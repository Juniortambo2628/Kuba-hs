"use client";

import Image from "next/image";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

interface AuthBrandLogoProps {
  href?: string;
  className?: string;
  priority?: boolean;
}

/** Same CMS identity logos as the public site header (Navbar). */
export function AuthBrandLogo({
  href = "/",
  className,
  priority = true,
}: AuthBrandLogoProps) {
  const { getImg } = useCMS();
  const logoLight = getImg(
    "identity",
    "logo_light",
    "/assets/Kuba-Header-footter-Logo-for-Light-Mode.png"
  );
  const logoDark = getImg(
    "identity",
    "logo_dark",
    "/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png"
  );

  return (
    <Link
      href={href}
      className={cn("relative inline-flex h-10 w-44 sm:h-11 sm:w-52 shrink-0", className)}
    >
      <Image
        src={logoLight}
        alt="Kuba"
        fill
        sizes="240px"
        priority={priority}
        className="object-contain object-left dark:hidden"
      />
      <Image
        src={logoDark}
        alt="Kuba"
        fill
        sizes="240px"
        priority={priority}
        className="object-contain object-left hidden dark:block"
      />
    </Link>
  );
}
