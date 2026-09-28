import { getApiBaseUrl, getBackendOrigin, getBackendWebUrl } from '@/lib/api-base-url'
import { getMediaUrl } from '@/lib/utils'

describe('getApiBaseUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns empty string on client when NEXT_PUBLIC_API_URL is empty', () => {
    process.env.NEXT_PUBLIC_API_URL = ''
    expect(getApiBaseUrl()).toBe('')
  })

  it('returns the configured URL on client when origin matches', () => {
    process.env.NEXT_PUBLIC_API_URL = window.location.origin + '/api'
    const result = getApiBaseUrl()
    expect(typeof result).toBe('string')
  })

  it('returns empty string when configured URL origin differs from window', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://different-origin.example.com/api'
    expect(getApiBaseUrl()).toBe('')
  })

  it('strips trailing /api from configured URL when origin matches', () => {
    const base = window.location.origin
    process.env.NEXT_PUBLIC_API_URL = base + '/api'
    const result = getApiBaseUrl()
    expect(result).toBe(base)
  })
})

describe('getBackendWebUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns explicit BACKEND_URL when set', () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://backend.example.com'
    expect(getBackendWebUrl()).toBe('http://backend.example.com')
  })

  it('returns configured API URL when no explicit backend URL', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://api.example.com/api'
    expect(getBackendWebUrl()).toBe('http://api.example.com')
  })

  it('returns window.location.origin when nothing is set (jsdom)', () => {
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_BACKEND_URL
    expect(getBackendWebUrl()).toBe(window.location.origin)
  })
})

describe('getBackendOrigin', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('defaults to the local Laravel origin', () => {
    delete process.env.NEXT_PUBLIC_API_URL
    expect(getBackendOrigin()).toBe('http://127.0.0.1:8000')
  })

  it('strips /api and any trailing slash', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api'
    expect(getBackendOrigin()).toBe('https://api.example.com')

    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api/'
    expect(getBackendOrigin()).toBe('https://api.example.com')

    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/'
    expect(getBackendOrigin()).toBe('https://api.example.com')
  })

  it('ignores window.location.origin, so SSR and browser agree', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api'
    expect(getBackendOrigin()).toBe('https://api.example.com')
    // jsdom's origin is http://localhost, so the helper is clearly not reading it
    expect(window.location.origin).not.toBe('https://api.example.com')
  })

  it('is the origin getMediaUrl builds storage URLs from', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api'
    const media = getMediaUrl('/storage/abc.jpg')
    expect(media.startsWith(getBackendOrigin())).toBe(true)
  })
})
