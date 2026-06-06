"use client";

import { useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { useApiData } from "@/hooks/useApiData";
import { extractApiList } from "@/lib/api-response";
import { toast } from "sonner";

export type InboxMessageType = "contact" | "feedback" | "quote";

export interface UnifiedInboxMessage {
  id: string | number;
  type: InboxMessageType;
  sender: string;
  subject: string;
  content: string;
  status: string;
  created_at: string;
  meta?: Record<string, unknown>;
}

export function resolvedStatusFor(type: InboxMessageType): string {
  if (type === "contact") return "replied";
  if (type === "feedback") return "resolved";
  return "contacted";
}

export function archiveStatusFor(type: InboxMessageType): string {
  if (type === "contact") return "read";
  if (type === "feedback") return "hidden";
  return "rejected";
}

export function isInboxActionable(type: InboxMessageType, status: string): boolean {
  return status !== resolvedStatusFor(type);
}

function normalizeContact(m: Record<string, unknown>): UnifiedInboxMessage {
  return {
    id: m.id as string | number,
    type: "contact",
    sender: String(m.name ?? ""),
    subject: String(m.subject || "General Inquiry"),
    content: String(m.message ?? ""),
    status: String(m.status ?? "new"),
    created_at: String(m.created_at ?? ""),
    meta: { email: m.email, phone: m.phone },
  };
}

function normalizeFeedback(f: Record<string, unknown>): UnifiedInboxMessage {
  const customer = f.customer as { name?: string } | undefined;
  const user = f.user as { name?: string } | undefined;
  return {
    id: f.id as string | number,
    type: "feedback",
    sender: customer?.name || user?.name || "Anonymous User",
    subject: "User Feedback",
    content: String(f.comment ?? ""),
    status: String(f.status ?? "published"),
    created_at: String(f.created_at ?? ""),
    meta: { rating: f.rating },
  };
}

function normalizeQuote(q: Record<string, unknown>): UnifiedInboxMessage {
  return {
    id: q.id as string | number,
    type: "quote",
    sender: String(q.organization_name ?? ""),
    subject: `RFP: ${q.service_category ?? "Service"}`,
    content: String(q.description ?? ""),
    status: String(q.status ?? "pending"),
    created_at: String(q.created_at ?? ""),
    meta: { contact: q.contact_person, email: q.email },
  };
}

export function useAdminInbox() {
  const {
    data: contactRaw,
    refetch: refetchContacts,
    isLoading: contactLoading,
  } = useApiData<unknown>("/api/admin/contact", { initialData: null });

  const {
    data: feedbackRaw,
    refetch: refetchFeedback,
    isLoading: feedbackLoading,
  } = useApiData<unknown>("/api/admin/feedback", { preserveEnvelope: true, initialData: null });

  const {
    data: quoteRaw,
    refetch: refetchQuotes,
    isLoading: quotesLoading,
  } = useApiData<unknown>("/api/admin/quotes", { initialData: null });

  const { data: summary, isLoading: summaryLoading } = useApiData<{
    counts?: { contacts?: number; feedback?: number; quotes?: number; total?: number };
    recent?: unknown[];
  }>("/api/admin/messages-summary", { initialData: null });

  const messages = useMemo(() => {
    const contactList = extractApiList<Record<string, unknown>>(contactRaw);
    const feedbackList = extractApiList<Record<string, unknown>>(feedbackRaw);
    const quoteList = extractApiList<Record<string, unknown>>(quoteRaw);

    return [
      ...contactList.map(normalizeContact),
      ...feedbackList.map(normalizeFeedback),
      ...quoteList.map(normalizeQuote),
    ].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [contactRaw, feedbackRaw, quoteRaw]);

  const refetchAll = useCallback(() => {
    refetchContacts();
    refetchFeedback();
    refetchQuotes();
  }, [refetchContacts, refetchFeedback, refetchQuotes]);

  const updateStatus = useCallback(
    async (msg: UnifiedInboxMessage, newStatus: string) => {
      try {
        const endpoint =
          msg.type === "contact"
            ? `/api/admin/contact/${msg.id}/status`
            : msg.type === "feedback"
              ? `/api/admin/feedback/${msg.id}`
              : `/api/admin/quotes/${msg.id}/status`;

        if (msg.type === "feedback") {
          await axiosInstance.put(endpoint, { status: newStatus });
        } else {
          await axiosInstance.patch(endpoint, { status: newStatus });
        }
        toast.success("Status updated");
        refetchAll();
      } catch {
        toast.error("Failed to update status");
        throw new Error("inbox update failed");
      }
    },
    [refetchAll]
  );

  const markResolved = useCallback(
    (msg: UnifiedInboxMessage) => updateStatus(msg, resolvedStatusFor(msg.type)),
    [updateStatus]
  );

  const archive = useCallback(
    (msg: UnifiedInboxMessage) => updateStatus(msg, archiveStatusFor(msg.type)),
    [updateStatus]
  );

  const deleteMessage = useCallback(
    async (msg: UnifiedInboxMessage) => {
      const endpoint =
        msg.type === "contact"
          ? `/api/admin/contact/${msg.id}`
          : msg.type === "feedback"
            ? `/api/admin/feedback/${msg.id}`
            : `/api/admin/quotes/${msg.id}`;
      await axiosInstance.delete(endpoint);
      toast.success("Removed from inbox");
      refetchAll();
    },
    [refetchAll]
  );

  return {
    messages,
    summary,
    isLoading: contactLoading || feedbackLoading || quotesLoading || summaryLoading,
    refetchAll,
    updateStatus,
    markResolved,
    archive,
    deleteMessage,
  };
}
