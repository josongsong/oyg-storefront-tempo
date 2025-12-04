import { create } from 'zustand'

interface AuthPopupState {
  isOpen: boolean
  openPopup: () => void
  closePopup: () => void
}

export const useAuthPopupStore = create<AuthPopupState>((set) => ({
  isOpen: false,
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
}))

