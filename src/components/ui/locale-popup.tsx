import { AnimatePresence, motion } from 'framer-motion'
import { X, Globe, DollarSign } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { useLocaleStore } from '@/stores'
import type { LocaleSettings } from '@/stores/locale.store'

const LANGUAGES = [
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
]

const CURRENCIES = [
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'EUR', name: 'Euro', symbol: '€' }
]


export function LocalePopup() {
  const { settings, isPopupOpen, closePopup, setSettings } = useLocaleStore()
  const [tempSettings, setTempSettings] = useState<LocaleSettings>(settings)
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    if (isPopupOpen) {
      setTempSettings(settings)
      scrollPositionRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
    } else {
      const scrollY = scrollPositionRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      window.scrollTo(0, scrollY)
    }
  }, [isPopupOpen, settings])

  const handleSave = () => {
    setSettings(tempSettings)
    closePopup()
  }

  const handleClose = () => {
    closePopup()
  }

  return (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              className="relative bg-white w-full max-w-[480px] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Content */}
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold mb-1 text-center">
                  Regional Settings
                </h2>
                <p className="text-xs text-gray-600 text-center mb-6">
                  Select your language and currency
                </p>

                {/* Language Selection */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-gray-700" />
                    <label className="text-sm font-semibold">Language</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setTempSettings({ ...tempSettings, language: lang.code })}
                        className={`p-3 border-2 transition-all text-left ${
                          tempSettings.language === lang.code
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium text-sm">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-700" />
                    <label className="text-sm font-semibold">Currency</label>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setTempSettings({ ...tempSettings, currency: currency.code })}
                        className={`p-2.5 border-2 transition-all text-left ${
                          tempSettings.currency === currency.code
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{currency.name}</span>
                          <span className="text-gray-600 text-xs">{currency.symbol} {currency.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-gray-200 text-black py-3 font-medium text-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-black text-white py-3 font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

