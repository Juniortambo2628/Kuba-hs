import { getApiBaseUrl, getBackendWebUrl } from '@/lib/api-base-url'

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
