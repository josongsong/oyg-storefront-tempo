/**
 * Base Page Object Model
 * 모든 페이지의 공통 기능
 */

import { type Page, type Locator } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * 페이지 이동
   */
  async goto(path: string) {
    await this.page.goto(path)
  }

  /**
   * 특정 텍스트가 보일 때까지 대기
   */
  async waitForText(text: string) {
    await this.page.waitForSelector(`text=${text}`)
  }

  /**
   * 로딩 완료 대기
   */
  async waitForLoadingComplete() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 스크린샷 촬영
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png` })
  }

  /**
   * 특정 요소 클릭
   */
  async clickByTestId(testId: string) {
    await this.page.click(`[data-testid="${testId}"]`)
  }

  /**
   * 특정 요소에 텍스트 입력
   */
  async fillByTestId(testId: string, text: string) {
    await this.page.fill(`[data-testid="${testId}"]`, text)
  }

  /**
   * 특정 요소 가져오기
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`)
  }
}
