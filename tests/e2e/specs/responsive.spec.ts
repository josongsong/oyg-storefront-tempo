/**
 * E2E Test - Responsive Design
 */

import { test, expect, devices } from '@playwright/test'

test.describe('반응형 디자인', () => {
  test('모바일에서 홈페이지가 정상적으로 표시된다', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    })
    const page = await context.newPage()
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveTitle(/Oliveyoung|Global Beauty/)
    
    const products = page.locator('.group.relative.flex.flex-col.cursor-pointer')
    await expect(products.first()).toBeVisible({ timeout: 10000 })
    
    await context.close()
  })

  test('태블릿에서 상품 페이지가 정상적으로 표시된다', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    })
    const page = await context.newPage()
    
    await page.goto('/products', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    
    const products = page.locator('.group.relative.flex.flex-col.cursor-pointer')
    await expect(products.first()).toBeVisible({ timeout: 10000 })
    
    await context.close()
  })
})

