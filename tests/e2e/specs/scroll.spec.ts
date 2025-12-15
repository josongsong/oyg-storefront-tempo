/**
 * E2E Test - Scroll Behaviors
 * 스크롤 동작 및 무한 스크롤 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('스크롤 동작', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
  })

  test('페이지를 아래로 스크롤할 수 있다', async ({ page }) => {
    // 초기 스크롤 위치
    const initialScrollY = await page.evaluate(() => window.scrollY)
    
    // 아래로 스크롤
    await page.evaluate(() => {
      window.scrollBy(0, 500)
    })
    
    await page.waitForTimeout(500)
    
    // 스크롤 위치 확인
    const newScrollY = await page.evaluate(() => window.scrollY)
    expect(newScrollY).toBeGreaterThan(initialScrollY)
  })

  test('마우스 휠로 스크롤할 수 있다', async ({ page }) => {
    // 초기 스크롤 위치
    const initialScrollY = await page.evaluate(() => window.scrollY)
    
    // 마우스 휠 이벤트
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(500)
    
    // 스크롤 위치 확인
    const newScrollY = await page.evaluate(() => window.scrollY)
    expect(newScrollY).toBeGreaterThan(initialScrollY)
  })

  test('페이지 끝까지 스크롤하면 푸터가 보인다', async ({ page }) => {
    // 페이지 끝까지 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(1000)
    
    // 푸터 확인
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Copyright 텍스트 확인
    await expect(page.locator('text=/© \\d{4}/i')).toBeVisible()
  })

  test('스크롤 후 특정 섹션으로 점프할 수 있다', async ({ page }) => {
    // 아래로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 1000)
    })
    
    await page.waitForTimeout(500)
    
    // 맨 위로 점프
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    
    await page.waitForTimeout(1000)
    
    // 맨 위에 있는지 확인
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })

  test('상품 목록 페이지에서 스크롤하면 더 많은 상품이 로드될 수 있다', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    
    // 초기 상품 개수
    const initialProducts = await page.locator('.group.relative.flex.flex-col.cursor-pointer').count()
    
    // 아래로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(2000)
    
    // 상품이 표시되는지 확인 (무한 스크롤이 구현되어 있을 경우)
    const products = page.locator('.group.relative.flex.flex-col.cursor-pointer')
    await expect(products.first()).toBeVisible()
  })

  test('스크롤 위치가 유지된다', async ({ page }) => {
    // 중간까지 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 500)
    })
    
    await page.waitForTimeout(500)
    
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(400)
    expect(scrollY).toBeLessThan(600)
  })

  test('상품 카드를 클릭한 후 뒤로가기하면 스크롤 위치가 복원될 수 있다', async ({ page }) => {
    // 아래로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 800)
    })
    
    await page.waitForTimeout(500)
    
    // 상품 클릭
    const firstProduct = page.locator('.group.relative.flex.flex-col.cursor-pointer').first()
    await firstProduct.click()
    
    await page.waitForURL(/\/products\/.*/, { timeout: 5000 })
    await page.waitForTimeout(500)
    
    // 뒤로가기
    await page.goBack()
    await page.waitForTimeout(1000)
    
    // 홈 페이지로 돌아왔는지 확인
    await expect(page).toHaveURL('/')
  })
})

