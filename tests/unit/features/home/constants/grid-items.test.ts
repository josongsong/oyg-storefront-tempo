import { describe, it, expect } from 'vitest'
import { GRID_ITEMS } from '@/features/home/constants/grid-items'

describe('GRID_ITEMS', () => {
  it('그리드 아이템이 정의되어야 함', () => {
    expect(GRID_ITEMS).toBeDefined()
    expect(Array.isArray(GRID_ITEMS)).toBe(true)
  })

  it('각 아이템이 필수 속성을 가져야 함', () => {
    GRID_ITEMS.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('image')
    })
  })

  it('모든 아이템 ID가 고유해야 함', () => {
    const ids = GRID_ITEMS.map(item => item.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('이미지 경로가 유효해야 함', () => {
    GRID_ITEMS.forEach(item => {
      expect(item.image).toMatch(/^\/|^http/)
    })
  })

  it('최소 1개 이상의 아이템이 있어야 함', () => {
    expect(GRID_ITEMS.length).toBeGreaterThan(0)
  })
})

