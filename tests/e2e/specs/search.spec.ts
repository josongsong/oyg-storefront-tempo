/**
 * E2E Test - Search Flow
 * 상품 검색 시나리오
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('Search Flow - Critical', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should search and display results', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('serum')

    await expect(page).toHaveURL(/search|products/)
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test('should navigate to product from search', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)

    await homePage.searchProduct('serum')
    await homePage.clickProductCard(0)

    await expect(page).toHaveURL(/products\//)
    const productName = await productPage.getProductName()
    expect(productName).toBeTruthy()
  })
})


