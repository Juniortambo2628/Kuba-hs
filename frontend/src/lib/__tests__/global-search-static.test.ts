import { dedupeSearchEntries } from '@/config/global-search-static'

describe('dedupeSearchEntries', () => {
  it('removes duplicate entries by category:id', () => {
    const entries = [
      { id: '1', title: 'Bookings', url: '/bookings', category: 'Bookings' },
      { id: '1', title: 'Bookings Copy', url: '/bookings-copy', category: 'Bookings' },
      { id: '2', title: 'Services', url: '/services', category: 'Pages' },
    ]
    const result = dedupeSearchEntries(entries)
    expect(result).toHaveLength(2)
  })

  it('allows same id in different categories', () => {
    const entries = [
      { id: '1', title: 'Bookings', url: '/a', category: 'Client' },
      { id: '1', title: 'Bookings', url: '/b', category: 'Provider' },
    ]
    const result = dedupeSearchEntries(entries)
    expect(result).toHaveLength(2)
  })

  it('keeps the first occurrence', () => {
    const entries = [
      { id: '1', title: 'Bookings', url: '/a', category: 'Bookings' },
      { id: '1', title: 'Bookings Alt', url: '/b', category: 'Bookings' },
    ]
    const result = dedupeSearchEntries(entries)
    expect(result[0].url).toBe('/a')
  })

  it('handles empty array', () => {
    expect(dedupeSearchEntries([])).toEqual([])
  })

  it('handles single entry', () => {
    const entries = [{ id: '1', title: 'Test', url: '/test', category: 'Pages' }]
    expect(dedupeSearchEntries(entries)).toHaveLength(1)
  })
})
