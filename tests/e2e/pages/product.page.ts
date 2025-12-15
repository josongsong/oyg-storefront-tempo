/**
 * Product Page Object Model
 */

import { BasePage } from './base.page'
import { type Locator } from '@playwright/test'

export class ProductPage extends BasePage {
  readonly productName: Locator
  readonly addToCartButton: Locator
  readonly wishlistButton: Locator
  readonly price: Locator

  constructor(page: any) {
    super(page)
    this.productName = page.locator('h1, h2').first()
    this.addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("장바구니에 추가")')
    this.wishlistButton = page.locator('button:has(svg)').filter({ hasText: /wishlist|heart/i }).first()
    this.price = page.locator('text=/\\$\\d+|\₩\\d+/').first()
  }

  async addToCart() {
    await this.addToCartButton.first().click()
  }

  async getProductName(): Promise<string> {
    return await this.productName.textContent() || ''
  }

  async getPrice(): Promise<string> {
    return await this.price.textContent() || ''
  }
}
