"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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

interface CMSContextType {
  settings: Record<string, Record<string, CMSSetting>>;
  isLoading: boolean;
  getS: (group: string, key: string, fallback: string) => string;
  getImg: (group: string, key: string, fallback: string) => string;
  refreshSettings: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, Record<string, CMSSetting>>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
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
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getS = useCallback((group: string, key: string, fallback: string) => {
    return settings[group]?.[key]?.value || fallback;
  }, [settings]);

  const getImg = useCallback((group: string, key: string, fallback: string) => {
    const setting = settings[group]?.[key];
    const url = setting?.image_url || setting?.value;
    if (!url || (setting?.type === 'image' && !url)) return fallback;
    const finalUrl = url.startsWith('http') ? url : `${BACKEND_URL}/${url.replace(/^\//, '')}`;
    
    // Local dev workaround for storage files
    if (finalUrl.includes('localhost') && finalUrl.includes('/storage/')) {
        return finalUrl.replace('/storage/', '/cms-assets/');
    }
    return finalUrl;
  }, [settings]);

  const value = useMemo(() => ({ 
    settings, 
    isLoading, 
    getS, 
    getImg,
    refreshSettings: fetchSettings 
  }), [settings, isLoading, getS, getImg, fetchSettings]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
