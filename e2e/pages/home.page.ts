/**
 * Home Page Object Model
 */

import { BasePage } from './base.page'
import { TEST_IDS } from '../../tests/config/test-ids'

export class HomePage extends BasePage {
  /**
   * 홈페이지로 이동
   */
  async goto() {
    await super.goto('/')
    await this.waitForLoadingComplete()
  }

  /**
   * 상품 검색
   */
  async searchProduct(query: string) {
    await this.fillByTestId(TEST_IDS.SEARCH.INPUT, query)
    await this.page.keyboard.press('Enter')
  }

  /**
   * 특정 상품 카드 클릭
   */
  async clickProductCard(index: number = 0) {
    const cards = this.page.locator(`[data-testid="${TEST_IDS.PRODUCT.CARD}"]`)
    await cards.nth(index).click()
  }

  /**
   * 상품이 표시되는지 확인
   */
  async isProductVisible(productName: string) {
    return await this.page.isVisible(`text=${productName}`)
  }
}
