/**
 * Local Auth Service
 * LocalStorage 기반 인증 서비스
 */

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
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  findUserByEmail(email: string): User | undefined {
    const users = this.getUsers()
    return users.find((u) => u.email === email)
  },

  register(email: string, name: string, password: string, phone?: string): LoginResponse {
    const users = this.getUsers()
    
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
    this.saveUsers(users)

    const { password: _, ...userWithoutPassword } = newUser
    this.setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword
    }
  },

  login(email: string, password: string): LoginResponse {
    const user = this.findUserByEmail(email)

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
    this.setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword
    }
  },

  setCurrentUser(user: Omit<User, 'password'>): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  },

  getCurrentUser(): Omit<User, 'password'> | null {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  },

  initTestAccounts(): void {
    const users = this.getUsers()
    
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
