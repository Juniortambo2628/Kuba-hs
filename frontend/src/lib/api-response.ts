/**
 * Normalizes Laravel API JSON shapes into a single payload for hooks/components.
 */
export function normalizeApiResponse<T = unknown>(payload: unknown): T {
  if (payload === null || payload === undefined) {
    return payload as T;
  }

  if (typeof payload !== 'object') {
    return payload as T;
  }

  const record = payload as Record<string, unknown>;

  if ('booking' in record && record.booking !== undefined) {
    return record.booking as T;
  }

  if ('data' in record && record.data !== undefined) {
    return record.data as T;
  }

  return payload as T;
}

/** Laravel paginator, resource collection, or plain array → item list */
export function extractApiList<T = unknown>(payload: unknown): T[] {
  const normalized = normalizeApiResponse<T[] | Record<string, unknown>>(payload);

  if (Array.isArray(normalized)) {
    return normalized as T[];
  }

  if (normalized && typeof normalized === "object" && Array.isArray((normalized as { data?: unknown }).data)) {
    return (normalized as { data: T[] }).data;
  }

  return [];
}
