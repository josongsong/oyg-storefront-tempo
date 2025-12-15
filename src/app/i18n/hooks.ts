/**
 * i18n Hooks
 * 
 * Paraglide runtime wrapper
 */

import { useParams, useNavigate } from 'react-router'
// @ts-ignore - Paraglide generated file
import { getLocale } from './paraglide/runtime.js'
import { changeLocale, type SupportedLocale, SUPPORTED_LOCALES } from './loader'

/**
 * 현재 locale 가져오기
 */
export function useLocale() {
  const params = useParams()
  const currentLocale = (params.locale || getLocale()) as SupportedLocale
  
  return {
    locale: currentLocale,
    availableLocales: SUPPORTED_LOCALES,
  }
}

/**
 * Locale 변경 hook
 */
export function useChangeLocale() {
  const navigate = useNavigate()
  
  return (newLocale: SupportedLocale) => {
    const newPath = changeLocale(newLocale)
    navigate(newPath)
  }
}

/**
 * Locale 정보
 */
export function useLocaleInfo() {
  const { locale, availableLocales } = useLocale()
  const changeLocale = useChangeLocale()
  
  return {
    currentLocale: locale,
    availableLocales,
    changeLocale,
    isKorean: locale === 'ko',
    isEnglish: locale === 'en',
  }
}

