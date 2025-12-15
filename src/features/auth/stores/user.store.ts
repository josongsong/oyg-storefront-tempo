import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { localAuthService } from '@/features/auth/api'

interface User {
  email: string
  name: string
  phone?: string
  createdAt: string
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  initUser: () => void
  login: (user: User) => void
  logout: () => void
}

const isDev = import.meta.env.DEV

const middleware = isDev ? devtools : ((f: any) => f)

export const useUserStore = create<UserState>()(
  middleware(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,
        
        initUser: () => {
          // 테스트 계정 초기화
          localAuthService.initTestAccounts()
          
          const currentUser = localAuthService.getCurrentUser()
          set({ 
            user: currentUser, 
            isLoggedIn: currentUser !== null 
          })
        },
        
        login: (user: User) => {
          set({ user, isLoggedIn: true })
        },
        
        logout: () => {
          localAuthService.logout()
          set({ user: null, isLoggedIn: false })
        },
      }),
      {
        name: 'user-storage',
        partialize: (state: UserState) => ({ 
          user: state.user,
          isLoggedIn: state.isLoggedIn 
        }),
        onRehydrateStorage: () => (_state, error) => {
          if (error) {
            console.error('Failed to rehydrate user:', error)
          }
        },
      }
    ),
    { name: 'UserStore', enabled: isDev }
  )
)

