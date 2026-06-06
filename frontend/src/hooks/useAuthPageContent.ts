"use client";

import { useMemo } from "react";
import { useCMS } from "@/contexts/CMSContext";
import {
  AUTH_PAGE_LINKS,
  buildAuthPageContent,
  type AuthPageVariant,
} from "@/lib/auth-page-content";

export function useAuthPageContent(variant: AuthPageVariant) {
  const { getS, getImg } = useCMS();

  const content = useMemo(() => {
    const getSetting = (key: string, fallback = "") =>
      getS("auth_pages", key, fallback) || fallback;
    const getImage = (key: string, fallback = "") =>
      getImg("auth_pages", key, fallback) || fallback;

    return buildAuthPageContent(variant, getSetting, getImage);
  }, [variant, getS, getImg]);

  const meta = AUTH_PAGE_LINKS[variant];

  return { content, footerHref: meta.href, showSocialProof: meta.showSocialProof };
}
