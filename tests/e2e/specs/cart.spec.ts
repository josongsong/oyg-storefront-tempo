/**
 * E2E Test - Cart Flow (Critical Paths Only)
 * 핵심 장바구니 플로우만 테스트
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'
import { CartPage } from '../pages/cart.page'

test.describe('Cart Flow - Critical', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should add product to cart and view', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    await homePage.clickProductCard(0)
    await productPage.addToCart()

    await cartPage.goto()
    const count = await cartPage.getItemCount()
    expect(count).toBeGreaterThan(0)
  })

  test('should remove item from cart', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    await homePage.clickProductCard(0)
    await productPage.addToCart()

    await cartPage.goto()
    await cartPage.removeItem(0)
    await page.waitForTimeout(500)

    const isEmpty = await cartPage.isEmpty()
    expect(isEmpty).toBeTruthy()
  })

  test('should persist cart after reload', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    await homePage.clickProductCard(0)
    await productPage.addToCart()

    await cartPage.goto()
    const beforeCount = await cartPage.getItemCount()

    await page.reload()
    await page.waitForLoadState('networkidle')

    const afterCount = await cartPage.getItemCount()
    expect(afterCount).toBe(beforeCount)
  })
})

