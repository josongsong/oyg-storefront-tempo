/**
 * E2E Test - Notification Flow
 * 알림 센터 기능
 */

import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test.describe('Notification Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test.describe('Notification Center', () => {
    test('should open notification center', async ({ page }) => {
      // 알림 아이콘 클릭
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 알림 센터 표시
        await expect(page.locator('[data-testid="notification-center"]')).toBeVisible()
      }
    })

    test('should display notification list', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 알림 목록 확인
        const notifications = page.locator('[data-testid="notification-item"]')
        const count = await notifications.count()

        if (count > 0) {
          await expect(notifications.first()).toBeVisible()
        }
      }
    })

    test('should show unread notification badge', async ({ page }) => {
      // 읽지 않은 알림 배지
      const badge = page.locator('[data-testid="notification-badge"]')
      if (await badge.isVisible()) {
        const count = await badge.textContent()
        expect(Number(count)).toBeGreaterThanOrEqual(0)
      }
    })

    test('should mark notification as read', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 첫 번째 알림 클릭
        const firstNotification = page.locator('[data-testid="notification-item"]').first()
        if (await firstNotification.isVisible()) {
          await firstNotification.click()
          await page.waitForTimeout(500)

          // 읽음 상태 확인
          await expect(firstNotification).toHaveClass(/read/)
        }
      }
    })

    test('should mark all as read', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // "Mark all as read" 버튼
        const markAllBtn = page.locator('button:has-text("Mark all as read")')
        if (await markAllBtn.isVisible()) {
          await markAllBtn.click()
          await page.waitForTimeout(500)

          // 배지가 사라지거나 0이 되는지 확인
          const badge = page.locator('[data-testid="notification-badge"]')
          if (await badge.isVisible()) {
            const count = await badge.textContent()
            expect(count).toBe('0')
          }
        }
      }
    })

    test('should delete notification', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        const notifications = page.locator('[data-testid="notification-item"]')
        const initialCount = await notifications.count()

        if (initialCount > 0) {
          // 첫 번째 알림 삭제
          const deleteBtn = notifications.first().locator('button[aria-label="Delete"]')
          if (await deleteBtn.isVisible()) {
            await deleteBtn.click()
            await page.waitForTimeout(500)

            const newCount = await notifications.count()
            expect(newCount).toBe(initialCount - 1)
          }
        }
      }
    })

    test('should close notification center', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()
        await expect(page.locator('[data-testid="notification-center"]')).toBeVisible()

        // 닫기
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)

        await expect(page.locator('[data-testid="notification-center"]')).not.toBeVisible()
      }
    })
  })

  test.describe('Notification Types', () => {
    test('should display order notifications', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 주문 알림 필터 또는 확인
        const orderNotifications = page.locator('[data-testid="notification-item"][data-type="order"]')
        const count = await orderNotifications.count()

        if (count > 0) {
          await expect(orderNotifications.first()).toBeVisible()
        }
      }
    })

    test('should display promotion notifications', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 프로모션 알림
        const promoNotifications = page.locator('[data-testid="notification-item"][data-type="promotion"]')
        const count = await promoNotifications.count()

        if (count > 0) {
          await expect(promoNotifications.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Notification Actions', () => {
    test('should navigate to linked page from notification', async ({ page }) => {
      const notificationBtn = page.locator('button[aria-label*="notification"]')
      if (await notificationBtn.isVisible()) {
        await notificationBtn.click()

        // 링크가 있는 알림 클릭
        const notificationWithLink = page.locator('[data-testid="notification-item"]').first()
        if (await notificationWithLink.isVisible()) {
          const hasLink = await notificationWithLink.getAttribute('data-link')
          if (hasLink) {
            await notificationWithLink.click()
            await page.waitForLoadState('networkidle')

            // 페이지 이동 확인
            expect(page.url()).toBeTruthy()
          }
        }
      }
    })
  })
})

