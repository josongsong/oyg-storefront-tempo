/**
 * Local Auth Service
 * LocalStorage 기반 인증 서비스 (암호화 적용)
 */

import { setSecureItem, getSecureItem, removeSecureItem } from '@/shared/utils/crypto'

interface User {
  email: string
  name: string
  password: string
  phone?: string
  createdAt: string
}

interface LoginResponse {
  success: boolean
  user?: Omit<User, 'password'>
  message?: string
}

const USERS_KEY = 'oyg_users'
const CURRENT_USER_KEY = 'oyg_current_user'

export const localAuthService = {
  async getUsers(): Promise<User[]> {
    try {
      const users = await getSecureItem(USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      // Fallback to plain localStorage for backward compatibility
      const users = localStorage.getItem(USERS_KEY)
      return users ? JSON.parse(users) : []
    }
  },

  async saveUsers(users: User[]): Promise<void> {
    try {
      await setSecureItem(USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save users securely:', error)
      // Fallback
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  },

  async findUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers()
    return users.find((u) => u.email === email)
  },

  async register(email: string, name: string, password: string, phone?: string): Promise<LoginResponse> {
    const users = await this.getUsers()
    
    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'This email is already registered'
      }
    }

    const newUser: User = {
      email,
      name,
      password,
      phone,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    await this.saveUsers(users)

    const { password: _, ...userWithoutPassword } = newUser
    await this.setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.findUserByEmail(email)

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password'
      }
    }

    const { password: _, ...userWithoutPassword } = user
    await this.setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword
    }
  },

  async setCurrentUser(user: Omit<User, 'password'>): Promise<void> {
    try {
      await setSecureItem(CURRENT_USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to set current user securely:', error)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    }
  },

  async getCurrentUser(): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await getSecureItem(CURRENT_USER_KEY)
      return user ? JSON.parse(user) : null
    } catch {
      // Fallback
      const user = localStorage.getItem(CURRENT_USER_KEY)
      return user ? JSON.parse(user) : null
    }
  },

  logout(): void {
    removeSecureItem(CURRENT_USER_KEY)
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  },

  async initTestAccounts(): Promise<void> {
    const users = await this.getUsers()
    
    if (users.some((u) => u.email === 'test@oliveyoung.com')) {
      return
    }

    const testAccounts: User[] = [
      {
        email: 'test@oliveyoung.com',
        name: 'Test User',
        password: 'test1234',
        phone: '+1 (555) 123-4567',
        createdAt: new Date().toISOString()
      },
      {
        email: 'admin@oliveyoung.com',
        name: 'Admin User',
        password: 'admin1234',
        phone: '+1 (555) 999-9999',
        createdAt: new Date().toISOString()
      }
    ]

    const allUsers = [...users, ...testAccounts]
    this.saveUsers(allUsers)
  }
}
