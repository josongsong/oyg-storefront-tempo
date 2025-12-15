/**
 * E2E Test - Locale Flow
 * 언어 및 통화 전환
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Locale Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Language Switching', () => {
    test('should open locale settings', async ({ page }) => {
      // 언어 선택 버튼 클릭
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // 언어 설정 모달 표시
        await expect(page.locator('[data-testid="locale-popup"]')).toBeVisible()
      }
    })

    test('should switch to English', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // 영어 선택
        await page.click('button:has-text("English")')
        await page.click('button:has-text("Save")')

        await page.waitForTimeout(500)

        // 페이지가 영어로 표시되는지 확인
        await expect(page.locator('text=/cart|shop|products/i')).toBeVisible()
      }
    })

    test('should switch to Korean', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // 한국어 선택
        await page.click('button:has-text("Korean")')
        await page.click('button:has-text("Save")')

        await page.waitForTimeout(500)

        // 페이지가 한국어로 표시되는지 확인
        await expect(page.locator('text=/장바구니|쇼핑|상품/i')).toBeVisible()
      }
    })

    test('should persist language preference', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()
        await page.click('button:has-text("English")')
        await page.click('button:has-text("Save")')

        // 새로고침
        await page.reload()
        await page.waitForLoadState('networkidle')

        // 언어 설정 유지 확인
        await expect(page.locator('text=/cart|shop/i')).toBeVisible()
      }
    })
  })

  test.describe('Currency Switching', () => {
    test('should switch currency to USD', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // USD 선택
        const usdBtn = page.locator('button:has-text("US Dollar")')
        if (await usdBtn.isVisible()) {
          await usdBtn.click()
          await page.click('button:has-text("Save")')

          await page.waitForTimeout(500)

          // 가격이 USD로 표시되는지 확인
          await expect(page.locator('text=/\\$/')).toBeVisible()
        }
      }
    })

    test('should switch currency to KRW', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // KRW 선택
        const krwBtn = page.locator('button:has-text("Korean Won")')
        if (await krwBtn.isVisible()) {
          await krwBtn.click()
          await page.click('button:has-text("Save")')

          await page.waitForTimeout(500)

          // 가격이 KRW로 표시되는지 확인
          await expect(page.locator('text=/₩/')).toBeVisible()
        }
      }
    })

    test('should persist currency preference', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        const usdBtn = page.locator('button:has-text("US Dollar")')
        if (await usdBtn.isVisible()) {
          await usdBtn.click()
          await page.click('button:has-text("Save")')

          // 새로고침
          await page.reload()
          await page.waitForLoadState('networkidle')

          // 통화 설정 유지
          await expect(page.locator('text=/\\$/')).toBeVisible()
        }
      }
    })
  })

  test.describe('Locale Modal', () => {
    test('should cancel locale changes', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // 언어 변경
        await page.click('button:has-text("English")')

        // 취소
        await page.click('button:has-text("Cancel")')

        await page.waitForTimeout(500)

        // 모달 닫힘
        await expect(page.locator('[data-testid="locale-popup"]')).not.toBeVisible()
      }
    })

    test('should close locale modal with ESC', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()
        await expect(page.locator('[data-testid="locale-popup"]')).toBeVisible()

        // ESC로 닫기
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)

        await expect(page.locator('[data-testid="locale-popup"]')).not.toBeVisible()
      }
    })
  })

  test.describe('Combined Settings', () => {
    test('should change both language and currency', async ({ page }) => {
      const localeBtn = page.locator('button[aria-label*="language"]')
      if (await localeBtn.isVisible()) {
        await localeBtn.click()

        // 영어 + USD
        await page.click('button:has-text("English")')
        
        const usdBtn = page.locator('button:has-text("US Dollar")')
        if (await usdBtn.isVisible()) {
          await usdBtn.click()
        }

        await page.click('button:has-text("Save")')
        await page.waitForTimeout(500)

        // 두 설정 모두 반영 확인
        await expect(page.locator('text=/cart|shop/i')).toBeVisible()
        await expect(page.locator('text=/\\$/')).toBeVisible()
      }
    })
  })
})

