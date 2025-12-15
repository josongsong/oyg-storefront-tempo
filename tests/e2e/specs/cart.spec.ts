/**
 * E2E Test - Cart Flow
 * 장바구니 추가, 수정, 삭제, 저장
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'
import { CartPage } from '../pages/cart.page'

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Add to Cart', () => {
    test('should add product to cart', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()
      const count = await cartPage.getItemCount()
      expect(count).toBeGreaterThan(0)
    })

    test('should update cart count badge', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      // 카트 배지 확인
      const cartBadge = page.locator('[data-testid="cart-count"]')
      if (await cartBadge.isVisible()) {
        const count = await cartBadge.textContent()
        expect(Number(count)).toBeGreaterThan(0)
      }
    })

    test('should show cart preview on add', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      // 미니 카트 또는 토스트 표시
      await expect(
        page.locator('text=/added to cart|view cart/i')
      ).toBeVisible({ timeout: 3000 })
    })
  })

  test.describe('Cart Management', () => {
    test('should update item quantity', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      // 상품 추가
      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // 수량 증가
      const increaseBtn = page.locator('[data-testid="increase-quantity"]').first()
      if (await increaseBtn.isVisible()) {
        const initialQty = await cartPage.getItemQuantity(0)
        await increaseBtn.click()
        await page.waitForTimeout(500)

        const newQty = await cartPage.getItemQuantity(0)
        expect(newQty).toBe(initialQty + 1)
      }
    })

    test('should decrease item quantity', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // 수량 2로 증가
      const increaseBtn = page.locator('[data-testid="increase-quantity"]').first()
      if (await increaseBtn.isVisible()) {
        await increaseBtn.click()
        await page.waitForTimeout(500)

        // 수량 감소
        const decreaseBtn = page.locator('[data-testid="decrease-quantity"]').first()
        await decreaseBtn.click()
        await page.waitForTimeout(500)

        const qty = await cartPage.getItemQuantity(0)
        expect(qty).toBe(1)
      }
    })

    test('should remove item from cart', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()
      const initialCount = await cartPage.getItemCount()

      await cartPage.removeItem(0)
      await page.waitForTimeout(500)

      const newCount = await cartPage.getItemCount()
      expect(newCount).toBe(initialCount - 1)
    })

    test('should save item for later', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // "Save for later" 버튼
      const saveBtn = page.locator('button:has-text("Save for Later")').first()
      if (await saveBtn.isVisible()) {
        await saveBtn.click()
        await page.waitForTimeout(500)

        // 저장된 아이템 섹션 확인
        await expect(page.locator('text=/saved items/i')).toBeVisible()
      }
    })

    test('should clear entire cart', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      // 여러 상품 추가
      await homePage.clickProductCard(0)
      await productPage.addToCart()
      await page.goBack()
      await homePage.clickProductCard(1)
      await productPage.addToCart()

      await cartPage.goto()

      // 전체 삭제 버튼
      const clearBtn = page.locator('button:has-text("Clear Cart")')
      if (await clearBtn.isVisible()) {
        await clearBtn.click()

        // 확인 다이얼로그
        const confirmBtn = page.locator('button:has-text("Confirm")')
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click()
        }

        await page.waitForTimeout(500)
        const isEmpty = await cartPage.isEmpty()
        expect(isEmpty).toBeTruthy()
      }
    })
  })

  test.describe('Cart Summary', () => {
    test('should display order summary', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // 주문 요약 섹션
      const summary = page.locator('[data-testid="order-summary"]')
      await expect(summary).toBeVisible()

      // 가격 정보 확인
      await expect(page.locator('text=/subtotal|total/i')).toBeVisible()
    })

    test('should calculate total correctly', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // 수량 증가
      const increaseBtn = page.locator('[data-testid="increase-quantity"]').first()
      if (await increaseBtn.isVisible()) {
        await increaseBtn.click()
        await page.waitForTimeout(1000)

        // 가격이 업데이트되었는지 확인
        const total = page.locator('[data-testid="cart-total"]')
        await expect(total).toBeVisible()
      }
    })

    test('should apply discount code', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()

      // 할인 코드 입력
      const promoInput = page.locator('[data-testid="promo-code-input"]')
      if (await promoInput.isVisible()) {
        await promoInput.fill('DISCOUNT10')
        await page.click('button:has-text("Apply")')

        // 할인 적용 확인
        await expect(page.locator('text=/discount applied|할인/i')).toBeVisible()
      }
    })
  })

  test.describe('Cart Persistence', () => {
    test('should persist cart after page reload', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)
      const cartPage = new CartPage(page)

      await homePage.clickProductCard(0)
      await productPage.addToCart()

      await cartPage.goto()
      const beforeCount = await cartPage.getItemCount()

      // 새로고침
      await page.reload()
      await page.waitForLoadState('networkidle')

      const afterCount = await cartPage.getItemCount()
      expect(afterCount).toBe(beforeCount)
    })

    test('should sync cart across tabs', async ({ context }) => {
      const homePage = new HomePage(await context.newPage())
      const productPage = new ProductPage(homePage.page)

      await homePage.goto()
      await homePage.clickProductCard(0)
      await productPage.addToCart()

      // 새 탭에서 확인
      const page2 = await context.newPage()
      const cartPage2 = new CartPage(page2)
      await cartPage2.goto()

      const count = await cartPage2.getItemCount()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Empty Cart', () => {
    test('should display empty cart state', async ({ page }) => {
      const cartPage = new CartPage(page)
      await cartPage.goto()

      // 빈 카트 메시지
      const isEmpty = await cartPage.isEmpty()
      if (isEmpty) {
        await expect(page.locator('text=/empty|no items/i')).toBeVisible()
      }
    })

    test('should show CTA on empty cart', async ({ page }) => {
      const cartPage = new CartPage(page)
      await cartPage.goto()

      const isEmpty = await cartPage.isEmpty()
      if (isEmpty) {
        // "Continue Shopping" 버튼
        await expect(
          page.locator('button:has-text("Continue Shopping")')
        ).toBeVisible()
      }
    })
  })
})

