"use client";

import { StatusBadge } from "@/components/shared/StatusBadge";

/**
 * @deprecated Use `StatusBadge` from `@/components/shared/StatusBadge` with `type="transaction"` instead.
 */
export function PaymentTransactionBadge({ status, className }: { status: string; className?: string }) {
  return <StatusBadge status={status} type="transaction" className={className} />;
}
