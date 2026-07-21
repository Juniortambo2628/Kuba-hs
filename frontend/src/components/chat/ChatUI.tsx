"use client";

import { ChatInterface } from "./ChatInterface";

export interface ChatUIProps {
  bookingId?: string | number;
  onClose?: () => void;
  role?: "client" | "provider";
}

/**
 * Reusable wrapper exporting ChatUI backed by the canonical ChatInterface.
 */
export function ChatUI({ role = "client" }: ChatUIProps) {
  return <ChatInterface role={role} layout="embedded" />;
}
