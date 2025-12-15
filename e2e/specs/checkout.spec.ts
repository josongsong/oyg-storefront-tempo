/**
 * E2E Test - Checkout Flow
 * 상품 검색 → 상세 → 장바구니 → 체크아웃
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'
import { CartPage } from '../pages/cart.page'

test.describe('Checkout Flow', () => {
  test('should complete full checkout flow', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    // 1. 홈페이지 접속
    await homePage.goto()
    
    // 2. 상품 검색
    await homePage.searchProduct('serum')
    await expect(page).toHaveURL(/search/)

    // 3. 첫 번째 상품 클릭
    await homePage.clickProductCard(0)
    await expect(page).toHaveURL(/products/)

    // 4. 장바구니에 추가
    await productPage.addToCart()
    await page.waitForTimeout(1000) // 토스트 대기

    // 5. 장바구니 페이지로 이동
    await cartPage.goto()

    // 6. 아이템 확인
    const itemCount = await cartPage.getItemCount()
    expect(itemCount).toBeGreaterThan(0)

    // 7. 체크아웃
    await cartPage.checkout()
    await expect(page).toHaveURL(/checkout/)
  })

  test('should add multiple products to cart', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    await homePage.goto()

    // 여러 상품 추가
    for (let i = 0; i < 3; i++) {
      await homePage.clickProductCard(i)
      await productPage.addToCart()
      await page.goBack()
    }

    // 장바구니 확인
    await cartPage.goto()
    const itemCount = await cartPage.getItemCount()
    expect(itemCount).toBe(3)
  })

  test('should remove item from cart', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    // 상품 추가
    await homePage.goto()
    await homePage.clickProductCard(0)
    await productPage.addToCart()

    // 장바구니에서 제거
    await cartPage.goto()
    await cartPage.removeItem(0)

    // 비어있는지 확인
    const isEmpty = await cartPage.isEmpty()
    expect(isEmpty).toBeTruthy()
  })
})
