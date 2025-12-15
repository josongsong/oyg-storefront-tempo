/**
 * Home Page Object Model
 */

import { BasePage } from './base.page'
import { type Locator } from '@playwright/test'

export class HomePage extends BasePage {
  readonly productCards: Locator
  readonly searchButton: Locator

  constructor(page: any) {
    super(page)
    this.productCards = page.locator('.group.relative.flex.flex-col.cursor-pointer')
    this.searchButton = page.locator('button[aria-label*="search"], button:has-text("Search")')
  }

  async goto() {
    await super.goto('/')
    await this.page.waitForTimeout(1000)
  }

  async clickFirstProduct() {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 })
    await this.productCards.first().click()
  }

  async getProductCount(): Promise<number> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 })
    return await this.productCards.count()
  }
}
