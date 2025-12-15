import { describe, it, expect, beforeEach } from 'vitest'
import { useLocaleStore } from '@/features/locale/stores/locale.store'

describe('LocaleStore', () => {
  beforeEach(() => {
    useLocaleStore.setState({
      settings: { language: 'ko', currency: 'KRW' },
      isPopupOpen: false,
    })
  })

  describe('초기 상태', () => {
    it('기본 설정이 한국어/KRW이어야 함', () => {
      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('ko')
      expect(settings.currency).toBe('KRW')
    })

    it('팝업이 닫혀있어야 함', () => {
      const { isPopupOpen } = useLocaleStore.getState()
      expect(isPopupOpen).toBe(false)
    })
  })

  describe('setSettings', () => {
    it('언어와 통화를 변경할 수 있어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      setSettings({ language: 'en', currency: 'USD' })
      
      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
      expect(settings.currency).toBe('USD')
    })

    it('언어만 변경할 수 있어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      setSettings({ language: 'en', currency: 'KRW' })
      
      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
      expect(settings.currency).toBe('KRW')
    })
  })

  describe('팝업 관리', () => {
    it('openPopup으로 팝업을 열 수 있어야 함', () => {
      const { openPopup } = useLocaleStore.getState()
      
      openPopup()
      
      const { isPopupOpen } = useLocaleStore.getState()
      expect(isPopupOpen).toBe(true)
    })

    it('closePopup으로 팝업을 닫을 수 있어야 함', () => {
      const { openPopup, closePopup } = useLocaleStore.getState()
      
      openPopup()
      closePopup()
      
      const { isPopupOpen } = useLocaleStore.getState()
      expect(isPopupOpen).toBe(false)
    })
  })
})

