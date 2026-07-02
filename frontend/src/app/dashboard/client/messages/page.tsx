"use client";

import { useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Inbox, MessageSquare, Mail } from "lucide-react";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardFrostedSurface,
} from "@/components/dashboard/workspace";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { workspaceUi } from "@/lib/dashboard-ui";
import axiosInstance from "@/lib/axios";
import { extractApiList } from "@/lib/api-response";
import { normalizeConversation } from "@/lib/chat-utils";

export default function ClientMessagesPage() {
  const { data, isLoading } = useSWR("/api/chat/conversations", (url) =>
    axiosInstance.get(url).then((res) => res.data)
  );

  const conversations = useMemo(() => {
    const list = extractApiList(data?.conversations);
    return list.map((row) => normalizeConversation(row));
  }, [data]);

  const unread = useMemo(
    () => conversations.reduce((n, c) => n + (c.unread_count || 0), 0),
    [conversations]
  );

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Messages"
        subtitle="Chat with providers about your bookings and scheduling."
        actions={
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/dashboard/client/bookings">My bookings</Link>
          </Button>
        }
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={Inbox}
          label="Conversations"
          value={isLoading ? "—" : conversations.length}
          tone="neutral"
          isLoading={isLoading}
          hint="One thread per booking"
        />
        <DashboardFrostedStatCard
          icon={Mail}
          label="Unread"
          value={isLoading ? "—" : unread}
          tone={unread > 0 ? "primary" : "neutral"}
          badge={unread > 0 ? "New" : undefined}
          badgeTone={unread > 0 ? "info" : "muted"}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={MessageSquare}
          label="Inbox"
          value={isLoading ? "—" : unread > 0 ? "Needs reply" : "Up to date"}
          tone={unread > 0 ? "warning" : "success"}
          isLoading={isLoading}
          hint={unread > 0 ? "Open a thread to respond" : "All caught up"}
        />
      </DashboardFrostedStatGrid>

      <DashboardFrostedSurface title="Conversations" subtitle="Select a thread to read and reply">
        <ChatInterface role="client" layout="page" />
      </DashboardFrostedSurface>
    </DashboardPageContainer>
  );
}
