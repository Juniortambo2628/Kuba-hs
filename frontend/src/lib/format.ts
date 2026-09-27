export function formatCurrency(value: number | string | null | undefined): string {
  return `KES ${Number(value ?? 0).toLocaleString()}`;
}

export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(value).toLocaleDateString(undefined, options);
}
