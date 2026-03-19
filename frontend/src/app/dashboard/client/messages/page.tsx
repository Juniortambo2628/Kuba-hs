"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ClientMessagesPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Direct messaging with active local service providers.</p>
        </div>
      </div>

      <ChatInterface role="client" />
    </div>
  );
}
