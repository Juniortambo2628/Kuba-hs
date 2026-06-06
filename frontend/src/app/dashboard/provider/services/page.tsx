"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Briefcase, Layers, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardFrostedSurface,
} from "@/components/dashboard/workspace";
import { ProviderServiceOfferingCard } from "@/components/dashboard/workspace/ProviderServiceOfferingCard";
import { ProviderServiceFormDialog } from "@/components/dashboard/ProviderServiceFormDialog";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import type { ProviderService, Service } from "@/types";
import {
  normalizeProviderServicesResponse,
  serviceDisplayName,
} from "@/lib/provider-services-api";

function ServicesManagementContent() {
  const { search } = useSearchState();
  const [services, setServices] = useState<ProviderService[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderService | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/provider/services");
      const { services: list, available_services: catalog } =
        normalizeProviderServicesResponse(res.data);
      setServices(list);
      setAvailableServices(catalog);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const linkedIds = useMemo(() => new Set(services.map((s) => String(s.service_id))), [services]);

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => {
      return (
        serviceDisplayName(s).toLowerCase().includes(q) ||
        (s.service?.category?.name ?? s.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [services, search]);

  const stats = useMemo(() => {
    const categories = new Set(
      services.map((s) => s.service?.category?.name ?? s.category).filter(Boolean)
    );
    const avg =
      services.length > 0
        ? Math.round(
            services.reduce((sum, s) => sum + Number(s.base_price || 0), 0) / services.length
          )
        : 0;
    return { count: services.length, categories: categories.size, avg };
  }, [services]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (offering: ProviderService) => {
    setEditing(offering);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this service from your profile?")) return;
    try {
      await axiosInstance.delete(`/api/provider/services/${id}`);
      toast.success("Service removed");
      fetchServices();
    } catch {
      toast.error("Failed to remove service");
    }
  };

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Services"
        subtitle="Catalog offerings and your rates. Use ⌘K in the header to search."
        actions={
          <Button className="rounded-full" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add service
          </Button>
        }
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={Briefcase}
          label="Active offerings"
          value={stats.count}
          tone="primary"
        />
        <DashboardFrostedStatCard
          icon={Layers}
          label="Categories"
          value={stats.categories}
          tone="neutral"
        />
        <DashboardFrostedStatCard
          icon={CircleDollarSign}
          label="Avg. listed rate"
          value={stats.count ? `KES ${stats.avg.toLocaleString()}` : "—"}
          tone="success"
          hint={stats.count ? "Across your offerings" : "Add your first service"}
        />
      </DashboardFrostedStatGrid>

      {search && (
        <p className="text-xs text-muted-foreground">
          {filteredServices.length} of {services.length} shown for &quot;{search}&quot;
        </p>
      )}

      {filteredServices.length === 0 ? (
        <DashboardFrostedSurface className="p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
          <p className="text-sm font-medium text-foreground">
            {search ? "No offerings match your search" : "No services yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Add services from the Kuba catalog so clients can book you.
          </p>
          {!search && (
            <Button className="mt-6 rounded-full" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add your first service
            </Button>
          )}
        </DashboardFrostedSurface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredServices.map((offering) => (
            <ProviderServiceOfferingCard
              key={offering.id}
              offering={offering}
              onEdit={openEdit}
              onDelete={handleDelete}
              onMediaChange={fetchServices}
            />
          ))}
        </div>
      )}

      <ProviderServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        availableServices={availableServices}
        linkedServiceIds={linkedIds}
        onSuccess={fetchServices}
      />
    </DashboardPageContainer>
  );
}

export default function ServicesManagement() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <ServicesManagementContent />
    </Suspense>
  );
}
