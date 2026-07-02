import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FALLBACK_IMAGES } from "@/lib/fallback-images"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined, fallbackType: 'avatar' | 'service' | 'testimonial' = 'service') {
  if (!path) {
    switch (fallbackType) {
      case 'avatar': return '/placeholders/user-placeholder.png';
      case 'testimonial': return FALLBACK_IMAGES.testimonial;
      default: return FALLBACK_IMAGES.cleaning;
    }
  }
  
  if (path.startsWith('http')) {
    try {
      const url = new URL(path);
      if (
        (url.hostname === '127.0.0.1' || url.hostname === 'localhost') &&
        url.pathname.includes('/storage/')
      ) {
        return url.pathname.replace('/storage/', '/cms-assets/');
      }
    } catch {
      /* fall through */
    }
    if (path.includes('ui-avatars.com')) {
      try {
        const url = new URL(path);
        const name = url.searchParams.get('name') || 'User';
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=e2e8f0&textColor=475569`;
      } catch (e) {
        return path;
      }
    }
    return path;
  }
  
  if (path.startsWith('/placeholders') || path.startsWith('/assets')) {
    return path;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '');
  const finalUrl = path.startsWith('/storage/')
    ? `${baseUrl}${path}`
    : `${baseUrl}/storage/${cleanPath}`;

  // Local dev: proxy storage through Next.js cms-assets rewrite (CORS workaround)
  if (/localhost|127\.0\.0\.1/.test(baseUrl) && finalUrl.includes('/storage/')) {
    return finalUrl.replace('/storage/', '/cms-assets/');
  }

  return finalUrl;
}

/** CMS / admin settings images — normalizes object URLs and proxies via getMediaUrl */
export function resolveMediaUrl(url: unknown): string {
  if (!url || typeof url !== "string") {
    if (url && typeof url === "object") {
      console.warn("resolveMediaUrl received an object instead of string:", url);
    }
    return "";
  }
  return getMediaUrl(url, "service");
}
