import { create } from 'zustand'

export interface LocaleSettings {
  language: string
  currency: string
}

interface LocaleState {
  settings: LocaleSettings
  isPopupOpen: boolean
  setSettings: (settings: LocaleSettings) => void
  openPopup: () => void
  closePopup: () => void
  initSettings: () => void
}

const DEFAULT_SETTINGS: LocaleSettings = {
  language: 'ko',
  currency: 'KRW'
}

export const useLocaleStore = create<LocaleState>((set) => ({
  settings: DEFAULT_SETTINGS,
  isPopupOpen: false,
  
  setSettings: (settings: LocaleSettings) => {
    set({ settings })
    localStorage.setItem('locale-settings', JSON.stringify(settings))
  },
  
  openPopup: () => set({ isPopupOpen: true }),
  
  closePopup: () => set({ isPopupOpen: false }),
  
  initSettings: () => {
    const stored = localStorage.getItem('locale-settings')
    if (stored) {
      try {
        const settings = JSON.parse(stored)
        set({ settings })
      } catch (e) {
        console.error('Failed to parse locale settings:', e)
      }
    }
  }
}))

