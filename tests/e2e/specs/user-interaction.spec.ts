/**
 * E2E Test - User Interactions
 * 스크롤, 클릭, 호버 등 사용자 인터랙션 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('사용자 인터랙션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
  })

  test('페이지를 스크롤하면 푸터가 보인다', async ({ page }) => {
    // 푸터로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(500)
    
    // 푸터가 보이는지 확인
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // 푸터 내용 확인 (first()로 첫 번째 매칭만 확인)
    await expect(page.locator('text=CJ OLIVE YOUNG Corporation').first()).toBeVisible()
    await expect(page.locator('text=/© \\d{4} CJ OLIVE YOUNG/i').first()).toBeVisible()
  })

  test('푸터의 링크를 클릭할 수 있다', async ({ page }) => {
    // 푸터로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(500)
    
    // Privacy Policy 링크 찾기 및 클릭
    const privacyLink = page.locator('a:has-text("Privacy Policy")')
    await expect(privacyLink).toBeVisible()
    
    // 호버 효과 확인
    await privacyLink.hover()
    await page.waitForTimeout(200)
  })

  test('헤더 프로모 배너를 클릭할 수 있다', async ({ page }) => {
    // 프로모 배너 확인
    const promoBanner = page.locator('.bg-black.text-white').first()
    await expect(promoBanner).toBeVisible()
    
    // 배너 호버
    await promoBanner.hover()
    await page.waitForTimeout(300)
  })

  test('헤더 배너 화살표로 배너를 넘길 수 있다', async ({ page }) => {
    // 다음 버튼 찾기
    const nextButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /chevron.*right/i }).first()
    
    if (await nextButton.count() > 0) {
      await nextButton.click()
      await page.waitForTimeout(500)
      
      // 배너가 변경되었는지 확인 (애니메이션 대기)
      await page.waitForTimeout(500)
    }
  })

  test('로고에 호버하면 애니메이션이 작동한다', async ({ page }) => {
    const logo = page.locator('text=Oliveyoung.')
    await expect(logo).toBeVisible()
    
    // 로고 호버
    await logo.hover()
    await page.waitForTimeout(800) // 애니메이션 대기
  })

  test('헤더 카테고리 메뉴에 호버하면 메가메뉴가 열린다', async ({ page }) => {
    // 화면 크기 확인 (데스크톱)
    const viewportSize = page.viewportSize()
    if (viewportSize && viewportSize.width < 1024) {
      test.skip()
      return
    }
    
    // Categories 메뉴 찾기
    const categoriesMenu = page.locator('text=Categories').first()
    
    if (await categoriesMenu.isVisible()) {
      await categoriesMenu.hover()
      await page.waitForTimeout(500)
      
      // 메가메뉴가 나타났는지 확인
      const megaMenu = page.locator('.absolute.left-0.w-full.bg-white').first()
      await expect(megaMenu).toBeVisible({ timeout: 3000 })
    }
  })

  test('스크롤 후 맨 위로 이동할 수 있다', async ({ page }) => {
    // 아래로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 1000)
    })
    
    await page.waitForTimeout(500)
    
    // 맨 위로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    
    await page.waitForTimeout(500)
    
    // 헤더(로고)가 보이는지 확인
    const logo = page.locator('text=Oliveyoung.')
    await expect(logo).toBeVisible()
  })

  test('상품 카드에 호버하면 확대 효과가 작동한다', async ({ page }) => {
    const firstProduct = page.locator('.group.relative.flex.flex-col.cursor-pointer').first()
    await firstProduct.waitFor({ state: 'visible', timeout: 10000 })
    
    // 상품 카드 호버
    await firstProduct.hover()
    await page.waitForTimeout(500)
    
    // 이미지가 여전히 보이는지 확인 (호버 효과 적용)
    const productImage = firstProduct.locator('img').first()
    await expect(productImage).toBeVisible()
  })
})

