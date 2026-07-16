import { serviceDetailHref } from '@/lib/service-urls'
import { providerHref } from '@/lib/provider-urls'

describe('serviceDetailHref', () => {
  it('builds service detail URL from name', () => {
    const result = serviceDetailHref({ name: 'Deep Cleaning' })
    expect(result).toBe('/services/deep-cleaning')
  })

  it('uses slug if provided', () => {
    const result = serviceDetailHref({ name: 'Deep Cleaning', slug: 'premium-clean' })
    expect(result).toBe('/services/premium-clean')
  })

  it('handles nested service object', () => {
    const result = serviceDetailHref({ name: 'Other', service: { name: 'Carpet Wash' } })
    expect(result).toBe('/services/carpet-wash')
  })

  it('prefers slug over nested service slug', () => {
    const result = serviceDetailHref({
      name: 'Other',
      slug: 'my-slug',
      service: { name: 'Nested', slug: 'nested-slug' },
    })
    expect(result).toBe('/services/my-slug')
  })
})

describe('providerHref', () => {
  it('builds provider detail URL from slug', () => {
    const result = providerHref({ slug: 'clean-pro-services' })
    expect(result).toBe('/providers/clean-pro-services')
  })

  it('builds URL from business_name', () => {
    const result = providerHref({ business_name: 'Clean Pro' })
    expect(result).toBe('/providers/clean-pro')
  })

  it('falls back to id', () => {
    const result = providerHref({ id: 42 })
    expect(result).toBe('/providers/42')
  })

  it('prefers slug over id', () => {
    const result = providerHref({ id: 42, slug: 'my-provider' })
    expect(result).toBe('/providers/my-provider')
  })

  it('returns /providers if nothing provided', () => {
    const result = providerHref({})
    expect(result).toBe('/providers')
  })
})
