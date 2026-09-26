"use client";

import { MessagesWorkspace } from "@/components/dashboard/MessagesWorkspace";

export default function ClientMessagesPage() {
  return (
    <MessagesWorkspace
      role="client"
      subtitle="Chat with providers about your bookings and scheduling."
      bookingsLabel="My bookings"
    />
  );
}
