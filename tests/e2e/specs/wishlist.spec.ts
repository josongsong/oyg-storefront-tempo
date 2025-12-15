/**
 * E2E Test - Wishlist Flow (Critical Only)
 * 핵심 위시리스트 플로우
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Wishlist Flow - Critical', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should toggle wishlist', async ({ page }) => {
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()
    await page.waitForTimeout(500)
    await expect(wishlistBtn).toHaveClass(/active|favorited/)

    await wishlistBtn.click()
    await expect(wishlistBtn).not.toHaveClass(/active|favorited/)
  })

  test('should persist wishlist after reload', async ({ page }) => {
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()
    await page.waitForTimeout(500)

    await page.reload()
    await page.waitForLoadState('networkidle')

    const reloadedBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await expect(reloadedBtn).toHaveClass(/active|favorited/)
  })
})
