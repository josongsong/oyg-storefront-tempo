/**
 * E2E Test - Product Flow (Critical Paths Only)
 * 핵심 상품 플로우만 테스트
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('Product Flow - Critical', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should view product list', async ({ page }) => {
    await page.goto('/products')

    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test('should view product details', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)

    await homePage.clickProductCard(0)

    const productName = await productPage.getProductName()
    expect(productName).toBeTruthy()
  })

  test('should add product to cart', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)

    await homePage.clickProductCard(0)
    await productPage.addToCart()

    await expect(
      page.locator('text=/added to cart|장바구니에 추가/i')
    ).toBeVisible()
  })
})

