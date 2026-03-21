import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";

export interface CMSSetting {
  id: string;
  key: string;
  value: string;
  image_url?: string | null;
  type: string;
  group: string;
  label: string;
  description?: string | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export function useCMS() {
  const [settings, setSettings] = useState<Record<string, Record<string, CMSSetting>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/api/settings");
        const formatted: Record<string, Record<string, CMSSetting>> = {};
        
        if (res.data.settings) {
          const rawSettings = res.data.settings as Record<string, CMSSetting[]>;
          Object.entries(rawSettings).forEach(([group, items]) => {
            formatted[group] = {};
            items.forEach((item) => {
              formatted[group][item.key] = item;
            });
          });
        }
        setSettings(formatted);
      } catch (err) {
        console.error("Failed to fetch CMS settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getS = useCallback((group: string, key: string, fallback: string) => {
    return settings[group]?.[key]?.value || fallback;
  }, [settings]);

  const getImg = useCallback((group: string, key: string, fallback: string) => {
    const setting = settings[group]?.[key];
    const url = setting?.image_url || setting?.value;
    if (!url || (setting?.type === 'image' && !url)) return fallback;
    const finalUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    // Use the local CORS proxy for storage assets when in development
    if (finalUrl.includes('/storage/')) {
        return finalUrl.replace('/storage/', '/cms-assets/');
    }
    return finalUrl;
  }, [settings]);

  return useMemo(() => ({ settings, isLoading, getS, getImg }), [settings, isLoading, getS, getImg]);
}
