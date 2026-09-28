import {
  BOOKING_STATUS_FILTER_OPTIONS,
  PAYOUT_STATUS_FILTER_OPTIONS,
  TRANSACTION_STATUS_FILTER_OPTIONS,
  statusFilterOptions,
} from "../status-filters";

describe("statusFilterOptions", () => {
  it("prepends the All Status row with the all sentinel", () => {
    expect(statusFilterOptions(BOOKING_STATUS_FILTER_OPTIONS)).toEqual([
      { label: "All Status", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "In progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ]);
  });

  it("accepts an empty sentinel for filters that send ''", () => {
    const options = statusFilterOptions(TRANSACTION_STATUS_FILTER_OPTIONS, "");
    expect(options[0]).toEqual({ label: "All Status", value: "" });
    expect(options).toHaveLength(4);
  });
});

describe("status filter option tables", () => {
  it("covers every admin booking status, including in_progress", () => {
    const values = BOOKING_STATUS_FILTER_OPTIONS.map((o) => o.value);
    expect(values).toContain("in_progress");
  });

  it("keeps the transaction and payout tables distinct", () => {
    expect(TRANSACTION_STATUS_FILTER_OPTIONS.map((o) => o.value)).toEqual([
      "completed",
      "pending",
      "failed",
    ]);
    expect(PAYOUT_STATUS_FILTER_OPTIONS.map((o) => o.value)).toEqual([
      "pending",
      "processing",
      "paid",
      "rejected",
    ]);
  });
});
