"use client";

import Link from "next/link";
import Image from "next/image";
import { designSystem } from "@/lib/design-system";

interface AuthFormHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthFormHeader({ title, subtitle }: AuthFormHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/branding/Kuba-Logo-Login-Light-mode.png"
          alt="KUBA"
          width={208}
          height={208}
          className="h-10 w-auto dark:hidden"
        />
        <Image
          src="/assets/branding/Kuba-Logo-Login-Dark-mode.png"
          alt="KUBA"
          width={208}
          height={208}
          className="h-10 w-auto hidden dark:block"
        />
      </Link>

      <div>
        <h1 className={designSystem.typography.auth.h1}>{title}</h1>
        <p className={designSystem.typography.auth.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
