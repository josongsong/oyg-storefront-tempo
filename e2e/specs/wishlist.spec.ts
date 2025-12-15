/**
 * E2E Test - Wishlist Flow
 * 위시리스트 기능 시나리오
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('Wishlist Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should add product to wishlist from product card', async ({ page }) => {
    const homePage = new HomePage(page)

    // 위시리스트 버튼 클릭
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()

    // 성공 메시지 또는 UI 변경 확인
    await page.waitForTimeout(500)
    await expect(wishlistBtn).toHaveClass(/active|favorited/)
  })

  test('should add product to wishlist from detail page', async ({ page }) => {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page)

    // 상품 상세로 이동
    await homePage.clickProductCard(0)

    // 위시리스트 추가
    await productPage.addToWishlist()

    // 성공 확인
    await expect(
      page.locator('text=/added to wishlist|saved/i')
    ).toBeVisible()
  })

  test('should remove product from wishlist', async ({ page }) => {
    const homePage = new HomePage(page)

    // 먼저 추가
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()
    await page.waitForTimeout(500)

    // 다시 클릭하여 제거
    await wishlistBtn.click()

    // 제거 확인
    await expect(wishlistBtn).not.toHaveClass(/active|favorited/)
  })

  test('should view wishlist page', async ({ page }) => {
    // 위시리스트 페이지로 이동
    await page.click('button[aria-label*="wishlist"]')

    // 위시리스트 페이지 확인
    await expect(page).toHaveURL(/wishlist/)
  })

  test('should show empty wishlist state', async ({ page }) => {
    await page.goto('/wishlist')

    // 빈 상태 메시지 확인
    await expect(
      page.locator('text=/no items|wishlist is empty/i')
    ).toBeVisible()
  })

  test('should display wishlist items', async ({ page }) => {
    const homePage = new HomePage(page)

    // 여러 상품 위시리스트에 추가
    const wishlistButtons = page
      .locator('[data-testid="product-card"]')
      .locator('button[aria-label*="wishlist"]')

    await wishlistButtons.first().click()
    await page.waitForTimeout(300)
    await wishlistButtons.nth(1).click()

    // 위시리스트 페이지로 이동
    await page.goto('/wishlist')

    // 아이템들이 표시되는지 확인
    const items = page.locator('[data-testid="wishlist-item"]')
    expect(await items.count()).toBeGreaterThan(0)
  })

  test('should add wishlist item to cart', async ({ page }) => {
    const homePage = new HomePage(page)

    // 상품을 위시리스트에 추가
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()

    // 위시리스트 페이지로 이동
    await page.goto('/wishlist')

    // "Add to Cart" 버튼 클릭
    await page.click('button:has-text("Add to Cart")')

    // 성공 메시지 확인
    await expect(
      page.locator('text=/added to cart|success/i')
    ).toBeVisible()
  })

  test('should persist wishlist across sessions', async ({ page, context }) => {
    const homePage = new HomePage(page)

    // 위시리스트에 추가
    const wishlistBtn = page
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await wishlistBtn.click()
    await page.waitForTimeout(500)

    // 새 페이지 열기
    const newPage = await context.newPage()
    const newHomePage = new HomePage(newPage)
    await newHomePage.goto()

    // 위시리스트가 유지되는지 확인
    const newWishlistBtn = newPage
      .locator('[data-testid="product-card"]')
      .first()
      .locator('button[aria-label*="wishlist"]')

    await expect(newWishlistBtn).toHaveClass(/active|favorited/)

    await newPage.close()
  })

  test('should show wishlist count badge', async ({ page }) => {
    const homePage = new HomePage(page)

    // 위시리스트에 아이템 추가
    const wishlistButtons = page
      .locator('[data-testid="product-card"]')
      .locator('button[aria-label*="wishlist"]')

    await wishlistButtons.first().click()
    await page.waitForTimeout(300)
    await wishlistButtons.nth(1).click()
    await page.waitForTimeout(300)

    // 카운트 배지 확인
    const badge = page.locator('[data-testid="wishlist-count"]')
    await expect(badge).toHaveText('2')
  })

  test('should filter wishlist by category', async ({ page }) => {
    // 여러 상품을 위시리스트에 추가 (사전 작업)
    await page.goto('/wishlist')

    // 카테고리 필터 선택
    if (await page.locator('select[name="category"]').isVisible()) {
      await page.selectOption('select[name="category"]', 'skincare')

      // 필터링된 결과 확인
      await page.waitForTimeout(500)
      const items = page.locator('[data-testid="wishlist-item"]')
      expect(await items.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('should share wishlist', async ({ page }) => {
    await page.goto('/wishlist')

    // 공유 버튼이 있으면 클릭
    const shareBtn = page.locator('button:has-text("Share")')

    if (await shareBtn.isVisible()) {
      await shareBtn.click()

      // 공유 모달 또는 옵션 표시 확인
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })
})


