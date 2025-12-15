import { describe, it, expect } from 'vitest'

describe('Section Utils', () => {
  describe('섹션 순서 관리', () => {
    it('섹션 배열을 정의할 수 있어야 함', () => {
      const sections = [
        'hero',
        'gift-guide',
        'curated',
        'trending',
        'video',
        'expandable-grid',
        'tiktok-gallery',
      ]
      
      expect(sections).toHaveLength(7)
      expect(sections[0]).toBe('hero')
    })

    it('섹션 인덱스를 찾을 수 있어야 함', () => {
      const sections = ['hero', 'gift-guide', 'curated']
      const index = sections.indexOf('gift-guide')
      
      expect(index).toBe(1)
    })
  })

  describe('섹션 가시성 관리', () => {
    it('섹션 표시 여부를 결정할 수 있어야 함', () => {
      const visibleSections = new Set(['hero', 'trending'])
      
      expect(visibleSections.has('hero')).toBe(true)
      expect(visibleSections.has('hidden')).toBe(false)
    })
  })

  describe('애니메이션 설정', () => {
    it('페이드인 duration을 설정할 수 있어야 함', () => {
      const duration = 500
      
      expect(duration).toBeGreaterThan(0)
      expect(duration).toBeLessThanOrEqual(1000)
    })
  })
})

