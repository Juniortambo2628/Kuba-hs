"use client";

import { Home, MapPin, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DashboardAlertAction,
  DashboardAlertCancel,
} from "@/components/shared/DashboardAlertActions";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";

export interface ClientAddress {
  id: string;
  street_address: string;
  apartment?: string;
  city: string;
  postal_code?: string;
  is_default?: boolean;
}

interface ClientAddressCardProps {
  address: ClientAddress;
  onSetDefault?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function ClientAddressCard({
  address,
  onSetDefault,
  onDelete,
  className,
}: ClientAddressCardProps) {
  const mapsQuery = encodeURIComponent(
    `${address.street_address}, ${address.city}${address.postal_code ? `, ${address.postal_code}` : ""}`
  );

  return (
    <article className={cn(workspaceUi.frosted.surface, "p-5 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-primary">
          <Home className="h-5 w-5" />
        </div>
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this address?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bookings that used this address will keep their history. You can add it again later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <DashboardAlertCancel>Cancel</DashboardAlertCancel>
                <DashboardAlertAction variant="destructive" onClick={() => onDelete(address.id)}>
                  Remove
                </DashboardAlertAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">{address.street_address}</h3>
          {address.is_default && <DashboardStatusBadge status="active" label="Default" tone="good" />}
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {address.apartment ? `${address.apartment}, ` : ""}
          {address.city}
          {address.postal_code ? ` · ${address.postal_code}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open in Maps
          </a>
        </Button>
        {onSetDefault && !address.is_default && (
          <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onSetDefault(address.id)}>
            Set as default
          </Button>
        )}
      </div>
    </article>
  );
}
