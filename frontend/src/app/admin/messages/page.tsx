"use client";

import { useState } from "react";
import {
  Inbox,
  MessageSquare,
  Quote,
  Search,
  Mail,
  Archive,
  Star,
} from "lucide-react";
import {
  useAdminInbox,
  isInboxActionable,
  type UnifiedInboxMessage,
} from "@/hooks/useAdminInbox";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getMessageTypeClasses } from "@/lib/status-styles";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { formatStatusLabel } from "@/lib/dashboard-copy";

const TYPE_LABELS: Record<UnifiedInboxMessage["type"], string> = {
  contact: "Support",
  quote: "Quote",
  feedback: "Review",
};

function resolvedLabel(type: UnifiedInboxMessage["type"]) {
  if (type === "feedback") return "Mark resolved";
  if (type === "quote") return "Mark contacted";
  return "Mark replied";
}

export default function MessagingHubPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<UnifiedInboxMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UnifiedInboxMessage | null>(null);

  const { messages, summary, isLoading, markResolved, archive, deleteMessage } = useAdminInbox();

  const filteredMessages = messages.filter((m) => {
    const matchesTab = activeTab === "all" || m.type === activeTab;
    const q = searchQuery.toLowerCase();
    return (
      matchesTab &&
      (m.sender.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q))
    );
  });

  const handleMarkResolved = async (msg: UnifiedInboxMessage) => {
    await markResolved(msg);
    if (selectedMessage?.id === msg.id && selectedMessage?.type === msg.type) {
      setSelectedMessage({
        ...msg,
        status:
          msg.type === "contact" ? "replied" : msg.type === "feedback" ? "resolved" : "contacted",
      });
    }
  };

  const handleArchive = async (msg: UnifiedInboxMessage) => {
    await archive(msg);
    if (selectedMessage?.id === msg.id && selectedMessage?.type === msg.type) {
      setSelectedMessage(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMessage(deleteTarget);
      if (
        selectedMessage?.id === deleteTarget.id &&
        selectedMessage?.type === deleteTarget.type
      ) {
        setSelectedMessage(null);
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Inbox"
        subtitle="Contact form messages, commercial quotes, and customer reviews in one place."
      />

      <DashboardFrostedStatGrid columns={4}>
        <DashboardFrostedStatCard
          icon={Inbox}
          label="Pending total"
          value={summary?.counts?.total ?? 0}
          isLoading={isLoading}
          tone={(summary?.counts?.total ?? 0) > 0 ? "primary" : "neutral"}
        />
        <DashboardFrostedStatCard
          icon={Mail}
          label="Support"
          value={summary?.counts?.contacts ?? 0}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={Quote}
          label="Quotes"
          value={summary?.counts?.quotes ?? 0}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={MessageSquare}
          label="Reviews"
          value={summary?.counts?.feedback ?? 0}
          isLoading={isLoading}
        />
      </DashboardFrostedStatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[min(640px,calc(100vh-16rem))]">
        <DashboardPanelCard
          title="Messages"
          icon={Inbox}
          className="lg:col-span-4 flex flex-col"
          contentClassName="flex flex-col flex-1 min-h-0 gap-4 p-4 md:p-5"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inbox…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full bg-muted/30 border-border/60"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 h-10 rounded-full bg-muted/40 p-1">
              <TabsTrigger value="all" className="rounded-full text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-full text-xs">
                Support
              </TabsTrigger>
              <TabsTrigger value="quote" className="rounded-full text-xs">
                Quotes
              </TabsTrigger>
              <TabsTrigger value="feedback" className="rounded-full text-xs">
                Reviews
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ul className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 kuba-scroll">
            {filteredMessages.map((msg) => {
              const selected =
                selectedMessage?.id === msg.id && selectedMessage?.type === msg.type;
              return (
                <li key={`${msg.type}-${msg.id}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      workspaceUi.frosted.inset,
                      "w-full text-left p-4 transition-all",
                      selected && "ring-2 ring-primary/30 bg-background/90"
                    )}
                  >
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                          getMessageTypeClasses(msg.type)
                        )}
                      >
                        {TYPE_LABELS[msg.type]}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate">{msg.sender}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.subject}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 capitalize">
                      {formatStatusLabel(msg.status)}
                    </p>
                  </button>
                </li>
              );
            })}
            {filteredMessages.length === 0 && (
              <li className="py-12 text-center text-sm text-muted-foreground">No messages found.</li>
            )}
          </ul>
        </DashboardPanelCard>

        <DashboardPanelCard
          title={selectedMessage ? selectedMessage.subject : "Message details"}
          description={
            selectedMessage
              ? `${TYPE_LABELS[selectedMessage.type]} · ${selectedMessage.sender}`
              : "Select a message from the list"
          }
          icon={MessageSquare}
          className="lg:col-span-8 flex flex-col"
          contentClassName="flex flex-col flex-1 min-h-0 p-0"
          action={
            selectedMessage ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  disabled={!isInboxActionable(selectedMessage.type, selectedMessage.status)}
                  onClick={() => handleMarkResolved(selectedMessage)}
                >
                  {resolvedLabel(selectedMessage.type)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleArchive(selectedMessage)}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive"
                  onClick={() => setDeleteTarget(selectedMessage)}
                >
                  Delete
                </Button>
              </div>
            ) : undefined
          }
        >
          {selectedMessage ? (
            <div className="flex flex-col flex-1 min-h-0 p-5 md:p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <DashboardStatusBadge status={selectedMessage.status} />
                {typeof selectedMessage.meta?.email === "string" && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedMessage.meta.email}
                  </span>
                )}
                {selectedMessage.meta?.rating != null && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {String(selectedMessage.meta.rating)}/5
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
                {selectedMessage.type === "quote" && selectedMessage.meta?.contact && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Contact: {String(selectedMessage.meta.contact)}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
                Received {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/25 mb-4" />
              <p className="text-sm font-medium text-foreground">No message selected</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Choose an item from the inbox to read and update its status.
              </p>
            </div>
          )}
        </DashboardPanelCard>
      </div>

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this message?"
        description="This permanently removes it from the admin inbox."
      />
    </DashboardPageContainer>
  );
}
