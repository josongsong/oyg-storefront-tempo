/**
 * Cart Page Object Model
 */

import { BasePage } from './base.page'
import { type Locator } from '@playwright/test'

export class CartPage extends BasePage {
  readonly cartItems: Locator
  readonly checkoutButton: Locator
  readonly emptyCartMessage: Locator
  readonly totalPrice: Locator

  constructor(page: any) {
    super(page)
    this.cartItems = page.locator('[class*="cart-item"], .item')
    this.checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("결제하기")')
    this.emptyCartMessage = page.locator('text=/empty|비어있습니다/i')
    this.totalPrice = page.locator('text=/total|합계/i').locator('..').locator('text=/\\$\\d+|\₩\\d+/')
  }

  async goto() {
    await super.goto('/cart')
    await this.page.waitForTimeout(1000)
  }

  async getItemCount(): Promise<number> {
    try {
      return await this.cartItems.count()
    } catch {
      return 0
    }
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible()
  }

  async checkout() {
    await this.checkoutButton.click()
  }
}
