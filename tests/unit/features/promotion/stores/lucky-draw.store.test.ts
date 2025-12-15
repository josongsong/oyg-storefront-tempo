import { describe, it, expect, beforeEach } from 'vitest'
import { useLuckyDrawStore } from '@/features/promotion/stores/lucky-draw.store'

describe('LuckyDrawStore', () => {
  beforeEach(() => {
    useLuckyDrawStore.setState({ isOpen: false })
  })

  describe('초기 상태', () => {
    it('닫혀있어야 함', () => {
      const { isOpen } = useLuckyDrawStore.getState()
      expect(isOpen).toBe(false)
    })
  })

  describe('openLuckyDraw', () => {
    it('럭키드로우를 열 수 있어야 함', () => {
      const { openLuckyDraw } = useLuckyDrawStore.getState()
      
      openLuckyDraw()
      
      const { isOpen } = useLuckyDrawStore.getState()
      expect(isOpen).toBe(true)
    })
  })

  describe('closeLuckyDraw', () => {
    it('럭키드로우를 닫을 수 있어야 함', () => {
      const { openLuckyDraw, closeLuckyDraw } = useLuckyDrawStore.getState()
      
      openLuckyDraw()
      closeLuckyDraw()
      
      const { isOpen } = useLuckyDrawStore.getState()
      expect(isOpen).toBe(false)
    })
  })
})

