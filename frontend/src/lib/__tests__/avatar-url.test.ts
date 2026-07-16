import { getInitials, getAvatarDisplayUrl } from '@/lib/avatar-url'

describe('getInitials', () => {
  it('returns two initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('returns first two chars for single name', () => {
    expect(getInitials('John')).toBe('JO')
  })

  it('returns two initials for multi-word names', () => {
    expect(getInitials('John Michael Doe')).toBe('JD')
  })

  it('returns KU for empty string', () => {
    expect(getInitials('')).toBe('KU')
  })

  it('returns KU for undefined', () => {
    expect(getInitials(undefined)).toBe('KU')
  })

  it('returns KU for null', () => {
    expect(getInitials(null)).toBe('KU')
  })

  it('returns KU for whitespace-only string', () => {
    expect(getInitials('   ')).toBe('KU')
  })

  it('capitalizes initials', () => {
    expect(getInitials('john doe')).toBe('JD')
  })
})

describe('getAvatarDisplayUrl', () => {
  it('returns resolved URL for valid avatar path', () => {
    const result = getAvatarDisplayUrl('/storage/avatars/user1.jpg')
    expect(result).toBeTruthy()
    expect(result).toContain('user1.jpg')
  })

  it('returns undefined for null', () => {
    expect(getAvatarDisplayUrl(null)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getAvatarDisplayUrl('')).toBeUndefined()
  })

  it('returns undefined for placeholder hosts', () => {
    expect(getAvatarDisplayUrl('https://ui-avatars.com/api/')).toBeUndefined()
  })

  it('returns undefined for dicebear', () => {
    expect(getAvatarDisplayUrl('https://dicebear.com/avatars/abc.svg')).toBeUndefined()
  })

  it('returns undefined for /placeholders path', () => {
    expect(getAvatarDisplayUrl('/placeholders/avatar.png')).toBeUndefined()
  })
})
