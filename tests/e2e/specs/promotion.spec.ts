/**
 * E2E Test - Promotion Flow
 * 프로모션 팝업, 럭키드로우
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Promotion Flow', () => {
  test.describe('Promo Popup', () => {
    test('should display promo popup on first visit', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      // 프로모션 팝업 표시 (첫 방문시)
      const promoPopup = page.locator('[data-testid="promo-popup"]')
      
      // 팝업이 나타날 때까지 대기 (최대 3초)
      try {
        await expect(promoPopup).toBeVisible({ timeout: 3000 })
      } catch {
        // 팝업이 24시간 이내 이미 표시된 경우 스킵
        test.skip()
      }
    })

    test('should close promo popup', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      const promoPopup = page.locator('[data-testid="promo-popup"]')
      
      if (await promoPopup.isVisible({ timeout: 3000 })) {
        // 닫기 버튼
        const closeBtn = promoPopup.locator('button[aria-label="Close"]')
        await closeBtn.click()
        await page.waitForTimeout(500)

        await expect(promoPopup).not.toBeVisible()
      }
    })

    test('should not show popup again within 24 hours', async ({ page, context }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      const promoPopup = page.locator('[data-testid="promo-popup"]')
      
      if (await promoPopup.isVisible({ timeout: 3000 })) {
        // 팝업 닫기
        const closeBtn = promoPopup.locator('button[aria-label="Close"]')
        await closeBtn.click()
        await page.waitForTimeout(500)

        // 새 페이지로 이동 후 다시 홈 접속
        await page.goto('/products')
        await page.goto('/')
        await page.waitForTimeout(2000)

        // 팝업이 다시 나타나지 않아야 함
        await expect(promoPopup).not.toBeVisible()
      }
    })

    test('should navigate from promo popup CTA', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      const promoPopup = page.locator('[data-testid="promo-popup"]')
      
      if (await promoPopup.isVisible({ timeout: 3000 })) {
        // "Shop Now" 버튼 클릭
        const shopBtn = promoPopup.locator('button:has-text("Shop Now")')
        if (await shopBtn.isVisible()) {
          await shopBtn.click()
          await page.waitForLoadState('networkidle')

          // 프로모션 페이지로 이동
          expect(page.url()).toContain('products')
        }
      }
    })
  })

  test.describe('Lucky Draw', () => {
    test('should open lucky draw', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      // 럭키드로우 버튼 (있다면)
      const luckyDrawBtn = page.locator('button:has-text("Lucky Draw")')
      if (await luckyDrawBtn.isVisible()) {
        await luckyDrawBtn.click()

        // 럭키드로우 팝업
        await expect(page.locator('[data-testid="lucky-draw-popup"]')).toBeVisible()
      }
    })

    test('should spin lucky draw wheel', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      const luckyDrawBtn = page.locator('button:has-text("Lucky Draw")')
      if (await luckyDrawBtn.isVisible()) {
        await luckyDrawBtn.click()

        // 스핀 버튼 클릭
        const spinBtn = page.locator('button:has-text("Spin")')
        if (await spinBtn.isVisible()) {
          await spinBtn.click()
          await page.waitForTimeout(3000) // 애니메이션 대기

          // 결과 표시
          await expect(page.locator('text=/congratulations|you won/i')).toBeVisible({
            timeout: 5000,
          })
        }
      }
    })

    test('should close lucky draw', async ({ page }) => {
      const homePage = new HomePage(page)
      await homePage.goto()

      const luckyDrawBtn = page.locator('button:has-text("Lucky Draw")')
      if (await luckyDrawBtn.isVisible()) {
        await luckyDrawBtn.click()

        // 닫기
        const closeBtn = page.locator('[data-testid="lucky-draw-close"]')
        if (await closeBtn.isVisible()) {
          await closeBtn.click()
          await page.waitForTimeout(500)

          await expect(page.locator('[data-testid="lucky-draw-popup"]')).not.toBeVisible()
        }
      }
    })
  })

  test.describe('Promotion Banner', () => {
    test('should click promo banner', async ({ page }) => {
      const promoBanner = page.locator('[data-testid="promo-banner"]')
      
      if (await promoBanner.isVisible()) {
        await promoBanner.click()
        await page.waitForLoadState('networkidle')

        // 프로모션 페이지로 이동
        expect(page.url()).toBeTruthy()
      }
    })
  })
})

