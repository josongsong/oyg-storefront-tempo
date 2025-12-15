import { describe, it, expect } from 'vitest'
import { handleCheckPoints } from '@/features/ai-assistant/actions/check-points.action'

describe('handleCheckPoints', () => {
  it('포인트 정보를 반환해야 함', async () => {
    const result = await handleCheckPoints()
    
    expect(result.role).toBe('assistant')
    expect(result.content).toContain('point')
    expect(result.content).toContain('balance')
  })

  it('메시지에 필수 속성이 있어야 함', async () => {
    const result = await handleCheckPoints()
    
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('timestamp')
    expect(result).toHaveProperty('role')
    expect(result).toHaveProperty('content')
  })

  it('포인트 금액이 포함되어야 함', async () => {
    const result = await handleCheckPoints()
    
    expect(result.content).toMatch(/\d+/)
  })

  it('timestamp가 Date 객체여야 함', async () => {
    const result = await handleCheckPoints()
    
    expect(result.timestamp).toBeInstanceOf(Date)
  })
})

