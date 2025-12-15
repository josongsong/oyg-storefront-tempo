import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePromoPopupStore } from '@/features/promotion/stores/promo-popup.store'

describe('PromoPopupStore', () => {
  beforeEach(() => {
    usePromoPopupStore.setState({
      isOpen: false,
      lastShown: null,
    })
  })

  describe('초기 상태', () => {
    it('닫혀있어야 함', () => {
      const { isOpen } = usePromoPopupStore.getState()
      expect(isOpen).toBe(false)
    })

    it('lastShown이 null이어야 함', () => {
      const { lastShown } = usePromoPopupStore.getState()
      expect(lastShown).toBeNull()
    })
  })

  describe('openPopup', () => {
    it('팝업을 열 수 있어야 함', () => {
      const { openPopup } = usePromoPopupStore.getState()
      
      openPopup()
      
      const { isOpen } = usePromoPopupStore.getState()
      expect(isOpen).toBe(true)
    })
  })

  describe('closePopup', () => {
    it('팝업을 닫고 lastShown을 기록해야 함', () => {
      const { openPopup, closePopup } = usePromoPopupStore.getState()
      const now = Date.now()
      
      openPopup()
      closePopup()
      
      const { isOpen, lastShown } = usePromoPopupStore.getState()
      expect(isOpen).toBe(false)
      expect(lastShown).toBeGreaterThanOrEqual(now)
    })
  })

  describe('checkAndOpenPopup', () => {
    it('처음 방문시 팝업을 열어야 함', () => {
      const { checkAndOpenPopup } = usePromoPopupStore.getState()
      
      checkAndOpenPopup()
      
      const { isOpen } = usePromoPopupStore.getState()
      expect(isOpen).toBe(true)
    })

    it('24시간 이내에는 팝업을 열지 않아야 함', () => {
      const { closePopup, checkAndOpenPopup } = usePromoPopupStore.getState()
      
      // 1시간 전에 닫았다고 설정
      const oneHourAgo = Date.now() - (1 * 60 * 60 * 1000)
      usePromoPopupStore.setState({ lastShown: oneHourAgo })
      
      checkAndOpenPopup()
      
      const { isOpen } = usePromoPopupStore.getState()
      expect(isOpen).toBe(false)
    })

    it('24시간 이후에는 팝업을 열어야 함', () => {
      const { checkAndOpenPopup } = usePromoPopupStore.getState()
      
      // 25시간 전에 닫았다고 설정
      const twentyFiveHoursAgo = Date.now() - (25 * 60 * 60 * 1000)
      usePromoPopupStore.setState({ lastShown: twentyFiveHoursAgo })
      
      checkAndOpenPopup()
      
      const { isOpen } = usePromoPopupStore.getState()
      expect(isOpen).toBe(true)
    })
  })
})

