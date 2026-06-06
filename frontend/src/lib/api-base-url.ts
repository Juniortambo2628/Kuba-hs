/**
 * API base URL for browser vs server.
 * Client uses same-origin `/api` (Next rewrite → Laravel) when the configured API host differs,
 * avoiding CORS "Network Error" when NEXT_PUBLIC_API_URL is missing or points at :8000 while the app runs on :3000.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (typeof window === "undefined") {
    const base = configured || "http://127.0.0.1:8000";
    return base.replace(/\/api\/?$/, "");
  }

  if (!configured) {
    return "";
  }

  try {
    const normalized = configured.replace(/\/$/, "");
    const apiOrigin = new URL(
      normalized.endsWith("/api") ? normalized.slice(0, -4) : normalized
    ).origin;
    if (apiOrigin !== window.location.origin) {
      return "";
    }
    return normalized.replace(/\/api\/?$/, "");
  } catch {
    return configured;
  }
}

/** Laravel web routes (OAuth, Sanctum) — always the backend origin, not Next `/api` proxy. */
export function getBackendWebUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const explicit = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/api\/?$/, "");
  }
  if (configured) {
    return configured.replace(/\/api\/?$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://127.0.0.1:8000";
}
