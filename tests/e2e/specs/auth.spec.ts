/**
 * E2E Test - Authentication Flow
 * 로그인, 회원가입 시나리오
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Authentication Flow - Critical', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.click('button:has-text("Sign In")')

    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-btn"]')

    await expect(page.locator('text=/welcome|success/i')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should register new user', async ({ page }) => {
    await page.click('button:has-text("Sign In")')
    await page.click('text=/create account|sign up/i')

    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'newuser@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-btn"]')

    await expect(page.locator('text=/success|welcome/i')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should logout successfully', async ({ page }) => {
    await page.click('button:has-text("Sign In")')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-btn"]')
    await page.waitForTimeout(1000)

    await page.click('button:has-text("Profile")')
    await page.click('text=/log out|sign out/i')

    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  })

  test('should maintain session after reload', async ({ page }) => {
    await page.click('button:has-text("Sign In")')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-btn"]')
    await page.waitForTimeout(1000)

    await page.reload()

    await expect(page.locator('button:has-text("Sign In")')).not.toBeVisible()
  })
})


