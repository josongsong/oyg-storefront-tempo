import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PromoPopupState {
  isOpen: boolean
  lastShown: number | null
  openPopup: () => void
  closePopup: () => void
  checkAndOpenPopup: () => void
}

const ONE_DAY = 24 * 60 * 60 * 1000 // 24시간 (밀리초)

export const usePromoPopupStore = create<PromoPopupState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      lastShown: null,
      
      openPopup: () => set({ isOpen: true }),
      
      closePopup: () => {
        set({ 
          isOpen: false,
          lastShown: Date.now()
        })
      },
      
      checkAndOpenPopup: () => {
        const { lastShown } = get()
        const now = Date.now()
        
        // 이전에 본 적이 없거나, 24시간이 지났으면 팝업 표시
        if (!lastShown || now - lastShown > ONE_DAY) {
          set({ isOpen: true })
        }
      },
    }),
    {
      name: 'promo-popup-storage',
      partialize: (state) => ({ lastShown: state.lastShown }),
    }
  )
)

