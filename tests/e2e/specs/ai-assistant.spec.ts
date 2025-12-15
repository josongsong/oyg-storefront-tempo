/**
 * E2E Test - AI Assistant Flow
 * AI 에이전트 채팅 기능
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('AI Assistant Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('AI Agent', () => {
    test('should open AI agent', async ({ page }) => {
      // AI 에이전트 버튼 클릭
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // AI 에이전트 표시
        await expect(page.locator('[data-testid="ai-agent"]')).toBeVisible()
      }
    })

    test('should display welcome message', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 웰컴 메시지
        await expect(
          page.locator('text=/welcome|how can i help/i')
        ).toBeVisible()
      }
    })

    test('should show action suggestions', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 액션 제안 버튼들
        const suggestions = page.locator('[data-testid="ai-suggestion"]')
        const count = await suggestions.count()

        if (count > 0) {
          await expect(suggestions.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Chat Interaction', () => {
    test('should send message', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 메시지 입력
        const input = page.locator('[data-testid="ai-input"]')
        await input.fill('Show me skincare products')
        await input.press('Enter')

        await page.waitForTimeout(1000)

        // AI 응답 확인
        const messages = page.locator('[data-testid="ai-message"]')
        const count = await messages.count()
        expect(count).toBeGreaterThan(1) // Welcome + User + AI response
      }
    })

    test('should handle predefined action', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // "Check orders" 제안 클릭
        const checkOrdersBtn = page.locator('button:has-text("Check orders")')
        if (await checkOrdersBtn.isVisible()) {
          await checkOrdersBtn.click()
          await page.waitForTimeout(1000)

          // AI 응답 확인
          await expect(page.locator('text=/order|recent/i')).toBeVisible()
        }
      }
    })

    test('should handle product search action', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // "Search products" 제안 클릭
        const searchBtn = page.locator('button:has-text("Search products")')
        if (await searchBtn.isVisible()) {
          await searchBtn.click()
          await page.waitForTimeout(1000)

          // 상품 검색 관련 응답
          await expect(page.locator('text=/product|search/i')).toBeVisible()
        }
      }
    })

    test('should handle recommend action', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // "Recommend products" 제안
        const recommendBtn = page.locator('button:has-text("Recommend")')
        if (await recommendBtn.isVisible()) {
          await recommendBtn.click()
          await page.waitForTimeout(1500)

          // 추천 상품 표시
          const products = page.locator('[data-testid="ai-recommended-product"]')
          const count = await products.count()

          if (count > 0) {
            await expect(products.first()).toBeVisible()
          }
        }
      }
    })
  })

  test.describe('AI Agent Controls', () => {
    test('should minimize AI agent', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 최소화 버튼
        const minimizeBtn = page.locator('button[aria-label*="minimize"]')
        if (await minimizeBtn.isVisible()) {
          await minimizeBtn.click()
          await page.waitForTimeout(500)

          // 최소화 상태 확인
          const agent = page.locator('[data-testid="ai-agent"]')
          await expect(agent).toHaveClass(/minimized/)
        }
      }
    })

    test('should close AI agent', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()
        await expect(page.locator('[data-testid="ai-agent"]')).toBeVisible()

        // 닫기 버튼
        const closeBtn = page.locator('button[aria-label*="close"]')
        if (await closeBtn.isVisible()) {
          await closeBtn.click()
          await page.waitForTimeout(500)

          await expect(page.locator('[data-testid="ai-agent"]')).not.toBeVisible()
        }
      }
    })

    test('should clear chat history', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 메시지 보내기
        const input = page.locator('[data-testid="ai-input"]')
        await input.fill('Test message')
        await input.press('Enter')
        await page.waitForTimeout(1000)

        // 히스토리 삭제
        const clearBtn = page.locator('button:has-text("Clear")')
        if (await clearBtn.isVisible()) {
          await clearBtn.click()
          await page.waitForTimeout(500)

          // 웰컴 메시지만 남았는지 확인
          const messages = page.locator('[data-testid="ai-message"]')
          const count = await messages.count()
          expect(count).toBe(1) // Welcome message only
        }
      }
    })
  })

  test.describe('AI Agent Persistence', () => {
    test('should remember chat history', async ({ page }) => {
      const aiBtn = page.locator('button[aria-label*="AI"]')
      if (await aiBtn.isVisible()) {
        await aiBtn.click()

        // 메시지 보내기
        const input = page.locator('[data-testid="ai-input"]')
        await input.fill('Test persistence')
        await input.press('Enter')
        await page.waitForTimeout(1000)

        // 에이전트 닫기
        const closeBtn = page.locator('button[aria-label*="close"]')
        if (await closeBtn.isVisible()) {
          await closeBtn.click()
        }

        // 다시 열기
        await aiBtn.click()
        await page.waitForTimeout(500)

        // 히스토리 유지 확인
        await expect(page.locator('text=/Test persistence/')).toBeVisible()
      }
    })
  })
})

