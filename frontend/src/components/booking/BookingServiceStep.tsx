"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Briefcase, Building2, Calendar, Clock, Factory, Home, Info, MapPin, MoreHorizontal, ShieldCheck, Upload, Users } from "lucide-react";
import DashboardModal from "@uppy/react/dashboard-modal";
import type { BookingOffering } from "@/components/booking/BookingModal";
import type { BookingForm, BookingValues } from "@/components/booking/booking-modal-types";
import { cn } from "@/lib/utils";

interface BookingServiceStepProps {
  form: BookingForm;
  service: BookingOffering | null;
  offerings: BookingOffering[];
  selectedOffering: BookingOffering | null;
  onSelectOffering: (offering: BookingOffering | null) => void;
  config: Record<string, any>;
  uppy: any;
  showUppy: boolean;
  onToggleUppy: (value: boolean) => void;
  onUploadPhotos: () => void;
}

export function BookingServiceStep({
  form,
  service,
  offerings,
  selectedOffering,
  onSelectOffering,
  config,
  uppy,
  showUppy,
  onToggleUppy,
  onUploadPhotos,
}: BookingServiceStepProps) {
  return (
    <>
      {offerings.length > 0 && (
        <div className="pb-6 mb-6 border-b border-border/50 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {offerings.length > 1 ? "Select a service" : "Service"}
          </p>
          <div className={cn("grid gap-3", offerings.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
            {offerings.map((off) => {
              const normalized = off;
              const selected = selectedOffering?.id === normalized.id || service?.id === normalized.id;
              return (
                <button
                  key={off.id}
                  type="button"
                  onClick={() => onSelectOffering(normalized)}
                  className={cn(
                    "text-left rounded-xl border p-4 transition-all",
                    selected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <p className="font-semibold text-foreground text-sm">{normalized.name}</p>
                  {normalized.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{normalized.description}</p>
                  )}
                  <p className="text-sm font-bold text-primary mt-2 tabular-nums">
                    KES {Number(normalized.base_price || 0).toLocaleString()}
                    {normalized.pricing_type === "hourly" ? " / hr" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!service && (
        <p className="text-sm text-amber-700 dark:text-amber-400 mb-4 rounded-xl bg-amber-500/10 px-4 py-3 border border-amber-500/20">
          Pick a service above to configure your booking details.
        </p>
      )}

      <FormField
        control={form.control}
        name="service_type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">{config.typeLabel}</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-3">
                {config.typeOptions.map((type: any) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => field.onChange(type.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${field.value === type.id ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400" : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-500 hover:border-gray-200 dark:hover:border-white/10"}`}
                  >
                    {type.icon}
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">{config.quantityLabel}</FormLabel>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" /> {config.quantityHint}
              </span>
            </div>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500 font-bold"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
                <Badge variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 text-gray-500 bg-gray-50 dark:bg-white/5">
                  {config.getQuantityBadge(form.watch("service_type"))}
                </Badge>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">{config.descriptionLabel}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={config.descriptionPlaceholder}
                className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl min-h-[120px] focus-visible:ring-blue-500 pt-4"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-900 dark:text-white">Upload Photos (Optional)</label>
        <Button
          type="button"
          variant="outline"
          onClick={onUploadPhotos}
          className="w-full h-14 border-dashed border-2 rounded-2xl border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 hover:bg-blue-50/50 dark:hover:bg-blue-600/5 transition-all text-gray-500"
        >
          <Upload className="w-5 h-5" />
          <span>Manage Photos ({uppy.getFiles().length})</span>
        </Button>
        <DashboardModal
          uppy={uppy}
          open={showUppy}
          onRequestClose={() => onToggleUppy(false)}
          plugins={["ImageEditor"]}
          proudlyDisplayPoweredByUppy={false}
          metaFields={[]}
          closeAfterFinish={true}
          hideUploadButton={false}
          note="Add up to 5 photos. Click 'Upload' to confirm they are ready."
        />
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-2">
          <AlertCircle className="w-3 h-3" /> Helps pros assess materials & severity
        </p>
      </div>
    </>
  );
}
