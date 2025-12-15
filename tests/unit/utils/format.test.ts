import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from '@/utils/format'

describe('formatPrice', () => {
  it('should format KRW by default', () => {
    expect(formatPrice(10000)).toBe('₩10,000')
  })

  it('should format USD', () => {
    expect(formatPrice(19.99, 'USD')).toBe('US$20')
  })

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('₩0')
  })

  it('should handle large numbers', () => {
    const result = formatPrice(1234567890)
    expect(result).toContain('1,234,567,890')
  })
})

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toContain('2024')
    expect(result).toContain('1')
    expect(result).toContain('15')
  })

  it('should format string date', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
  })

  it('should handle custom options', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date, { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    })
    expect(result).toBeTruthy()
  })
})
