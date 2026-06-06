/**
 * Laravel JsonResource collections nested in JSON responses are shaped as `{ data: T[] }`.
 * Paginated endpoints use the same top-level `data` key on the axios response body.
 */
export function unwrapResourceList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return [];
}
