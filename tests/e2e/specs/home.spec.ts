/**
 * E2E Test - Home Page
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('홈페이지', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('홈페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/Oliveyoung|Global Beauty/)
  })

  test('상품 카드가 표시된다', async () => {
    const count = await homePage.getProductCount()
    expect(count).toBeGreaterThan(0)
  })

  test('상품 카드를 클릭하면 상세 페이지로 이동한다', async ({ page }) => {
    await homePage.clickFirstProduct()
    
    await page.waitForURL(/\/products\/.*/, { timeout: 10000 })
    expect(page.url()).toContain('/products/')
  })
})

