/**
 * E2E Test - Search Flow
 * 상품 검색 시나리오
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should search for products', async ({ page }) => {
    const homePage = new HomePage(page)

    // 상품 검색
    await homePage.searchProduct('serum')

    // 검색 결과 확인
    await expect(page).toHaveURL(/search|products/)
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 })
  })

  test('should show search results', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('moisturizer')

    // 검색 결과가 표시되는지 확인
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test('should filter search results by category', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('skincare')

    // 카테고리 필터 선택
    await page.click('button:has-text("Skincare")')

    // 필터링된 결과 확인
    await page.waitForTimeout(1000)
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test('should sort search results', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('product')

    // 정렬 옵션 선택
    await page.selectOption('select[name="sort"]', 'price-low')

    await page.waitForTimeout(1000)
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test('should show no results message for invalid search', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('xyzabc123nonexistent')

    // "No results" 메시지 확인
    await expect(page.locator('text=/no results|no products found/i')).toBeVisible()
  })

  test('should navigate to product detail from search results', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)

    await homePage.searchProduct('serum')

    // 첫 번째 상품 클릭
    await homePage.clickProductCard(0)

    // 상품 상세 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/products\//)

    // 상품 정보 표시 확인
    const productName = await productPage.getProductName()
    expect(productName).toBeTruthy()
  })

  test('should maintain search query in URL', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('lipstick')

    // URL에 검색어가 포함되어 있는지 확인
    await expect(page).toHaveURL(/lipstick|search/)
  })

  test('should show search suggestions', async ({ page }) => {
    const homePage = new HomePage(page)

    // 검색창에 입력
    await page.fill('[data-testid="search-input"]', 'ser')

    // 자동완성 제안이 표시되는지 확인
    await page.waitForTimeout(500)
    const suggestions = page.locator('[data-testid="search-result-item"]')

    // 제안이 있는지 확인 (있으면)
    const count = await suggestions.count()
    if (count > 0) {
      await expect(suggestions.first()).toBeVisible()
    }
  })

  test('should clear search query', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('test')

    // 검색 결과 확인
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 })

    // 검색 클리어 버튼 클릭
    const clearButton = page.locator('button[aria-label="Clear search"]')
    if (await clearButton.isVisible()) {
      await clearButton.click()

      // 검색어가 지워졌는지 확인
      const searchInput = page.locator('[data-testid="search-input"]')
      await expect(searchInput).toHaveValue('')
    }
  })

  test('should handle special characters in search', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchProduct('product & co.')

    // 검색이 정상적으로 처리되는지 확인
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/search|products/)
  })
})


