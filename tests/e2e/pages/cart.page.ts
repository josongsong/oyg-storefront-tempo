/**
 * Cart Page Object Model
 */

import { BasePage } from './base.page'
import { TEST_IDS } from '../../tests/config/test-ids'

export class CartPage extends BasePage {
  /**
   * 장바구니 페이지로 이동
   */
  async goto() {
    await super.goto('/cart')
    await this.waitForLoadingComplete()
  }

  /**
   * 장바구니 아이템 개수
   */
  async getItemCount() {
    const items = this.page.locator(`[data-testid="${TEST_IDS.CART.ITEM}"]`)
    return await items.count()
  }

  /**
   * 총 금액 가져오기
   */
  async getTotal() {
    return await this.getByTestId(TEST_IDS.CART.TOTAL).textContent()
  }

  /**
   * 체크아웃 버튼 클릭
   */
  async checkout() {
    await this.clickByTestId(TEST_IDS.CART.CHECKOUT_BTN)
  }

  /**
   * 아이템 제거
   */
  async removeItem(index: number = 0) {
    const removeButtons = this.page.locator(
      `[data-testid="${TEST_IDS.CART.REMOVE_BTN}"]`
    )
    await removeButtons.nth(index).click()
  }

  /**
   * 장바구니가 비어있는지 확인
   */
  async isEmpty() {
    return await this.page.isVisible(`[data-testid="${TEST_IDS.COMMON.EMPTY_STATE}"]`)
  }
}
