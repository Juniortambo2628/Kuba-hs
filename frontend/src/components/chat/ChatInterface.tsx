"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { getEcho } from "@/lib/echo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare, ChevronLeft, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";
import type { Conversation, Message } from "@/types";
import { DashboardUserAvatar } from "@/components/dashboard/workspace/DashboardUserAvatar";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";
import { normalizeConversation, normalizeMessage, chatPartner, bookingServiceLabel } from "@/lib/chat-utils";
import { extractApiList } from "@/lib/api-response";

interface ChatInterfaceProps {
  role: "client" | "provider";
  /** Taller layout on dedicated dashboard messages pages */
  layout?: "page" | "embedded";
  className?: string;
}

function formatMessageDay(date: string) {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function ChatInterface({ role, layout = "embedded", className }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      const list = extractApiList(res.data?.conversations).map(
        (row) => normalizeConversation(row)
      );
      setConversations(list);
    } catch (err) {
      console.error(err);
      toast.error("Could not load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await axiosInstance.get(`/api/chat/conversations/${activeConversationId}`);
        const conv = extractApiList(res.data?.conversation ?? res.data).find(
          (x: Record<string, unknown>) => x.id === activeConversationId
        );
        const rawMessages = Array.isArray(conv?.messages)
          ? conv.messages
          : Array.isArray(res.data?.messages)
            ? res.data.messages
            : [];
        const normalized = extractApiList(rawMessages).map(normalizeMessage);
        setMessages(normalized);

        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversationId ? { ...c, unread_count: 0 } : c))
        );
      } catch (err) {
        console.error(err);
        toast.error("Could not load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    const echo = getEcho();
    if (echo) {
      const channel = echo.private(`conversation.${activeConversationId}`);

      channel.listen(".message.sent", (e: { message?: Message }) => {
        if (e.message && String(e.message.sender_id) !== String(user?.id)) {
          setMessages((prev) => {
            if (prev.find((m) => m.id === e.message!.id)) return prev;
            return [...prev, normalizeMessage(e.message as unknown as Record<string, unknown>)];
          });
        }
      });

      channel.listen(".message.read", (e: { message_ids?: string[] }) => {
        if (e.message_ids?.length) {
          setMessages((prev) =>
            prev.map((m) =>
              e.message_ids!.includes(m.id)
                ? { ...m, read_at: new Date().toISOString() }
                : m
            )
          );
        }
      });

      return () => {
        channel.stopListening(".message.sent");
        channel.stopListening(".message.read");
        echo.leave(`conversation.${activeConversationId}`);
      };
    }
  }, [activeConversationId, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !newMessage.trim()) return;

    const body = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const res = await axiosInstance.post(
        `/api/chat/conversations/${activeConversationId}/messages`,
        { body }
      );
      const sentRaw = extractApiList(res.data)[0];
      const sentMsg = normalizeMessage(sentRaw as Record<string, unknown>);

      setMessages((prev) => (prev.find((m) => m.id === sentMsg.id) ? prev : [...prev, sentMsg]));

      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === activeConversationId
              ? { ...c, latestMessage: sentMsg, last_message_at: sentMsg.created_at, unread_count: 0 }
              : c
          )
          .sort(
            (a, b) =>
              new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
          )
      );
    } catch (err) {
      console.error(err);
      toast.error("Message could not be sent");
      setNewMessage(body);
    } finally {
      setIsSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activePartner = activeConversation ? chatPartner(activeConversation, role) : null;

  const totalUnread = useMemo(
    () => conversations.reduce((n, c) => n + (c.unread_count || 0), 0),
    [conversations]
  );

  const heightClass =
    layout === "page" ? "h-[min(640px,calc(100vh-18rem))]" : "h-[min(520px,58vh)]";

  return (
    <div
      className={cn("flex w-full overflow-hidden bg-transparent", heightClass, className)}
    >
      {/* Thread list */}
      <div
        className={cn(
          "flex w-full flex-col border-border/40 md:w-[280px] lg:w-[300px] md:border-r md:bg-muted/10",
          activeConversationId ? "hidden md:flex" : "flex"
        )}
      >
        <ScrollArea className="flex-1 p-3 md:p-4">
          {isLoadingConversations ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs">Loading…</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">No messages yet</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {role === "client"
                  ? "Messages appear here after you book a service."
                  : "When clients book you, their threads will show up here."}
              </p>
              <Button variant="outline" size="sm" className="mt-6 rounded-full" asChild>
                <Link
                  href={
                    role === "client"
                      ? "/dashboard/client/bookings"
                      : "/dashboard/provider/bookings"
                  }
                >
                  {role === "client" ? "View my bookings" : "View bookings"}
                </Link>
              </Button>
              {role === "client" && (
                <Button variant="ghost" size="sm" className="mt-2 rounded-full" asChild>
                  <Link href="/services">Browse services</Link>
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((conv) => {
                const partner = chatPartner(conv, role);
                const isActive = activeConversationId === conv.id;
                const preview = conv.latestMessage?.body ?? "No messages yet";
                const previewTime = conv.latestMessage?.created_at ?? conv.last_message_at;

                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => setActiveConversationId(conv.id)}
                      className={cn(
                        workspaceUi.frosted.inset,
                        "flex w-full items-start gap-3 p-3 text-left transition-all hover:shadow-sm",
                        isActive && "ring-2 ring-primary/25 bg-white/90 dark:bg-card/80 shadow-sm"
                      )}
                    >
                      <DashboardUserAvatar
                        name={partner.name}
                        avatarUrl={partner.avatarUrl}
                        size="md"
                        className="shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {partner.name}
                          </p>
                          {previewTime && (
                            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                              {format(new Date(previewTime), "h:mm a")}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                          {bookingServiceLabel(conv)}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "truncate text-xs flex-1",
                              conv.unread_count > 0
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {preview}
                          </p>
                          {conv.unread_count > 0 ? (
                            <span
                              className={cn(
                                workspaceUi.frosted.badge.base,
                                workspaceUi.frosted.badge.info
                              )}
                            >
                              {conv.unread_count > 9 ? "9+" : conv.unread_count} new
                            </span>
                          ) : (
                            <span
                              className={cn(
                                workspaceUi.frosted.badge.base,
                                workspaceUi.frosted.badge.good
                              )}
                            >
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </div>

      {/* Conversation pane */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col bg-white/50 dark:bg-card/30 backdrop-blur-sm",
          !activeConversationId ? "hidden md:flex" : "flex"
        )}
      >
        {!activeConversationId ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <p className="text-sm font-medium text-foreground">Select a conversation</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {role === "client"
                ? "Pick a provider thread from the list."
                : "Pick a client thread from the list."}
            </p>
            {totalUnread > 0 && (
              <span
                className={cn(
                  workspaceUi.frosted.badge.base,
                  workspaceUi.frosted.badge.info,
                  "mt-4"
                )}
              >
                {totalUnread} unread
              </span>
            )}
          </div>
        ) : (
          <>
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/30 px-4 md:px-5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setActiveConversationId(null)}
                aria-label="Back to inbox"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {activePartner && activeConversation && (
                <>
                  <DashboardUserAvatar
                    name={activePartner.name}
                    avatarUrl={activePartner.avatarUrl}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {activePartner.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {bookingServiceLabel(activeConversation)}
                    </p>
                  </div>
                  {(activeConversation.booking?.id || activeConversation.booking_id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden rounded-full sm:inline-flex"
                      asChild
                    >
                      <Link
                        href={
                          role === "client"
                            ? `/dashboard/client/bookings/${activeConversation.booking?.id ?? activeConversation.booking_id}`
                            : `/dashboard/provider/bookings/${activeConversation.booking?.id ?? activeConversation.booking_id}`
                        }
                      >
                        View booking
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </header>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-5 md:px-6 kuba-scroll-hidden"
            >
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">No messages in this thread yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Say hello to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, index) => {
                    const isMe = String(msg.sender_id) === String(user?.id);
                    const prev = messages[index - 1];
                    const showDay =
                      !prev ||
                      formatMessageDay(prev.created_at) !== formatMessageDay(msg.created_at);

                    return (
                      <div key={msg.id}>
                        {showDay && (
                          <p className="mb-4 text-center text-[11px] font-medium text-muted-foreground">
                            {formatMessageDay(msg.created_at)}
                          </p>
                        )}
                        <div
                          className={cn(
                            "flex flex-col max-w-[85%]",
                            isMe ? "ml-auto items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 py-2.5 text-[15px] leading-relaxed",
                              isMe
                                ? "rounded-[20px] rounded-br-md bg-foreground text-background shadow-md"
                                : cn(
                                  workspaceUi.frosted.inset,
                                  "rounded-[20px] rounded-bl-md text-foreground shadow-sm"
                                )
                            )}
                          >
                            <p className="whitespace-pre-wrap">{msg.body}</p>
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5 px-1">
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(msg.created_at), "h:mm a")}
                            </span>
                            {isMe &&
                              (msg.read_at ? (
                                <CheckCheck className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <CheckCheck className="h-3.5 w-3.5 text-muted-foreground/40" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="border-t border-border/30 p-4 md:px-5 md:pb-5">
              <form
                onSubmit={handleSendMessage}
                className={cn(
                  workspaceUi.frosted.inset,
                  "flex items-end gap-2 p-2"
                )}
              >
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  rows={1}
                  placeholder="Message"
                  className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
