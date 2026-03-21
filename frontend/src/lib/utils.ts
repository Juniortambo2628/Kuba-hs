import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined, fallbackType: 'avatar' | 'service' | 'testimonial' = 'service') {
  if (!path) {
    switch (fallbackType) {
      case 'avatar': return '/placeholders/user-placeholder.png';
      case 'testimonial': return 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop';
    }
  }
  
  if (path.startsWith('http')) {
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
  
  return `${baseUrl}/storage/${cleanPath}`;
}
