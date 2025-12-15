/**
 * Product Page Object Model
 */

import { BasePage } from './base.page'
import { TEST_IDS } from '../../tests/config/test-ids'

export class ProductPage extends BasePage {
  /**
   * 상품 상세 페이지로 이동
   */
  async goto(productId: string) {
    await super.goto(`/products/${productId}`)
    await this.waitForLoadingComplete()
  }

  /**
   * 장바구니에 추가
   */
  async addToCart() {
    await this.clickByTestId(TEST_IDS.PRODUCT.ADD_TO_CART)
  }

  /**
   * 위시리스트에 추가
   */
  async addToWishlist() {
    await this.clickByTestId(TEST_IDS.PRODUCT.ADD_TO_WISHLIST)
  }

  /**
   * 상품명 가져오기
   */
  async getProductName() {
    return await this.getByTestId(TEST_IDS.PRODUCT.NAME).textContent()
  }

  /**
   * 가격 가져오기
   */
  async getPrice() {
    return await this.getByTestId(TEST_IDS.PRODUCT.PRICE).textContent()
  }
}
