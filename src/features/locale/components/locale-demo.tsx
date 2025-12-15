/**
 * Locale Demo Component
 * 
 * i18n 동작 확인용 데모
 */

// @ts-ignore
import * as m from '@/app/i18n/paraglide/messages.js'
// @ts-ignore
import { getLocale, setLocale } from '@/app/i18n/paraglide/runtime.js'
import { useState } from 'react'

export function LocaleDemo() {
  const [currentLocale, setCurrentLocale] = useState(getLocale())
  
  const handleChangeLocale = (locale: 'ko' | 'en') => {
    setLocale(locale, { reload: false })
    setCurrentLocale(locale)
    
    // Cookie 저장
    document.cookie = `locale=${locale}; path=/; max-age=31536000`
    
    // 페이지 새로고침으로 메시지 업데이트
    window.location.reload()
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-black p-4 shadow-lg z-50">
      <div className="mb-4">
        <h3 className="font-bold mb-2">i18n Demo</h3>
        <p className="text-sm text-gray-600 mb-2">Current: {currentLocale}</p>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <strong>Empty Title:</strong>
          <p>{m.cart_empty_title()}</p>
        </div>
        
        <div className="text-sm">
          <strong>Item Count:</strong>
          <p>{m.cart_item_count({ count: 5 })}</p>
        </div>
        
        <div className="text-sm">
          <strong>Add Success:</strong>
          <p>{m.cart_add_success({ productName: 'iPhone' })}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleChangeLocale('ko')}
          className={`px-3 py-1 text-sm ${
            currentLocale === 'ko' 
              ? 'bg-black text-white' 
              : 'bg-gray-200'
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => handleChangeLocale('en')}
          className={`px-3 py-1 text-sm ${
            currentLocale === 'en' 
              ? 'bg-black text-white' 
              : 'bg-gray-200'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
}

