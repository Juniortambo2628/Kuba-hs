import {
  getBookingStatusClasses,
  getPaymentStatusClasses,
  getComplianceStatusClasses,
  getComplianceStatusLabel,
  getTransactionStatusClasses,
  getTransactionStatusLabel,
  getBookingStatusAccentClass,
  getReviewStatusClasses,
  getPayoutStatusClasses,
  getContactStatusClasses,
} from '@/lib/status-styles'

describe('getBookingStatusClasses', () => {
  it('returns classes for pending', () => {
    const classes = getBookingStatusClasses('pending')
    expect(classes).toContain('amber')
  })

  it('returns classes for confirmed', () => {
    const classes = getBookingStatusClasses('confirmed')
    expect(classes).toContain('blue')
  })

  it('returns classes for in_progress', () => {
    const classes = getBookingStatusClasses('in_progress')
    expect(classes).toContain('blue')
  })

  it('returns classes for completed', () => {
    const classes = getBookingStatusClasses('completed')
    expect(classes).toContain('emerald')
  })

  it('returns classes for cancelled', () => {
    const classes = getBookingStatusClasses('cancelled')
    expect(classes).toContain('sky')
  })

  it('returns fallback for unknown status', () => {
    const classes = getBookingStatusClasses('unknown')
    expect(classes).toContain('muted')
  })
})

describe('getPaymentStatusClasses', () => {
  it('returns classes for paid', () => {
    const classes = getPaymentStatusClasses('paid')
    expect(classes).toContain('emerald')
  })

  it('returns classes for pending', () => {
    const classes = getPaymentStatusClasses('pending')
    expect(classes).toContain('amber')
  })

  it('returns classes for failed', () => {
    const classes = getPaymentStatusClasses('failed')
    expect(classes).toContain('red')
  })

  it('returns classes for refunded', () => {
    const classes = getPaymentStatusClasses('refunded')
    expect(classes).toContain('slate')
  })
})

describe('getComplianceStatusClasses', () => {
  it('returns classes for compliant', () => {
    const classes = getComplianceStatusClasses('compliant')
    expect(classes).toContain('emerald')
  })

  it('returns classes for pending', () => {
    const classes = getComplianceStatusClasses('pending')
    expect(classes).toContain('blue')
  })

  it('returns classes for non_compliant', () => {
    const classes = getComplianceStatusClasses('non_compliant')
    expect(classes).toContain('rose')
  })

  it('returns classes for expiring_soon', () => {
    const classes = getComplianceStatusClasses('expiring_soon')
    expect(classes).toContain('amber')
  })
})

describe('getComplianceStatusLabel', () => {
  it('returns label for compliant', () => {
    expect(getComplianceStatusLabel('compliant')).toBe('Compliant')
  })

  it('returns label for pending', () => {
    expect(getComplianceStatusLabel('pending')).toBe('Pending Review')
  })

  it('returns label for non_compliant', () => {
    expect(getComplianceStatusLabel('non_compliant')).toBe('Non-Compliant')
  })

  it('returns label for expiring_soon', () => {
    expect(getComplianceStatusLabel('expiring_soon')).toBe('Expiring Soon')
  })
})

describe('getTransactionStatusClasses', () => {
  it('returns classes for completed', () => {
    const classes = getTransactionStatusClasses('completed')
    expect(classes).toContain('emerald')
  })

  it('returns classes for pending', () => {
    const classes = getTransactionStatusClasses('pending')
    expect(classes).toContain('amber')
  })

  it('returns classes for failed', () => {
    const classes = getTransactionStatusClasses('failed')
    expect(classes).toContain('red')
  })
})

describe('getTransactionStatusLabel', () => {
  it('returns label for completed', () => {
    expect(getTransactionStatusLabel('completed')).toBe('Successful')
  })

  it('returns label for pending', () => {
    expect(getTransactionStatusLabel('pending')).toBe('Pending')
  })

  it('returns label for failed', () => {
    expect(getTransactionStatusLabel('failed')).toBe('Failed')
  })
})

describe('getBookingStatusAccentClass', () => {
  it('returns accent for completed', () => {
    expect(getBookingStatusAccentClass('completed')).toBe('bg-emerald-600')
  })

  it('returns accent for pending', () => {
    expect(getBookingStatusAccentClass('pending')).toBe('bg-amber-400')
  })

  it('returns accent for cancelled', () => {
    expect(getBookingStatusAccentClass('cancelled')).toBe('bg-sky-500')
  })

  it('returns default accent for in_progress', () => {
    expect(getBookingStatusAccentClass('in_progress')).toBe('bg-blue-600')
  })
})

describe('getReviewStatusClasses', () => {
  it('returns classes for published', () => {
    expect(getReviewStatusClasses('published')).toContain('emerald')
  })

  it('returns classes for hidden', () => {
    expect(getReviewStatusClasses('hidden')).toContain('rose')
  })
})

describe('getPayoutStatusClasses', () => {
  it('returns classes for paid', () => {
    expect(getPayoutStatusClasses('paid')).toContain('emerald')
  })

  it('returns classes for pending', () => {
    expect(getPayoutStatusClasses('pending')).toContain('amber')
  })

  it('returns classes for rejected', () => {
    expect(getPayoutStatusClasses('rejected')).toContain('red')
  })
})

describe('getContactStatusClasses', () => {
  it('returns classes for new', () => {
    expect(getContactStatusClasses('new')).toContain('blue')
  })

  it('returns classes for replied', () => {
    expect(getContactStatusClasses('replied')).toContain('emerald')
  })
})
