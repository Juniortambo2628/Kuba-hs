export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | string;

const BOOKING_STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  cancelled: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
};

const REVIEW_STATUS_CLASSES: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  hidden: 'bg-rose-100 text-rose-700 border-rose-200',
  resolved: 'bg-blue-100 text-blue-700 border-blue-200',
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-emerald-500 text-white',
  pending: 'bg-amber-500 text-white',
  failed: 'bg-red-500 text-white',
  refunded: 'bg-slate-500 text-white',
  pending_cash: 'bg-amber-500 text-white',
};

export function getBookingStatusClasses(status: BookingStatus, fallback = 'bg-muted text-muted-foreground border-border'): string {
  return BOOKING_STATUS_CLASSES[status.toLowerCase()] ?? fallback;
}

export function getReviewStatusClasses(status: string): string {
  return REVIEW_STATUS_CLASSES[status.toLowerCase()] ?? 'bg-gray-100 text-gray-700 border-gray-200';
}

export function getPaymentStatusClasses(status: string): string {
  return PAYMENT_STATUS_CLASSES[status.toLowerCase()] ?? 'bg-muted text-muted-foreground';
}

const COMPLIANCE_STATUS_CLASSES: Record<string, string> = {
  compliant:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
  non_compliant:
    'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20',
  expiring_soon:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
  pending:
    'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
};

const COMPLIANCE_STATUS_LABELS: Record<string, string> = {
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
  expiring_soon: 'Expiring Soon',
  pending: 'Pending Review',
};

const TRANSACTION_STATUS_CLASSES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  pending: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  processing: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  failed: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  completed: 'Successful',
  paid: 'Successful',
  success: 'Successful',
  pending: 'Pending',
  processing: 'Pending',
  failed: 'Failed',
};

export function getComplianceStatusClasses(status: string): string {
  return COMPLIANCE_STATUS_CLASSES[status.toLowerCase()] ?? COMPLIANCE_STATUS_CLASSES.pending;
}

export function getComplianceStatusLabel(status: string): string {
  return COMPLIANCE_STATUS_LABELS[status.toLowerCase()] ?? 'Pending Review';
}

export function getTransactionStatusClasses(status: string): string {
  return (
    TRANSACTION_STATUS_CLASSES[status.toLowerCase()] ??
    'bg-muted text-muted-foreground border-border'
  );
}

export function getTransactionStatusLabel(status: string): string {
  return TRANSACTION_STATUS_LABELS[status.toLowerCase()] ?? status;
}

const PAYOUT_STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  processing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function getPayoutStatusClasses(status: string): string {
  return PAYOUT_STATUS_CLASSES[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';
}

const CONTACT_STATUS_CLASSES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  read: 'bg-muted text-muted-foreground border-border',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
};

export function getContactStatusClasses(status: string): string {
  return CONTACT_STATUS_CLASSES[status.toLowerCase()] ?? CONTACT_STATUS_CLASSES.read;
}

const VERIFICATION_DOC_STATUS_CLASSES: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  expired: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

export function getVerificationDocStatusClasses(status: string, isExpired = false): string {
  if (isExpired) return VERIFICATION_DOC_STATUS_CLASSES.expired;
  return VERIFICATION_DOC_STATUS_CLASSES[status.toLowerCase()] ?? VERIFICATION_DOC_STATUS_CLASSES.pending;
}

export function getVerificationDocStatusLabel(status: string, isExpired = false): string {
  if (isExpired) return 'Expired';
  const labels: Record<string, string> = {
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
  };
  return labels[status.toLowerCase()] ?? 'Pending';
}

/** Accent strip on booking cards (provider/admin views) */
export function getBookingStatusAccentClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-600';
    case 'pending':
      return 'bg-amber-400';
    case 'cancelled':
      return 'bg-sky-500';
    default:
      return 'bg-blue-600';
  }
}

export type DashboardBadgeType = 'booking' | 'user' | 'role' | 'payment' | 'status' | 'priority';

const ROLE_STATUS_CLASSES: Record<string, string> = {
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  provider: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  customer: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
  client: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
};

const DASHBOARD_GENERAL_STATUS_CLASSES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  processing: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  suspended: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  hidden: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

export function getDashboardStatusClasses(status: string, type: DashboardBadgeType = 'status'): string {
  const key = status.toLowerCase();
  if (type === 'role') {
    return ROLE_STATUS_CLASSES[key] ?? ROLE_STATUS_CLASSES.customer;
  }
  if (type === 'booking') {
    return getBookingStatusClasses(status);
  }
  if (type === 'payment') {
    return getTransactionStatusClasses(status);
  }
  return DASHBOARD_GENERAL_STATUS_CLASSES[key] ?? 'bg-muted text-muted-foreground border-border';
}

const MESSAGE_TYPE_CLASSES: Record<string, string> = {
  contact: 'bg-blue-500/10 text-blue-600',
  quote: 'bg-amber-500/10 text-amber-600',
  feedback: 'bg-emerald-500/10 text-emerald-600',
};

export function getMessageTypeClasses(type: string): string {
  return MESSAGE_TYPE_CLASSES[type] ?? 'bg-muted text-muted-foreground';
}
