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

const isDev = import.meta.env.DEV

const middleware = isDev ? devtools : ((f: any) => f)

export const useAppStore = create<AppState>()(
  middleware(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () => set((state: AppState) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        reset: () => set(initialState),
      }),
      { name: 'app-store' }
    ),
    { name: 'AppStore', enabled: isDev }
  )
)

