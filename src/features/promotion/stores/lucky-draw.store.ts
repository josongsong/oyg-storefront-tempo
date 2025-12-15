import { create } from 'zustand'

interface LuckyDrawStore {
  isOpen: boolean
  openLuckyDraw: () => void
  closeLuckyDraw: () => void
}

export const useLuckyDrawStore = create<LuckyDrawStore>((set) => ({
  isOpen: false,
  openLuckyDraw: () => set({ isOpen: true }),
  closeLuckyDraw: () => set({ isOpen: false }),
}))

