/**
 * Locale Loader for React Router
 * 
 * Locale 결정 우선순위:
 * 1. URL :locale
 * 2. Cookie (명시적 선택)
 * 3. Accept-Language
 * 4. defaultLocale
 */

// @ts-ignore - Paraglide generated file
import { setLocale, getLocale, baseLocale } from './paraglide/runtime.js'
import type { LoaderFunctionArgs } from 'react-router'

export type SupportedLocale = 'ko' | 'en'

export const SUPPORTED_LOCALES: SupportedLocale[] = ['ko', 'en']
export const DEFAULT_LOCALE: SupportedLocale = 'ko'

/**
 * Locale 결정 및 설정
 */
export function localeLoader({ request, params }: LoaderFunctionArgs) {
  // 1. URL에서 locale 추출
  const urlLocale = params.locale as SupportedLocale | undefined
  
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
    setLocale(urlLocale, { reload: false })
    return { locale: urlLocale }
  }
  
  // 2. Cookie에서 locale 확인
  const cookies = request.headers.get('Cookie') || ''
  const localeCookie = cookies
    .split(';')
    .find(c => c.trim().startsWith('locale='))
    ?.split('=')[1]
    ?.trim() as SupportedLocale | undefined
  
  if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie)) {
    setLocale(localeCookie, { reload: false })
    return { locale: localeCookie }
  }
  
  // 3. Accept-Language 헤더
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const browserLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase() as SupportedLocale
    
    if (SUPPORTED_LOCALES.includes(browserLocale)) {
      setLocale(browserLocale, { reload: false })
      return { locale: browserLocale }
    }
  }
  
  // 4. Default locale
  setLocale(DEFAULT_LOCALE, { reload: false })
  return { locale: DEFAULT_LOCALE }
}

/**
 * Locale 변경 헬퍼
 */
export function changeLocale(newLocale: SupportedLocale) {
  // Paraglide 설정
  setLocale(newLocale, { reload: false })
  
  // Cookie 저장 (1년)
  document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
  
  // URL 변경
  const currentPath = window.location.pathname
  const pathWithoutLocale = currentPath.replace(/^\/(ko|en)/, '')
  const newPath = `/${newLocale}${pathWithoutLocale || '/'}`
  
  return newPath
}

/**
 * 현재 locale 가져오기
 */
export function getCurrentLocale(): SupportedLocale {
  const tag = getLocale() as SupportedLocale
  return SUPPORTED_LOCALES.includes(tag) ? tag : DEFAULT_LOCALE
}

