import type { LocaleSettings } from '@/stores/locale.store'

const STORAGE_KEY = 'locale-settings'

export const localeService = {
  saveSettings(settings: LocaleSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save locale settings:', error)
    }
  },

  loadSettings(): LocaleSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load locale settings:', error)
    }
    return null
  },

  clearSettings(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear locale settings:', error)
    }
  }
}

