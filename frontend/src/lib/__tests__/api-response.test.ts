import { normalizeApiResponse, extractApiList } from '@/lib/api-response'

describe('normalizeApiResponse', () => {
  it('unwraps booking envelope', () => {
    const response = { booking: { id: 1, name: 'Test' } }
    expect(normalizeApiResponse(response)).toEqual({ id: 1, name: 'Test' })
  })

  it('unwraps data envelope', () => {
    const response = { data: { id: 1, name: 'Test' } }
    expect(normalizeApiResponse(response)).toEqual({ id: 1, name: 'Test' })
  })

  it('returns response as-is if no booking or data property', () => {
    const response = { id: 1, name: 'Test' }
    expect(normalizeApiResponse(response)).toEqual(response)
  })

  it('handles null response', () => {
    expect(normalizeApiResponse(null)).toBeNull()
  })

  it('handles undefined response', () => {
    expect(normalizeApiResponse(undefined)).toBeUndefined()
  })

  it('handles primitive response', () => {
    expect(normalizeApiResponse('hello')).toBe('hello')
  })
})

describe('extractApiList', () => {
  it('extracts array from Laravel data envelope', () => {
    const response = {
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    }
    const result = extractApiList(response)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 1, name: 'Item 1' })
  })

  it('extracts array from plain array', () => {
    const response = [{ id: 1 }]
    expect(extractApiList(response)).toHaveLength(1)
  })

  it('returns empty array for empty response', () => {
    expect(extractApiList({ data: [] })).toHaveLength(0)
  })

  it('returns empty array for null response', () => {
    expect(extractApiList(null)).toHaveLength(0)
  })

  it('returns empty array for object without data', () => {
    expect(extractApiList({ foo: 'bar' })).toHaveLength(0)
  })
})
