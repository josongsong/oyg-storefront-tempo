/**
 * Wait Utilities for Testing
 */

import { waitFor } from '@testing-library/react'

/**
 * 특정 조건이 만족될 때까지 대기
 */
export const waitForCondition = async (
  condition: () => boolean,
  options?: { timeout?: number; interval?: number }
) => {
  const timeout = options?.timeout ?? 3000
  const interval = options?.interval ?? 50
  
  return waitFor(
    () => {
      if (!condition()) {
        throw new Error('Condition not met')
      }
    },
    { timeout, interval }
  )
}

/**
 * 특정 시간만큼 대기 (디바운스 등 테스트용)
 */
export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 다음 틱까지 대기
 */
export const waitForNextTick = () => {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * DOM 업데이트 대기
 */
export const waitForDomUpdate = () => {
  return waitFor(() => {})
}
