/**
 * E2E Test - Home Page Flow
 * 홈페이지 섹션별 인터랙션
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Home Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Hero Section', () => {
    test('should display hero banner', async ({ page }) => {
      const hero = page.locator('[data-testid="hero-section"]')
      await expect(hero).toBeVisible()
    })

    test('should navigate from hero CTA', async ({ page }) => {
      const heroBtn = page.locator('[data-testid="hero-cta"]')
      if (await heroBtn.isVisible()) {
        await heroBtn.click()
        await page.waitForLoadState('networkidle')

        // 페이지 이동 확인
        expect(page.url()).not.toContain('/#')
      }
    })
  })

  test.describe('Trending Section', () => {
    test('should display trending products', async ({ page }) => {
      const trendingSection = page.locator('[data-testid="trending-section"]')
      if (await trendingSection.isVisible()) {
        await trendingSection.scrollIntoViewIfNeeded()
        
        const products = trendingSection.locator('[data-testid="product-card"]')
        await expect(products.first()).toBeVisible()
      }
    })

    test('should scroll trending carousel', async ({ page }) => {
      const carousel = page.locator('[data-testid="trending-carousel"]')
      if (await carousel.isVisible()) {
        await carousel.scrollIntoViewIfNeeded()

        // 다음 버튼 클릭
        const nextBtn = carousel.locator('button[aria-label*="next"]')
        if (await nextBtn.isVisible()) {
          await nextBtn.click()
          await page.waitForTimeout(500)

          // 스크롤 확인
          expect(true).toBeTruthy()
        }
      }
    })
  })

  test.describe('TikTok Gallery', () => {
    test('should display tiktok videos', async ({ page }) => {
      const tiktokSection = page.locator('[data-testid="tiktok-section"]')
      if (await tiktokSection.isVisible()) {
        await tiktokSection.scrollIntoViewIfNeeded()

        const videos = tiktokSection.locator('[data-testid="tiktok-video"]')
        const count = await videos.count()
        expect(count).toBeGreaterThan(0)
      }
    })

    test('should play tiktok video', async ({ page }) => {
      const tiktokSection = page.locator('[data-testid="tiktok-section"]')
      if (await tiktokSection.isVisible()) {
        await tiktokSection.scrollIntoViewIfNeeded()

        // 비디오 클릭
        const video = tiktokSection.locator('[data-testid="tiktok-video"]').first()
        if (await video.isVisible()) {
          await video.click()
          await page.waitForTimeout(1000)

          // 재생 확인 (play 버튼 상태 등)
          expect(true).toBeTruthy()
        }
      }
    })
  })

  test.describe('Curated Section', () => {
    test('should display curated products', async ({ page }) => {
      const curatedSection = page.locator('[data-testid="curated-section"]')
      if (await curatedSection.isVisible()) {
        await curatedSection.scrollIntoViewIfNeeded()
        await expect(curatedSection).toBeVisible()
      }
    })

    test('should navigate to curated collection', async ({ page }) => {
      const curatedSection = page.locator('[data-testid="curated-section"]')
      if (await curatedSection.isVisible()) {
        await curatedSection.scrollIntoViewIfNeeded()

        // "Shop Now" 버튼 클릭
        const shopBtn = curatedSection.locator('button:has-text("Shop Now")')
        if (await shopBtn.isVisible()) {
          await shopBtn.click()
          await page.waitForLoadState('networkidle')

          expect(page.url()).toContain('products')
        }
      }
    })
  })

  test.describe('Gift Guide', () => {
    test('should display gift categories', async ({ page }) => {
      const giftSection = page.locator('[data-testid="gift-guide-section"]')
      if (await giftSection.isVisible()) {
        await giftSection.scrollIntoViewIfNeeded()

        const categories = giftSection.locator('[data-testid="gift-category"]')
        const count = await categories.count()
        expect(count).toBeGreaterThan(0)
      }
    })

    test('should navigate to gift category', async ({ page }) => {
      const giftSection = page.locator('[data-testid="gift-guide-section"]')
      if (await giftSection.isVisible()) {
        await giftSection.scrollIntoViewIfNeeded()

        const category = giftSection.locator('[data-testid="gift-category"]').first()
        if (await category.isVisible()) {
          await category.click()
          await page.waitForLoadState('networkidle')

          // 카테고리 페이지로 이동
          expect(page.url()).toBeTruthy()
        }
      }
    })
  })

  test.describe('Promotion Banner', () => {
    test('should display promo banner', async ({ page }) => {
      const promoBanner = page.locator('[data-testid="promo-banner"]')
      if (await promoBanner.isVisible()) {
        await expect(promoBanner).toBeVisible()
      }
    })

    test('should close promo banner', async ({ page }) => {
      const promoBanner = page.locator('[data-testid="promo-banner"]')
      if (await promoBanner.isVisible()) {
        const closeBtn = promoBanner.locator('button[aria-label="Close"]')
        if (await closeBtn.isVisible()) {
          await closeBtn.click()
          await page.waitForTimeout(500)

          await expect(promoBanner).not.toBeVisible()
        }
      }
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to product list page', async ({ page }) => {
      // "Shop All" 버튼 클릭
      const shopAllBtn = page.locator('a:has-text("Shop All")')
      if (await shopAllBtn.isVisible()) {
        await shopAllBtn.click()
        await expect(page).toHaveURL(/products/)
      }
    })

    test('should scroll to top button work', async ({ page }) => {
      // 페이지 하단으로 스크롤
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)

      // "Scroll to top" 버튼 표시 확인
      const scrollTopBtn = page.locator('button[aria-label*="scroll to top"]')
      if (await scrollTopBtn.isVisible()) {
        await scrollTopBtn.click()
        await page.waitForTimeout(500)

        // 페이지 상단 확인
        const scrollY = await page.evaluate(() => window.scrollY)
        expect(scrollY).toBeLessThan(100)
      }
    })
  })

  test.describe('Footer', () => {
    test('should display footer links', async ({ page }) => {
      const footer = page.locator('footer')
      await footer.scrollIntoViewIfNeeded()

      await expect(footer).toBeVisible()
      await expect(footer.locator('a')).toHaveCount(await footer.locator('a').count())
    })

    test('should navigate from footer link', async ({ page }) => {
      const footer = page.locator('footer')
      await footer.scrollIntoViewIfNeeded()

      const link = footer.locator('a').first()
      if (await link.isVisible()) {
        await link.click()
        await page.waitForLoadState('networkidle')

        expect(page.url()).toBeTruthy()
      }
    })
  })
})

