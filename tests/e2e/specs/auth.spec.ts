/**
 * E2E Test - Authentication Flow
 * 로그인, 회원가입 시나리오
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Login', () => {
    test('should open login modal', async ({ page }) => {
      // 로그인 버튼 클릭
      await page.click('button:has-text("Sign In")')

      // 로그인 모달이 열렸는지 확인
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
    })

    test('should login with valid credentials', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // 로그인 폼 작성
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')

      // 제출
      await page.click('[data-testid="submit-btn"]')

      // 로그인 성공 확인
      await expect(page.locator('text=/welcome|success/i')).toBeVisible({
        timeout: 5000,
      })
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // 잘못된 정보 입력
      await page.fill('[data-testid="email-input"]', 'wrong@example.com')
      await page.fill('[data-testid="password-input"]', 'wrongpassword')

      await page.click('[data-testid="submit-btn"]')

      // 에러 메시지 확인
      await expect(
        page.locator('[data-testid="error-message"]')
      ).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // 잘못된 이메일 형식
      await page.fill('[data-testid="email-input"]', 'invalid-email')
      await page.fill('[data-testid="password-input"]', 'password')

      await page.click('[data-testid="submit-btn"]')

      // 유효성 검사 에러
      await expect(page.locator('text=/valid email/i')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // 빈 폼 제출
      await page.click('[data-testid="submit-btn"]')

      // 필수 필드 에러
      await expect(page.locator('text=/required|필수/i')).toBeVisible()
    })

    test('should close login modal', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      await expect(page.locator('[data-testid="login-form"]')).toBeVisible()

      // 닫기 버튼 클릭
      await page.click('[data-testid="modal-close"]')

      await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible()
    })
  })

  test.describe('Sign Up', () => {
    test('should open signup modal', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // "Create account" 링크 클릭
      await page.click('text=/create account|sign up/i')

      // 회원가입 폼 표시 확인
      await expect(page.locator('[data-testid="signup-form"]')).toBeVisible()
    })

    test('should register new user', async ({ page }) => {
      await page.click('button:has-text("Sign In")')
      await page.click('text=/create account|sign up/i')

      // 회원가입 폼 작성
      await page.fill('[data-testid="name-input"]', 'Test User')
      await page.fill('[data-testid="email-input"]', 'newuser@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')

      await page.click('[data-testid="submit-btn"]')

      // 회원가입 성공 확인
      await expect(page.locator('text=/success|welcome/i')).toBeVisible({
        timeout: 5000,
      })
    })

    test('should validate password strength', async ({ page }) => {
      await page.click('button:has-text("Sign In")')
      await page.click('text=/create account|sign up/i')

      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', '123') // 약한 비밀번호

      await page.click('[data-testid="submit-btn"]')

      // 비밀번호 강도 에러
      await expect(page.locator('text=/password.*strong|weak password/i')).toBeVisible()
    })

    test('should validate duplicate email', async ({ page }) => {
      await page.click('button:has-text("Sign In")')
      await page.click('text=/create account|sign up/i')

      // 이미 존재하는 이메일
      await page.fill('[data-testid="name-input"]', 'Test User')
      await page.fill('[data-testid="email-input"]', 'existing@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')

      await page.click('[data-testid="submit-btn"]')

      // 중복 에러
      await expect(
        page.locator('text=/already exists|already registered/i')
      ).toBeVisible()
    })
  })

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // 먼저 로그인
      await page.click('button:has-text("Sign In")')
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="submit-btn"]')

      await page.waitForTimeout(1000)

      // 프로필 메뉴 열기
      await page.click('button:has-text("Profile")')

      // 로그아웃 클릭
      await page.click('text=/log out|sign out/i')

      // 로그아웃 확인
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
    })
  })

  test.describe('Protected Routes', () => {
    test('should redirect to login for protected pages', async ({ page }) => {
      // 보호된 페이지 접근 시도
      await page.goto('/profile')

      // 로그인 페이지로 리다이렉트
      await expect(page).toHaveURL(/login|signin/)
    })

    test('should access protected page after login', async ({ page }) => {
      // 로그인
      await page.click('button:has-text("Sign In")')
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="submit-btn"]')

      await page.waitForTimeout(1000)

      // 보호된 페이지 접근
      await page.goto('/profile')

      // 페이지에 접근 가능
      await expect(page).toHaveURL(/profile/)
    })
  })

  test.describe('Session Persistence', () => {
    test('should maintain session after page reload', async ({ page }) => {
      // 로그인
      await page.click('button:has-text("Sign In")')
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="submit-btn"]')

      await page.waitForTimeout(1000)

      // 페이지 새로고침
      await page.reload()

      // 여전히 로그인 상태인지 확인
      await expect(page.locator('button:has-text("Sign In")')).not.toBeVisible()
    })
  })

  test.describe('Password Reset', () => {
    test('should show forgot password option', async ({ page }) => {
      await page.click('button:has-text("Sign In")')

      // "Forgot password" 링크 확인
      const forgotLink = page.locator('text=/forgot password/i')
      await expect(forgotLink).toBeVisible()
    })

    test('should handle password reset request', async ({ page }) => {
      await page.click('button:has-text("Sign In")')
      await page.click('text=/forgot password/i')

      // 이메일 입력
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.click('[data-testid="submit-btn"]')

      // 성공 메시지
      await expect(
        page.locator('text=/sent|check your email/i')
      ).toBeVisible()
    })
  })
})


