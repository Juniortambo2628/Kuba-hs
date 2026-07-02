import { getAvatarDisplayUrl } from "@/lib/avatar-url";
import { extractApiList } from "@/lib/api-response";
import type { Conversation, Message, User } from "@/types";

/** @deprecated Use extractApiList from "@/lib/api-response" directly. */
export const unwrapResourceList = extractApiList;

export function unwrapResource<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;
  if ("data" in payload && (payload as { data: unknown }).data) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function displayUserName(user?: Partial<User> | null): string {
  if (!user) return "Unknown";
  const name = user.name?.trim();
  if (name) return name;
  const parts = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return parts || "Unknown";
}

export function chatPartner(
  conv: Conversation,
  role: "client" | "provider"
): { name: string; avatarUrl: string | null; subtitle: string } {
  if (role === "client") {
    const u = conv.provider?.user;
    return {
      name: conv.provider?.business_name || displayUserName(u),
      avatarUrl: getAvatarDisplayUrl(u?.avatar_url) ?? null,
      subtitle: "Provider",
    };
  }
  return {
    name: displayUserName(conv.customer),
    avatarUrl: getAvatarDisplayUrl(conv.customer?.avatar_url) ?? null,
    subtitle: "Client",
  };
}

export function bookingServiceLabel(conv: Conversation): string {
  return conv.booking?.service?.name ?? "Service booking";
}

export function normalizeMessage(raw: Record<string, unknown>): Message {
  return {
    id: String(raw.id),
    sender_id: String(raw.sender_id ?? raw.senderId ?? ""),
    body: String(raw.body ?? ""),
    created_at: String(raw.created_at ?? raw.createdAt ?? new Date().toISOString()),
    read_at: (raw.read_at ?? raw.readAt ?? null) as string | null,
    sender: raw.sender as User | undefined,
  };
}

export function normalizeConversation(raw: Record<string, unknown>): Conversation {
  const latest =
    (raw.latestMessage as Message | undefined) ??
    (raw.latest_message as Message | undefined);

  const bookingRaw = (raw.booking ?? {}) as Record<string, unknown>;

  return {
    id: String(raw.id),
    booking_id: String(raw.booking_id ?? bookingRaw.id ?? ""),
    customer_id: String(raw.customer_id ?? ""),
    provider_id: String(raw.provider_id ?? ""),
    last_message_at: String(raw.last_message_at ?? raw.lastMessageAt ?? ""),
    unread_count: Number(raw.unread_count ?? raw.unreadCount ?? 0),
    customer: (raw.customer ?? {}) as User,
    provider: (raw.provider ?? { user: {} }) as Conversation["provider"],
    booking: bookingRaw
      ? ({
          id: bookingRaw.id ? String(bookingRaw.id) : undefined,
          booking_number: bookingRaw.booking_number as string | undefined,
          status: bookingRaw.status as string | undefined,
          service: (bookingRaw.service as { name?: string })?.name
            ? { name: String((bookingRaw.service as { name: string }).name) }
            : null,
        } as Conversation["booking"])
      : undefined,
    latestMessage: latest
      ? normalizeMessage(latest as unknown as Record<string, unknown>)
      : undefined,
  };
}
