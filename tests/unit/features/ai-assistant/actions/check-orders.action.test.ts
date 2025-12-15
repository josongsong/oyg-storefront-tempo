import { describe, it, expect } from 'vitest'
import { handleCheckOrders } from '@/features/ai-assistant/actions/check-orders.action'

describe('handleCheckOrders', () => {
  it('주문 목록을 반환해야 함', async () => {
    const result = await handleCheckOrders()
    
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('timestamp')
    expect(result.role).toBe('assistant')
    expect(result.content).toContain('recent orders')
    expect(result.orders).toBeDefined()
    expect(Array.isArray(result.orders)).toBe(true)
  })

  it('주문 데이터가 올바른 구조여야 함', async () => {
    const result = await handleCheckOrders()
    
    expect(result.orders!.length).toBeGreaterThan(0)
    
    const firstOrder = result.orders![0]
    expect(firstOrder).toHaveProperty('id')
    expect(firstOrder).toHaveProperty('date')
    expect(firstOrder).toHaveProperty('status')
    expect(firstOrder).toHaveProperty('items')
    expect(firstOrder).toHaveProperty('total')
  })

  it('주문 상태가 유효해야 함', async () => {
    const result = await handleCheckOrders()
    const validStatuses = ['delivered', 'in_transit', 'processing']
    
    result.orders!.forEach(order => {
      expect(validStatuses).toContain(order.status)
    })
  })
})

