"use client";

import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { ProviderCard, type ProviderCardData } from "@/components/marketplace";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import { providerHref } from "@/lib/provider-urls";
import { DashboardGreetingBar, DashboardFrostedStatCard } from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-ui";

export default function ClientFavoritesPage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data, isLoading: dataLoading } = useSWR(
    user ? "/api/favorites" : null,
    (url) => axiosInstance.get(url).then((res) => res.data)
  );

  const favorites = data?.providers || [];
  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
          ))}
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <FavoritesProvider>
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <DashboardGreetingBar
          greeting="Saved providers"
          subtitle="Professionals you bookmarked for quick booking."
        />

        <DashboardFrostedStatCard
          icon={Heart}
          label="Saved providers"
          value={favorites.length}
          tone={favorites.length > 0 ? "primary" : "neutral"}
          hint={
            favorites.length > 0
              ? "Tap a card to view their profile"
              : "Browse providers to add favorites"
          }
          className="max-w-sm"
        />

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((provider: ProviderCardData) => (
              <ProviderCard
                key={String(provider.id)}
                provider={provider}
                href={providerHref(provider)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            variant="dashboard"
            icon={Heart}
            title="No saved providers yet"
            description="When you favorite a provider on the marketplace, they appear here."
          >
            <Button asChild className="rounded-full mt-4">
              <Link href="/providers">
                <Search className="h-4 w-4 mr-2" />
                Find providers
              </Link>
            </Button>
          </EmptyState>
        )}
      </DashboardPageContainer>
    </FavoritesProvider>
  );
}
