import { getMediaUrl } from "@/lib/utils";

const PLACEHOLDER_HOSTS = ["ui-avatars.com", "dicebear.com"];

/** True uploaded avatar only — no auto-generated placeholder URLs */
export function getAvatarDisplayUrl(path: string | null | undefined): string | undefined {
  if (!path?.trim()) return undefined;
  if (PLACEHOLDER_HOSTS.some((h) => path.includes(h))) return undefined;
  if (path.startsWith("/placeholders")) return undefined;

  const resolved = getMediaUrl(path, "avatar");
  if (!resolved || resolved.includes("/placeholders/")) return undefined;
  return resolved;
}

export function getInitials(name?: string | null): string {
  if (!name?.trim()) return "KU";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
