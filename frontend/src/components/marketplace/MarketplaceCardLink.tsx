"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarketplaceCardLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}

/** Standard interactive wrapper for marketplace cards. */
export function MarketplaceCardLink({ href, children, className, onMouseEnter }: MarketplaceCardLinkProps) {
  return (
    <Link href={href} className={cn("group block h-full", className)} onMouseEnter={onMouseEnter}>
      {children}
    </Link>
  );
}
