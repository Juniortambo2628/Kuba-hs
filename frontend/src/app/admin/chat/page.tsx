"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardDataCard, DashboardTableHead, DashboardTableHeaderRow } from "@/components/shared/DashboardTable";
import { useApiData } from "@/hooks/useApiData";
import { extractApiList } from "@/lib/api-response";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

interface ConversationRow {
  id: string;
  customer?: { name?: string; email?: string };
  provider?: { business_name?: string; user?: { name?: string } };
  booking?: { booking_number?: string; service?: { name?: string } };
  last_message_at?: string;
  latest_message?: { body?: string };
}

interface ChatMessage {
  id: string;
  body: string;
  created_at: string;
  sender?: { name?: string };
}

export default function AdminChatModerationPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ messages?: ChatMessage[] } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { data: envelope, isLoading } = useApiData<unknown>(
    `/api/admin/chat/conversations?search=${encodeURIComponent(search)}`,
    { preserveEnvelope: true, initialData: null }
  );

  const conversations = extractApiList<ConversationRow>(envelope);

  const openConversation = async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get(`/api/admin/chat/conversations/${id}`);
      setDetail(res.data.data ?? res.data);
    } catch {
      toast.error("Failed to load conversation");
      setSelectedId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/api/admin/chat/messages/${messageId}`);
      toast.success("Message removed");
      if (selectedId) openConversation(selectedId);
    } catch {
      toast.error("Failed to remove message");
    }
  };

  return (
    <DashboardPageContainer className="space-y-8">
      <DashboardPageHeader
        title="Chat Moderation"
        subtitle="Review platform conversations and remove policy violations."
      />

      <Input
        placeholder="Search by client, provider, or booking number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md h-11 rounded-xl"
      />

      <DashboardDataCard>
        <Table>
          <TableHeader>
            <DashboardTableHeaderRow>
              <DashboardTableHead position="first">Booking</DashboardTableHead>
              <DashboardTableHead>Participants</DashboardTableHead>
              <DashboardTableHead>Last activity</DashboardTableHead>
              <DashboardTableHead position="last">Actions</DashboardTableHead>
            </DashboardTableHeaderRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : conversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground text-sm">
                  No conversations found.
                </TableCell>
              </TableRow>
            ) : (
              conversations.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">
                    {c.booking?.booking_number ?? "—"}
                    <p className="text-muted-foreground font-sans mt-0.5">
                      {c.booking?.service?.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold">{c.customer?.name ?? "Client"}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.provider?.business_name ?? c.provider?.user?.name ?? "Provider"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.last_message_at
                      ? new Date(c.last_message_at).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => openConversation(c.id)}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DashboardDataCard>

      <Sheet open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Conversation</SheetTitle>
            <SheetDescription>Moderate messages in this thread.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {loadingDetail ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            ) : (
              (detail?.messages ?? []).map((m) => (
                <div key={m.id} className="rounded-xl border border-border p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-muted-foreground">
                      {m.sender?.name ?? "User"} · {new Date(m.created_at).toLocaleString()}
                    </p>
                    <ConfirmDeleteDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                      title="Remove message?"
                      description="This permanently deletes the message from the thread."
                      onConfirm={() => deleteMessage(m.id)}
                    />
                  </div>
                  <p className="text-sm">{m.body}</p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </DashboardPageContainer>
  );
}
