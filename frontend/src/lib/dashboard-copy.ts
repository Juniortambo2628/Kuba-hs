/** Human-readable labels for dashboard UI (no uppercase jargon). */

export function formatStatusLabel(value: string | null | undefined): string {
  if (!value) return "Unknown";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDocumentType(type: string): string {
  const map: Record<string, string> = {
    id_card: "Government ID",
    business_license: "Business license",
    certification: "Certification",
  };
  return map[type] ?? formatStatusLabel(type);
}
