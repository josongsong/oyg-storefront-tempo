import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

const DEFAULT_SETTINGS: LocaleSettings = {
  language: 'ko',
  currency: 'KRW'
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isPopupOpen: false,
      
      setSettings: (settings) => set({ settings }),
      
      openPopup: () => set({ isPopupOpen: true }),
      
      closePopup: () => set({ isPopupOpen: false }),
    }),
    {
      name: 'locale-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)

