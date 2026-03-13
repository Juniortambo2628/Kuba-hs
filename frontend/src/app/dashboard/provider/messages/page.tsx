"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ProviderMessagesPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight italic">Customer <span className="text-sky-600">Comms</span></h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Direct messaging with your booked clients</p>
      </div>

      <ChatInterface role="provider" />
    </div>
  );
}
