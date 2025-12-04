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
  // 모든 사용자 가져오기
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  },

  // 사용자 저장
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  // 이메일로 사용자 찾기
  findUserByEmail(email: string): User | undefined {
    const users = this.getUsers()
    return users.find((u) => u.email === email)
  },

  // 회원가입
  register(email: string, name: string, password: string, phone?: string): LoginResponse {
    const users = this.getUsers()
    
    // 이미 존재하는 이메일인지 확인
    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'This email is already registered'
      }
    }

    // 새 사용자 생성
    const newUser: User = {
      email,
      name,
      password, // 실제로는 해시해야 하지만 간단하게 저장
      phone,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    this.saveUsers(users)

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = newUser
    
    // 자동 로그인
    this.setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword
    }
  },

  // 로그인
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

  // 현재 로그인한 사용자 설정
  setCurrentUser(user: Omit<User, 'password'>): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  },

  // 현재 로그인한 사용자 가져오기
  getCurrentUser(): Omit<User, 'password'> | null {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  // 로그아웃
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  },

  // 테스트 계정 초기화
  initTestAccounts(): void {
    const users = this.getUsers()
    
    // 이미 테스트 계정이 있으면 추가하지 않음
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

