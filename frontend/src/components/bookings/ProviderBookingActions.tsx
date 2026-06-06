"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { Briefcase } from "lucide-react";
import type { Booking } from "@/types";

interface ProviderBookingActionsProps {
  booking: Booking;
  onManage: () => void;
  onMessage: (id: string) => void;
  onAccept?: (id: string) => void;
  isStartingChat: string | null;
  isUpdating?: boolean;
}

/** Compact actions on provider booking cards — primary flow is Manage (dialog). */
export function ProviderBookingActions({
  booking,
  onManage,
  onMessage,
  onAccept,
  isStartingChat,
  isUpdating = false,
}: ProviderBookingActionsProps) {
  const [acceptOpen, setAcceptOpen] = useState(false);

  return (
    <>
      {booking.status === "pending" && onAccept && (
        <Button
          size="sm"
          className="rounded-full"
          disabled={isUpdating}
          onClick={(e) => {
            e.stopPropagation();
            setAcceptOpen(true);
          }}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Accept"
          )}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onManage();
        }}
      >
        Manage
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="rounded-full"
        disabled={isStartingChat === booking.id}
        onClick={(e) => {
          e.stopPropagation();
          onMessage(booking.id);
        }}
      >
        {isStartingChat === booking.id ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Message
          </>
        )}
      </Button>

      {onAccept && (
        <AppConfirmDialog
          open={acceptOpen}
          onOpenChange={setAcceptOpen}
          title="Accept this job?"
          introDescription="You will be committed to fulfill this booking for the client."
          description="The client will be notified immediately once you confirm."
          icon={Briefcase}
          confirmLabel="Accept job"
          isLoading={isUpdating}
          onConfirm={() => {
            onAccept(booking.id);
            setAcceptOpen(false);
          }}
        />
      )}
    </>
  );
}
