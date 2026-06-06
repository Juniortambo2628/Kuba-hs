"use client";

import Image from "next/image";
import { Briefcase, Check, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KubaFilePond } from "@/components/ui/filepond";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { getMediaUrl, cn } from "@/lib/utils";
import type { ProviderService } from "@/types";
import { categoryDisplayName, serviceDisplayName } from "@/lib/provider-services-api";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface ProviderServiceOfferingCardProps {
  offering: ProviderService;
  onEdit: (offering: ProviderService) => void;
  onDelete: (id: string) => void;
  onMediaChange: () => void;
}

export function ProviderServiceOfferingCard({
  offering,
  onEdit,
  onDelete,
  onMediaChange,
}: ProviderServiceOfferingCardProps) {
  const name = serviceDisplayName(offering);
  const category = categoryDisplayName(offering);
  const thumb =
    offering.image_urls?.[0]?.url ??
    offering.service?.thumbnail_url ??
    offering.service_thumbnail_url;
  const thumbSrc = thumb ? getMediaUrl(thumb, "service") : null;
  const isHourly = offering.pricing_type === "hourly";

  return (
    <article
      className={cn(
        workspaceUi.frosted.surface,
        "flex flex-col overflow-hidden transition-shadow hover:shadow-[0_16px_48px_-16px_rgba(15,23,42,0.15)]"
      )}
    >
      <div className="relative h-36 bg-muted/30 border-b border-border/30">
        {thumbSrc ? (
          <Image src={thumbSrc} alt={name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Briefcase className="h-12 w-12" />
          </div>
        )}
        <span
          className={cn(
            workspaceUi.frosted.badge.base,
            workspaceUi.frosted.badge.muted,
            "absolute top-3 left-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
          )}
        >
          {category}
        </span>
        {offering.is_available !== false && (
          <span
            className={cn(
              workspaceUi.frosted.badge.base,
              workspaceUi.frosted.badge.good,
              "absolute top-3 right-3"
            )}
          >
            Live
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-2">{name}</h3>
          {offering.service?.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {offering.service.description}
            </p>
          )}
        </div>

        <div className={cn(workspaceUi.frosted.inset, "p-4 space-y-1")}>
          <p className="text-[11px] font-medium text-muted-foreground">
            {isHourly ? "Hourly rate" : "Fixed price"}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            KES {Number(offering.base_price || 0).toLocaleString()}
            {isHourly && <span className="text-sm font-medium text-muted-foreground"> /hr</span>}
          </p>
          {isHourly && Number(offering.min_hours) > 1 && (
            <p className="text-[11px] text-muted-foreground">Minimum {offering.min_hours} hours</p>
          )}
          {Number(offering.travel_fee) > 0 && (
            <p className="text-[11px] text-muted-foreground">
              + KES {Number(offering.travel_fee).toLocaleString()} travel
            </p>
          )}
          {offering.equipment_included && (
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <Check className="h-3.5 w-3.5" /> Equipment included
            </p>
          )}
        </div>

        {(offering.image_urls?.length ?? 0) > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 kuba-scroll-hidden">
            {offering.image_urls?.map((img) => (
              <div
                key={img.id}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 group/img"
              >
                <Image src={getMediaUrl(img.url, "service")} alt="" fill sizes="56px" className="object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await axiosInstance.delete(`/api/media/${img.id}`);
                      toast.success("Photo removed");
                      onMediaChange();
                    } catch {
                      toast.error("Could not remove photo");
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-3">
          <p className="text-[11px] font-medium text-muted-foreground mb-2">Portfolio photos</p>
          <KubaFilePond
            modelType="provider_service"
            modelId={String(offering.id)}
            collection="services"
            allowMultiple
            onSuccess={() => {
              toast.success("Photo added");
              onMediaChange();
            }}
            label='Add photo <span class="filepond--label-action">Browse</span>'
          />
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => onEdit(offering)}
          >
            <PenLine className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(String(offering.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
