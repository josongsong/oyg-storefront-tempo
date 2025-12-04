import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // UI State
  isSidebarOpen: boolean
  isLoading: boolean

  // Actions
  toggleSidebar: () => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  isSidebarOpen: false,
  isLoading: false,
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setLoading: (loading) => set({ isLoading: loading }),
        reset: () => set(initialState),
      }),
      { name: 'app-store' }
    ),
    { name: 'AppStore' }
  )
)

