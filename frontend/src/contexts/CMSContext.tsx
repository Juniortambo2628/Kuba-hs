"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { getMediaUrl } from "@/lib/utils";

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
  getS: (group: string, key: string, fallback?: string) => string;
  getImg: (group: string, key: string, fallback?: string) => string;
  refreshSettings: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children, initialRawSettings }: { children: React.ReactNode, initialRawSettings?: Record<string, CMSSetting[]> }) {
  const formatSettings = (raw: Record<string, CMSSetting[]>) => {
    const formatted: Record<string, Record<string, CMSSetting>> = {};
    Object.entries(raw).forEach(([group, items]) => {
      formatted[group] = {};
      items.forEach((item) => {
        formatted[group][item.key] = item;
      });
    });
    return formatted;
  };

  const [settings, setSettings] = useState<Record<string, Record<string, CMSSetting>>>(() => 
    initialRawSettings && Object.keys(initialRawSettings).length > 0 ? formatSettings(initialRawSettings) : {}
  );
  const [isLoading, setIsLoading] = useState(!initialRawSettings || Object.keys(initialRawSettings).length === 0);

  const fetchSettings = useCallback(async () => {
    try {
      if (Object.keys(settings).length === 0) {
        setIsLoading(true);
      }
      const res = await axiosInstance.get("/api/settings");

      if (res.data.settings) {
        setSettings(formatSettings(res.data.settings));
      }
    } catch (err) {
      console.warn(
        "Failed to fetch CMS settings. Ensure Laravel is running (php artisan serve). Using SSR/defaults until the API is available.",
        err
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetchSettings();
    }
  }, [fetchSettings, settings]);

  const getS = useCallback((group: string, key: string, fallback = "") => {
    return settings[group]?.[key]?.value || fallback;
  }, [settings]);

  const getImg = useCallback((group: string, key: string, fallback = "") => {
    const setting = settings[group]?.[key];
    const url = setting?.image_url || setting?.value;
    if (!url || (setting?.type === "image" && !url)) return fallback;
    return getMediaUrl(url, "service") || fallback;
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
