import type { ProviderService, Service } from "@/types";
import { extractApiList } from "@/lib/api-response";

/** @deprecated Use extractApiList from "@/lib/api-response" directly. */
export const unwrapResourceList = extractApiList;

export interface ProviderServicesPayload {
  services: ProviderService[];
  available_services: Service[];
}

export function normalizeProviderServicesResponse(raw: unknown): ProviderServicesPayload {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    services: unwrapResourceList<ProviderService>(body.services),
    available_services: unwrapResourceList<Service>(body.available_services),
  };
}

export function serviceDisplayName(offering: ProviderService): string {
  return offering.service?.name ?? offering.name ?? "Service";
}

export function categoryDisplayName(offering: ProviderService): string {
  return offering.service?.category?.name ?? offering.category ?? "General";
}
