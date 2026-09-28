export interface StatusFilterOption {
  label: string;
  value: string;
}

export const BOOKING_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const TRANSACTION_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export const PAYOUT_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
  { label: "Rejected", value: "rejected" },
];

export function statusFilterOptions(
  statuses: StatusFilterOption[],
  allValue = "all"
): StatusFilterOption[] {
  return [{ label: "All Status", value: allValue }, ...statuses];
}
