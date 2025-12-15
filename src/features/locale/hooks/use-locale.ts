/**
 * Locale Hook (Feature Layer)
 * 
 * Paraglide wrapper + UI 상태 관리
 */

import { useLocaleInfo, useChangeLocale } from '@/app/i18n/hooks'
import { useLocaleStore } from '../stores/locale.store'

export function useLocale() {
  const { currentLocale, availableLocales, isKorean, isEnglish } = useLocaleInfo()
  const changeLocale = useChangeLocale()
  const { isPopupOpen, openPopup, closePopup, settings, setSettings } = useLocaleStore()
  
  const handleLocaleChange = (newLocale: 'ko' | 'en', currency?: string) => {
    // Paraglide locale 변경
    changeLocale(newLocale)
    
    // Store 업데이트
    setSettings({
      language: newLocale,
      currency: currency || settings.currency,
    })
    
    closePopup()
  }
  
  return {
    // Locale 정보
    currentLocale,
    availableLocales,
    isKorean,
    isEnglish,
    
    // Settings
    settings,
    
    // Actions
    changeLocale: handleLocaleChange,
    openPopup,
    closePopup,
    isPopupOpen,
  }
}

