"use client";

import Link from "next/link";
import { ChevronRight, Wrench } from "lucide-react";
import type { ProviderSearchRowData } from "@/components/marketplace/ProviderSearchRow";
import { ProviderSearchMeta } from "@/components/marketplace/ProviderSearchMeta";
import { providerHref } from "@/lib/provider-urls";

interface ProviderMapPopupProps {
  provider: ProviderSearchRowData & {
    services?: Array<{ name?: string; service?: { name?: string } | null }> | null;
  };
}

export function ProviderMapPopup({ provider }: ProviderMapPopupProps) {
  const services = (provider.services ?? [])
    .map((s: any) => s.name || s.service?.name)
    .filter(Boolean)
    .slice(0, 5) as string[];

  return (
    <div className="p-3 min-w-[220px] space-y-3">
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
          {provider.business_name}
        </h4>
        <ProviderSearchMeta provider={provider} className="text-[10px]" />
      </div>
      {services.length > 0 && (
        <div className="border-t border-gray-100 dark:border-white/10 pt-2 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            Services
          </p>
          <ul className="text-[11px] text-foreground space-y-0.5">
            {services.map((name) => (
              <li key={name} className="line-clamp-1">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-end border-t border-gray-100 dark:border-white/10 pt-2">
        <Link
          href={providerHref(provider)}
          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          View Profile <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
