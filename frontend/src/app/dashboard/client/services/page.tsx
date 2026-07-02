"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
  ClientAddressCard,
} from "@/components/dashboard/workspace";
import { AddressFormDialog } from "@/components/dashboard/AddressFormDialog";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";

function ServiceAddressesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { search } = useSearchState();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user) fetchAddresses();
  }, [authLoading, user]);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get("/api/client/addresses");
      setAddresses(res.data.addresses || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return addresses;
    return addresses.filter(
      (a) =>
        a.street_address?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q) ||
        a.postal_code?.toLowerCase().includes(q) ||
        a.state?.toLowerCase().includes(q)
    );
  }, [addresses, search]);

  const handleDeleteAddress = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/client/addresses/${id}`);
      toast.success("Address removed");
      fetchAddresses();
    } catch {
      toast.error("Failed to remove address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await axiosInstance.patch(`/api/client/addresses/${id}/default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch {
      toast.error("Failed to update default");
    }
  };

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-[1.75rem]" />
          ))}
        </div>
      </DashboardPageContainer>
    );
  }

  const defaultCount = addresses.filter((a) => a.is_default).length;

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Saved addresses"
        subtitle="Where providers should come for your bookings. Use ⌘K to search."
        actions={
          <Button className="rounded-full" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add address
          </Button>
        }
      />

      <DashboardFrostedStatGrid columns={2}>
        <DashboardFrostedStatCard icon={MapPin} label="Saved locations" value={addresses.length} />
        <DashboardFrostedStatCard
          icon={MapPin}
          label="Default set"
          value={defaultCount > 0 ? "Yes" : "No"}
          tone={defaultCount > 0 ? "success" : "warning"}
          hint={defaultCount > 0 ? "Used for new bookings" : "Set a default address"}
        />
      </DashboardFrostedStatGrid>

      {search && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} result{filtered.length === 1 ? "" : "s"} for &quot;{search}&quot;
        </p>
      )}

      {filtered.length === 0 ? (
        <DashboardPanelCard>
          <div className="py-14 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
            <p className="text-sm font-medium text-foreground">
              {search ? "No addresses match your search" : "No addresses yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? "Try a different term in ⌘K or clear the search from the URL."
                : "Add a home or office address so providers know where to meet you."}
            </p>
            {!search && (
              <Button className="mt-6 rounded-full" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first address
              </Button>
            )}
          </div>
        </DashboardPanelCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((address) => (
            <ClientAddressCard
              key={address.id}
              address={address}
              onSetDefault={handleSetDefault}
              onDelete={handleDeleteAddress}
            />
          ))}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className={cn(
              workspaceUi.frosted.inset,
              "min-h-[200px] flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors border-dashed"
            )}
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">Add another address</span>
          </button>
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchAddresses}
      />
    </DashboardPageContainer>
  );
}

export default function ServiceAddresses() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <ServiceAddressesContent />
    </Suspense>
  );
}
