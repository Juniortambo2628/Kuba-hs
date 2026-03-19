"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ProviderMessagesPage() {
 return (
  <div className="max-w-[1200px] mx-auto space-y-8 h-full">
   <div>
    <h1 className="text-3xl font-semibold text-foreground uppercase tracking-tight ">Customer <span className="text-primary">Comms</span></h1>
    <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide mt-1 ">Direct messaging with your booked clients</p>
   </div>

   <ChatInterface role="provider" />
  </div>
 );
}
