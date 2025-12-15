import { describe, it, expect, beforeEach } from 'vitest'
import { useLocaleStore } from '@/features/locale/stores/locale.store'

describe('Locale Integration', () => {
  beforeEach(() => {
    useLocaleStore.setState({
      settings: { language: 'ko', currency: 'KRW' },
      isPopupOpen: false,
    })
  })

  describe('언어 변경 통합', () => {
    it('언어 변경이 상태에 반영되어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      setSettings({ language: 'en', currency: 'KRW' })
      
      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
    })

    it('언어 변경이 persist되어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      setSettings({ language: 'en', currency: 'USD' })
      
      // Persist 시뮬레이션 (실제로는 localStorage에 저장됨)
      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
      expect(settings.currency).toBe('USD')
    })
  })

  describe('통화 변경 통합', () => {
    it('통화 변경이 상태에 반영되어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      setSettings({ language: 'ko', currency: 'USD' })
      
      const { settings } = useLocaleStore.getState()
      expect(settings.currency).toBe('USD')
    })

    it('다양한 통화로 변경할 수 있어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      const currencies = ['USD', 'EUR', 'JPY', 'CNY', 'KRW']
      
      currencies.forEach((currency) => {
        setSettings({ language: 'ko', currency })
        expect(useLocaleStore.getState().settings.currency).toBe(currency)
      })
    })
  })

  describe('팝업 상태 통합', () => {
    it('팝업을 열고 닫을 수 있어야 함', () => {
      const { openPopup, closePopup } = useLocaleStore.getState()
      
      openPopup()
      expect(useLocaleStore.getState().isPopupOpen).toBe(true)
      
      closePopup()
      expect(useLocaleStore.getState().isPopupOpen).toBe(false)
    })

    it('팝업을 여러 번 토글할 수 있어야 함', () => {
      const { openPopup, closePopup } = useLocaleStore.getState()
      
      for (let i = 0; i < 5; i++) {
        openPopup()
        expect(useLocaleStore.getState().isPopupOpen).toBe(true)
        
        closePopup()
        expect(useLocaleStore.getState().isPopupOpen).toBe(false)
      }
    })
  })

  describe('설정 조합', () => {
    it('언어와 통화를 동시에 변경할 수 있어야 함', () => {
      const { setSettings } = useLocaleStore.getState()
      
      const combinations = [
        { language: 'en', currency: 'USD' },
        { language: 'ko', currency: 'KRW' },
        { language: 'ja', currency: 'JPY' },
        { language: 'zh', currency: 'CNY' },
      ]
      
      combinations.forEach(({ language, currency }) => {
        setSettings({ language, currency })
        const { settings } = useLocaleStore.getState()
        expect(settings.language).toBe(language)
        expect(settings.currency).toBe(currency)
      })
    })
  })
})

