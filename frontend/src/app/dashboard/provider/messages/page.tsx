"use client";

import { MessagesWorkspace } from "@/components/dashboard/MessagesWorkspace";

export default function ProviderMessagesPage() {
  return (
    <MessagesWorkspace
      role="provider"
      subtitle="Chat with clients about active bookings."
      bookingsLabel="Bookings"
    />
  );
}
