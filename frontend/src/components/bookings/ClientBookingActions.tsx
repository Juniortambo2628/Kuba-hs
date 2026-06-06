"use client";

import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import type { Booking } from "@/types";

interface ClientBookingActionsProps {
  booking: Booking;
  onManage: () => void;
  onMessage: (id: string) => void;
  isStartingChat: string | null;
}

/** Compact actions on client booking cards — primary flow is Manage (dialog). */
export function ClientBookingActions({
  booking,
  onManage,
  onMessage,
  isStartingChat,
}: ClientBookingActionsProps) {
  return (
    <>
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
    </>
  );
}
