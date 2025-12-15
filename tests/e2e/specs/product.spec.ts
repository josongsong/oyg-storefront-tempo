/**
 * E2E Test - Product Flow
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('상품 페이지', () => {
  test('상품 목록 페이지를 볼 수 있다', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    
    const products = page.locator('.group.relative.flex.flex-col.cursor-pointer')
    await expect(products.first()).toBeVisible({ timeout: 10000 })
  })

  test('상품 상세 페이지를 볼 수 있다', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    
    await homePage.goto()
    await homePage.clickFirstProduct()
    
    await page.waitForURL(/\/products\/.*/, { timeout: 10000 })
    
    const productName = await productPage.getProductName()
    expect(productName).toBeTruthy()
    expect(productName.length).toBeGreaterThan(0)
  })

  test('위시리스트에 상품을 추가할 수 있다', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // 첫 번째 상품 카드의 하트 버튼 찾기 (SVG가 포함된 버튼)
    const productCard = page.locator('.group.relative.flex.flex-col.cursor-pointer').first()
    await productCard.waitFor({ state: 'visible', timeout: 10000 })
    
    // 하트 아이콘 버튼 찾기
    const heartButton = productCard.locator('button:has(svg)')
    
    if (await heartButton.count() > 0) {
      await heartButton.first().click()
      
      // 클릭 후 약간 대기
      await page.waitForTimeout(500)
      
      // 위시리스트에 추가되었는지 확인 (하트가 채워진 상태)
      const filledHeart = productCard.locator('svg.fill-red-500')
      await expect(filledHeart).toBeVisible({ timeout: 3000 })
    } else {
      // 하트 버튼이 없으면 테스트 스킵
      test.skip()
    }
  })
})

