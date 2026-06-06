"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoritesContextValue {
  isFavorited: (providerId: string) => boolean;
  toggleFavorite: (providerId: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Wrap marketplace pages in this provider so all ProviderCard instances
 * share a single favorites state (one API call, one Set).
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useFavorites();

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Access the shared favorites state. Falls back to no-ops when rendered
 * outside a FavoritesProvider (e.g. in admin views).
 */
export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    return {
      isFavorited: () => false,
      toggleFavorite: async () => {},
      isLoading: false,
    };
  }
  return ctx;
}
