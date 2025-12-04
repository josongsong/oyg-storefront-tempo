import { create } from 'zustand'
import { localAuthService } from '@/services'

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
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
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
  
  logout: () => {
    localAuthService.logout()
    set({ user: null, isLoggedIn: false })
  },
}))

