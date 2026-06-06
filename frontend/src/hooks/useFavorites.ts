"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Manages favorite state for providers.
 * On mount, fetches the authenticated user's full set of favorite provider IDs
 * and keeps an in-memory Set for O(1) lookup.
 *
 * Returns `isFavorited(providerId)` and `toggleFavorite(providerId)`.
 */
export function useFavorites() {
  const { user } = useAuth();
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the initial set of favorites when the user is authenticated
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    axiosInstance
      .get("/api/favorites")
      .then((res) => {
        if (!cancelled) {
          setFavoriteIds(new Set(res.data?.data ?? []));
        }
      })
      .catch(() => {
        // silently ignore — user might not be authenticated yet
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorited = useCallback(
    (providerId: string) => favoriteIds.has(providerId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (providerId: string) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(providerId)) {
          next.delete(providerId);
        } else {
          next.add(providerId);
        }
        return next;
      });

      try {
        await axiosInstance.post(`/api/favorites/${providerId}`);
      } catch {
        // Revert on failure
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(providerId)) {
            next.delete(providerId);
          } else {
            next.add(providerId);
          }
          return next;
        });
      }
    },
    [user]
  );

  return useMemo(
    () => ({ isFavorited, toggleFavorite, isLoading }),
    [isFavorited, toggleFavorite, isLoading]
  );
}
