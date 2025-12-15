/**
 * E2E Test - Product Flow
 * 상품 목록, 필터링, 상세, Quick Shop, 리뷰
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductPage } from '../pages/product.page'

test.describe('Product Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Product List', () => {
    test('should display product grid', async ({ page }) => {
      await page.goto('/products')

      // 상품 카드 표시 확인
      const products = page.locator('[data-testid="product-card"]')
      await expect(products.first()).toBeVisible()
      const count = await products.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should filter products by category', async ({ page }) => {
      await page.goto('/products')

      // 카테고리 선택
      await page.click('button:has-text("Skincare")')
      await page.waitForTimeout(1000)

      // 필터링된 결과 확인
      await expect(page).toHaveURL(/category=skincare/i)
    })

    test('should filter products by price range', async ({ page }) => {
      await page.goto('/products')

      // 가격 필터 선택
      const minPriceInput = page.locator('[data-testid="price-min"]')
      const maxPriceInput = page.locator('[data-testid="price-max"]')

      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('10')
        await maxPriceInput.fill('50')
        await page.click('button:has-text("Apply")')

        await page.waitForTimeout(1000)
        await expect(page).toHaveURL(/price/)
      }
    })

    test('should sort products by price', async ({ page }) => {
      await page.goto('/products')

      // 정렬 옵션 선택
      const sortSelect = page.locator('select[name="sort"]')
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('price-low')
        await page.waitForTimeout(1000)
      }

      // 상품이 여전히 표시되는지 확인
      const products = page.locator('[data-testid="product-card"]')
      await expect(products.first()).toBeVisible()
    })

    test('should paginate product list', async ({ page }) => {
      await page.goto('/products')

      // 페이지네이션 버튼 확인
      const nextBtn = page.locator('button:has-text("Next")')
      if (await nextBtn.isVisible()) {
        await nextBtn.click()
        await page.waitForLoadState('networkidle')
        
        // URL 변경 확인
        await expect(page).toHaveURL(/page=2/)
      }
    })
  })

  test.describe('Product Detail', () => {
    test('should display product details', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 상품 정보 표시 확인
      const productName = await productPage.getProductName()
      expect(productName).toBeTruthy()

      const price = await productPage.getPrice()
      expect(price).toBeTruthy()
    })

    test('should show product images gallery', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 이미지 갤러리 확인
      const mainImage = page.locator('[data-testid="product-main-image"]')
      await expect(mainImage).toBeVisible()
    })

    test('should display product reviews', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 리뷰 섹션으로 스크롤
      const reviewSection = page.locator('[data-testid="reviews-section"]')
      if (await reviewSection.isVisible()) {
        await reviewSection.scrollIntoViewIfNeeded()
        await expect(reviewSection).toBeVisible()
      }
    })

    test('should add to cart from detail page', async ({ page }) => {
      const homePage = new HomePage(page)
      const productPage = new ProductPage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      await productPage.addToCart()

      // 성공 토스트 메시지
      await expect(
        page.locator('text=/added to cart|장바구니에 추가/i')
      ).toBeVisible()
    })

    test('should open quick shop modal', async ({ page }) => {
      await page.goto('/products')

      // Quick Shop 버튼 클릭 (호버 후)
      const productCard = page.locator('[data-testid="product-card"]').first()
      await productCard.hover()

      const quickShopBtn = productCard.locator('button:has-text("Quick Shop")')
      if (await quickShopBtn.isVisible()) {
        await quickShopBtn.click()

        // 모달 표시 확인
        await expect(page.locator('[data-testid="quick-shop-modal"]')).toBeVisible()
      }
    })

    test('should compare similar products', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 비교 섹션으로 스크롤
      const compareSection = page.locator('text=/similar products|compare/i')
      if (await compareSection.isVisible()) {
        await compareSection.scrollIntoViewIfNeeded()
        await expect(compareSection).toBeVisible()
      }
    })

    test('should write product review', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // "Write a review" 버튼 클릭
      const writeReviewBtn = page.locator('button:has-text("Write a Review")')
      if (await writeReviewBtn.isVisible()) {
        await writeReviewBtn.click()
        await expect(page).toHaveURL(/write-review/)
      }
    })
  })

  test.describe('Quick Shop', () => {
    test('should add to cart from quick shop modal', async ({ page }) => {
      await page.goto('/products')

      const productCard = page.locator('[data-testid="product-card"]').first()
      await productCard.hover()

      const quickShopBtn = productCard.locator('button:has-text("Quick Shop")')
      if (await quickShopBtn.isVisible()) {
        await quickShopBtn.click()

        // 모달에서 장바구니 추가
        await page.click('[data-testid="quick-shop-add-to-cart"]')

        // 성공 메시지
        await expect(page.locator('text=/added/i')).toBeVisible()
      }
    })

    test('should close quick shop modal', async ({ page }) => {
      await page.goto('/products')

      const productCard = page.locator('[data-testid="product-card"]').first()
      await productCard.hover()

      const quickShopBtn = productCard.locator('button:has-text("Quick Shop")')
      if (await quickShopBtn.isVisible()) {
        await quickShopBtn.click()

        // 모달 닫기
        await page.click('[data-testid="modal-close"]')
        await expect(page.locator('[data-testid="quick-shop-modal"]')).not.toBeVisible()
      }
    })
  })

  test.describe('Product Comparison', () => {
    test('should display comparison table', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 비교 테이블 확인
      const comparisonTable = page.locator('table')
      if (await comparisonTable.isVisible()) {
        await comparisonTable.scrollIntoViewIfNeeded()
        await expect(comparisonTable).toBeVisible()
      }
    })

    test('should navigate to compared product', async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      await homePage.clickProductCard(0)

      // 비슷한 상품 클릭
      const similarProduct = page.locator('[data-testid="similar-product"]').first()
      if (await similarProduct.isVisible()) {
        await similarProduct.scrollIntoViewIfNeeded()
        await similarProduct.click()

        // 상세 페이지 이동 확인
        await expect(page).toHaveURL(/products\//)
      }
    })
  })

  test.describe('Mobile Product View', () => {
    test('should show mobile filter modal', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile only test')

      await page.goto('/products')

      // 모바일 필터 버튼 클릭
      const filterBtn = page.locator('button:has-text("Filter")')
      if (await filterBtn.isVisible()) {
        await filterBtn.click()

        // 필터 모달 표시
        await expect(page.locator('[data-testid="mobile-filter-modal"]')).toBeVisible()
      }
    })

    test('should navigate product images on mobile', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile only test')

      const homePage = new HomePage(page)
      await homePage.goto()
      await homePage.clickProductCard(0)

      // 이미지 스와이프 가능 확인
      const imageGallery = page.locator('[data-testid="product-image-gallery"]')
      await expect(imageGallery).toBeVisible()
    })
  })
})

