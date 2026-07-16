import { normalizeConversation } from '@/lib/chat-utils'

describe('normalizeMessage', () => {
  it('normalizes a raw message object', () => {
    const { normalizeMessage } = require('@/lib/chat-utils')
    const raw = {
      id: '1',
      sender_id: 'user1',
      body: 'Hello',
      created_at: '2024-01-01',
      read_at: null,
    }
    const result = normalizeMessage(raw)
    expect(result.id).toBe('1')
    expect(result.sender_id).toBe('user1')
    expect(result.body).toBe('Hello')
  })

  it('handles camelCase fields', () => {
    const { normalizeMessage } = require('@/lib/chat-utils')
    const raw = {
      id: '2',
      senderId: 'user2',
      body: 'Hi',
      createdAt: '2024-01-02',
      readAt: null,
    }
    const result = normalizeMessage(raw)
    expect(result.sender_id).toBe('user2')
  })

  it('defaults created_at to now', () => {
    const { normalizeMessage } = require('@/lib/chat-utils')
    const raw = { id: '3', body: 'Test' }
    const result = normalizeMessage(raw)
    expect(result.created_at).toBeTruthy()
  })
})

describe('normalizeConversation', () => {
  it('normalizes a raw conversation', () => {
    const raw = {
      id: 'conv1',
      booking_id: 'bk1',
      customer_id: 'cust1',
      provider_id: 'prov1',
      last_message_at: '2024-01-01',
      unread_count: 2,
      customer: { name: 'John' },
      provider: { user: { name: 'Jane' } },
    }
    const result = normalizeConversation(raw)
    expect(result.id).toBe('conv1')
    expect(result.booking_id).toBe('bk1')
    expect(result.customer_id).toBe('cust1')
    expect(result.unread_count).toBe(2)
  })

  it('defaults missing fields', () => {
    const raw = { id: 'conv2' }
    const result = normalizeConversation(raw)
    expect(result.booking_id).toBe('')
    expect(result.customer_id).toBe('')
    expect(result.provider_id).toBe('')
    expect(result.unread_count).toBe(0)
  })
})

describe('displayUserName', () => {
  it('returns name from user object', () => {
    const { displayUserName } = require('@/lib/chat-utils')
    expect(displayUserName({ name: 'John Doe' })).toBe('John Doe')
  })

  it('returns first_name + last_name if no name', () => {
    const { displayUserName } = require('@/lib/chat-utils')
    expect(displayUserName({ first_name: 'John', last_name: 'Doe' })).toBe('John Doe')
  })

  it('returns Unknown for null', () => {
    const { displayUserName } = require('@/lib/chat-utils')
    expect(displayUserName(null)).toBe('Unknown')
  })

  it('returns Unknown for undefined', () => {
    const { displayUserName } = require('@/lib/chat-utils')
    expect(displayUserName(undefined)).toBe('Unknown')
  })

  it('returns Unknown for empty object', () => {
    const { displayUserName } = require('@/lib/chat-utils')
    expect(displayUserName({})).toBe('Unknown')
  })
})

describe('chatPartner', () => {
  it('returns provider info for client role', () => {
    const { chatPartner } = require('@/lib/chat-utils')
    const conv = {
      provider: {
        business_name: 'Clean Pro',
        user: { name: 'Jane', avatar_url: null },
      },
      customer: { name: 'John' },
    }
    const result = chatPartner(conv, 'client')
    expect(result.name).toBe('Clean Pro')
    expect(result.subtitle).toBe('Provider')
  })

  it('returns customer info for provider role', () => {
    const { chatPartner } = require('@/lib/chat-utils')
    const conv = {
      provider: { user: { name: 'Jane' } },
      customer: { name: 'John', avatar_url: null },
    }
    const result = chatPartner(conv, 'provider')
    expect(result.name).toBe('John')
    expect(result.subtitle).toBe('Client')
  })
})

describe('bookingServiceLabel', () => {
  it('returns service name', () => {
    const { bookingServiceLabel } = require('@/lib/chat-utils')
    const conv = {
      booking: { service: { name: 'Deep Cleaning' } },
    }
    expect(bookingServiceLabel(conv)).toBe('Deep Cleaning')
  })

  it('returns fallback', () => {
    const { bookingServiceLabel } = require('@/lib/chat-utils')
    const conv = { booking: {} }
    expect(bookingServiceLabel(conv)).toBe('Service booking')
  })
})
