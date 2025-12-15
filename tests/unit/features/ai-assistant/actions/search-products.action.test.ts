import { describe, it, expect } from 'vitest'
import { handleSearchProducts } from '@/features/ai-assistant/actions/search-products.action'

describe('handleSearchProducts', () => {
  it('검색어 없이 호출 시 안내 메시지를 반환해야 함', async () => {
    const result = await handleSearchProducts()
    
    expect(result.role).toBe('assistant')
    expect(result.content).toContain('What product')
  })

  it('검색어와 함께 호출 시 검색 결과를 반환해야 함', async () => {
    const result = await handleSearchProducts({ query: 'cream' })
    
    expect(result.role).toBe('assistant')
    expect(result.content).toContain('cream')
    expect(result.content).toContain('found')
  })

  it('메시지에 ID와 timestamp가 있어야 함', async () => {
    const result = await handleSearchProducts({ query: 'serum' })
    
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('timestamp')
    expect(result.timestamp).toBeInstanceOf(Date)
  })

  it('빈 검색어 처리', async () => {
    const result = await handleSearchProducts({ query: '' })
    
    expect(result.role).toBe('assistant')
    expect(result.content).toBeDefined()
  })
})

