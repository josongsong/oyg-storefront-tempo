/**
 * User Store Tests
 * 
 * 검증 내용:
 * 1. 초기 상태 (비로그인)
 * 2. initUser로 localStorage에서 사용자 정보 복원
 * 3. login으로 사용자 정보 저장
 * 4. logout으로 사용자 정보 삭제
 * 5. isLoggedIn 상태가 올바른지
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from '@/features/auth/stores/user.store'
import type { User } from '@/features/auth/types'

describe('useUserStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 초기화
    const store = useUserStore.getState()
    store.user = null
    store.isLoggedIn = false
    localStorage.clear()
  })

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  describe('초기 상태', () => {
    it('로그인되지 않은 상태로 시작한다', () => {
      const store = useUserStore.getState()
      
      expect(store.isLoggedIn).toBe(false)
      expect(store.user).toBeNull()
    })
  })

  describe('initUser', () => {
    it('localStorage에 저장된 사용자 정보를 복원한다', () => {
      // localStorage에 미리 저장
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      const store = useUserStore.getState()
      store.initUser()

      expect(store.isLoggedIn).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('localStorage가 비어있으면 로그인 상태가 아니다', () => {
      const store = useUserStore.getState()
      store.initUser()

      expect(store.isLoggedIn).toBe(false)
      expect(store.user).toBeNull()
    })

    it('잘못된 JSON이 저장되어 있어도 에러 없이 처리한다', () => {
      localStorage.setItem('user', 'invalid-json')
      
      const store = useUserStore.getState()
      
      // 에러 없이 실행되어야 함
      expect(() => store.initUser()).not.toThrow()
      
      expect(store.isLoggedIn).toBe(false)
      expect(store.user).toBeNull()
    })
  })

  describe('login', () => {
    it('사용자 정보를 저장하고 로그인 상태로 변경한다', () => {
      const store = useUserStore.getState()
      
      store.login(mockUser)

      expect(store.isLoggedIn).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('localStorage에 사용자 정보를 저장한다', () => {
      const store = useUserStore.getState()
      
      store.login(mockUser)

      const savedUser = localStorage.getItem('user')
      expect(savedUser).toBeTruthy()
      expect(JSON.parse(savedUser!)).toEqual(mockUser)
    })

    it('이전 사용자 정보를 덮어쓴다', () => {
      const store = useUserStore.getState()
      
      const firstUser = { ...mockUser, id: 'user-1' }
      const secondUser = { ...mockUser, id: 'user-2' }

      store.login(firstUser)
      expect(store.user?.id).toBe('user-1')

      store.login(secondUser)
      expect(store.user?.id).toBe('user-2')
    })
  })

  describe('logout', () => {
    it('사용자 정보를 삭제하고 로그아웃 상태로 변경한다', () => {
      const store = useUserStore.getState()
      
      // 먼저 로그인
      store.login(mockUser)
      expect(store.isLoggedIn).toBe(true)

      // 로그아웃
      store.logout()

      expect(store.isLoggedIn).toBe(false)
      expect(store.user).toBeNull()
    })

    it('localStorage에서 사용자 정보를 삭제한다', () => {
      const store = useUserStore.getState()
      
      store.login(mockUser)
      expect(localStorage.getItem('user')).toBeTruthy()

      store.logout()

      expect(localStorage.getItem('user')).toBeNull()
    })

    it('로그아웃 상태에서 다시 로그아웃해도 문제없다', () => {
      const store = useUserStore.getState()
      
      expect(() => {
        store.logout()
        store.logout()
      }).not.toThrow()

      expect(store.isLoggedIn).toBe(false)
    })
  })

  describe('isLoggedIn 상태', () => {
    it('user가 있으면 true다', () => {
      const store = useUserStore.getState()
      
      store.login(mockUser)

      expect(store.isLoggedIn).toBe(true)
    })

    it('user가 null이면 false다', () => {
      const store = useUserStore.getState()

      expect(store.isLoggedIn).toBe(false)
    })
  })
})

