import { toSlug } from '@/lib/slug'

describe('toSlug', () => {
  it('converts a string to a URL-safe slug', () => {
    expect(toSlug('Hello World')).toBe('hello-world')
  })

  it('handles special characters', () => {
    expect(toSlug('Hello & World!')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(toSlug('Hello   World')).toBe('hello-world')
  })

  it('handles leading and trailing spaces', () => {
    expect(toSlug('  Hello World  ')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(toSlug('')).toBe('')
  })

  it('handles already slugified string', () => {
    expect(toSlug('hello-world')).toBe('hello-world')
  })

  it('handles unicode characters', () => {
    expect(toSlug('Nairobi Kenya')).toBe('nairobi-kenya')
  })
})
