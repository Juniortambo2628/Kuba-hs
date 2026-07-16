import { API } from '@/lib/api-endpoints'

describe('API endpoints', () => {
  it('has auth endpoints', () => {
    expect(API.auth.login).toBe('/api/auth/login')
    expect(API.auth.register).toBe('/api/auth/register')
    expect(API.auth.logout).toBe('/api/auth/logout')
  })

  it('has marketplace endpoints', () => {
    expect(API.marketplace.categories).toBe('/api/categories')
    expect(API.marketplace.featuredServices).toBe('/api/featured-services')
    expect(API.marketplace.faqs).toBe('/api/faqs')
    expect(API.marketplace.testimonials).toBe('/api/testimonials')
  })

  it('has client endpoints', () => {
    expect(API.client.bookings).toBe('/api/client/bookings')
    expect(API.client.addresses).toBe('/api/client/addresses')
    expect(API.client.dashboard).toBe('/api/client/dashboard')
  })

  it('has provider endpoints', () => {
    expect(API.provider.bookings).toBe('/api/provider/bookings')
    expect(API.provider.dashboard).toBe('/api/provider/dashboard')
    expect(API.provider.services).toBe('/api/provider/services')
  })

  it('has admin endpoints', () => {
    expect(API.admin.dashboard).toBe('/api/admin/dashboard')
    expect(API.admin.bookings).toBe('/api/admin/bookings')
    expect(API.admin.users).toBe('/api/admin/users')
    expect(API.admin.providers).toBe('/api/admin/providers')
  })

  it('has chat endpoints', () => {
    expect(API.chat.conversations).toBe('/api/chat/conversations')
    expect(API.chat.messages).toBe('/api/chat/messages')
  })

  it('has payment endpoints', () => {
    expect(API.payments.mpesaStkPush).toBe('/api/payments/mpesa/stk-push')
    expect(API.payments.paystackInit).toBe('/api/payments/paystack/initialize')
    expect(API.payments.paystackVerify).toBe('/api/payments/paystack/verify')
  })

  it('has media endpoints', () => {
    expect(API.media.upload).toBe('/api/media/upload')
  })
})
