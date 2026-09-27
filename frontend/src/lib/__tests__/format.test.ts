import { formatCurrency, formatDate } from "../format";

describe("formatCurrency", () => {
  it("renders the same KES + grouped-number string the app used inline", () => {
    expect(formatCurrency(1234567)).toBe(`KES ${Number(1234567).toLocaleString()}`);
    expect(formatCurrency("2500")).toBe(`KES ${Number("2500").toLocaleString()}`);
    expect(formatCurrency(0)).toBe(`KES ${Number(0).toLocaleString()}`);
  });

  it("treats null and undefined as zero instead of printing NaN", () => {
    expect(formatCurrency(null)).toBe(`KES ${Number(0).toLocaleString()}`);
    expect(formatCurrency(undefined)).toBe(`KES ${Number(0).toLocaleString()}`);
  });
});

describe("formatDate", () => {
  const iso = "2026-01-05T00:00:00.000Z";

  it("matches new Date(x).toLocaleDateString()", () => {
    expect(formatDate(iso)).toBe(new Date(iso).toLocaleDateString());
    expect(formatDate(new Date(iso))).toBe(new Date(iso).toLocaleDateString());
  });

  it("passes options through unchanged", () => {
    const options = { day: "2-digit", month: "short" } as const;
    expect(formatDate(iso, options)).toBe(new Date(iso).toLocaleDateString(undefined, options));
  });

  it("passes an invalid date through as Invalid Date", () => {
    expect(formatDate("not-a-date")).toBe(new Date("not-a-date").toLocaleDateString());
  });
});
