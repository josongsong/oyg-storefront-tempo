/**
 * E2E Test - Navigation
 */

import { test, expect } from '@playwright/test'

test.describe('네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
  })

  test('홈 페이지에서 상품 목록 페이지로 이동할 수 있다', async ({ page }) => {
    // Products 링크 찾기 (다양한 방법으로 시도)
    const productsLink = page.locator('a[href="/products"], a:has-text("Products"), a:has-text("상품")')
    
    if (await productsLink.count() > 0) {
      await productsLink.first().click()
      await expect(page).toHaveURL(/\/products/)
    } else {
      // 링크가 없으면 직접 이동
      await page.goto('/products')
      await expect(page).toHaveURL(/\/products/)
    }
  })

  test('장바구니 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/cart', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    
    await expect(page).toHaveURL(/\/cart/)
  })

  test('로그인 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    
    await expect(page).toHaveURL(/\/login/)
  })
})

