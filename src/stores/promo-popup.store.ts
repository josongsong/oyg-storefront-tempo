import { create } from 'zustand'

interface PromoPopupState {
  isOpen: boolean
  openPopup: () => void
  closePopup: () => void
  checkAndOpenPopup: () => void
}

const STORAGE_KEY = 'promo-popup-last-shown'
const ONE_DAY = 24 * 60 * 60 * 1000 // 24시간 (밀리초)

export const usePromoPopupStore = create<PromoPopupState>((set) => ({
  isOpen: false,
  
  openPopup: () => set({ isOpen: true }),
  
  closePopup: () => {
    set({ isOpen: false })
    // 팝업을 닫을 때 현재 시간을 저장
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  },
  
  checkAndOpenPopup: () => {
    const lastShown = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()
    
    // 이전에 본 적이 없거나, 24시간이 지났으면 팝업 표시
    if (!lastShown || now - parseInt(lastShown) > ONE_DAY) {
      set({ isOpen: true })
    }
  },
}))

