import { describe, it, expect } from 'vitest'
import { handleRecommendProducts } from '@/features/ai-assistant/actions/recommend-products.action'

describe('handleRecommendProducts', () => {
  it('추천 상품 목록을 반환해야 함', async () => {
    const result = await handleRecommendProducts()
    
    expect(result.role).toBe('assistant')
    expect(result.content).toBeDefined()
    expect(result.products).toBeDefined()
    expect(Array.isArray(result.products)).toBe(true)
  })

  it('추천 상품이 2개 이상 있어야 함', async () => {
    const result = await handleRecommendProducts()
    
    expect(result.products!.length).toBeGreaterThanOrEqual(2)
  })

  it('각 상품이 올바른 구조여야 함', async () => {
    const result = await handleRecommendProducts()
    
    const product = result.products![0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('image')
    expect(product).toHaveProperty('rating')
  })

  it('메시지 ID가 고유해야 함', async () => {
    const result1 = await handleRecommendProducts()
    const result2 = await handleRecommendProducts()
    
    expect(result1.id).not.toBe(result2.id)
  })

  it('제품 정보가 완전해야 함', async () => {
    const result = await handleRecommendProducts()
    
    result.products!.forEach(product => {
      expect(product.id).toBeDefined()
      expect(product.name).toBeDefined()
      expect(product.price).toBeDefined()
    })
  })
})

