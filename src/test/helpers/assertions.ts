/**
 * Custom Test Assertions
 */

import { expect } from 'vitest'

/**
 * 배열이 비어있는지 확인
 */
export const expectToBeEmpty = (arr: any[]) => {
  expect(arr).toHaveLength(0)
}

/**
 * 배열에 특정 길이가 있는지 확인
 */
export const expectToHaveLength = (arr: any[], length: number) => {
  expect(arr).toHaveLength(length)
}

/**
 * 객체가 특정 속성을 가지는지 확인
 */
export const expectToHaveProperties = (obj: any, properties: string[]) => {
  properties.forEach((prop) => {
    expect(obj).toHaveProperty(prop)
  })
}

/**
 * 에러가 발생하는지 확인
 */
export const expectToThrow = (fn: () => void, message?: string) => {
  if (message) {
    expect(fn).toThrowError(message)
  } else {
    expect(fn).toThrow()
  }
}

/**
 * Promise가 resolve되는지 확인
 */
export const expectToResolve = async (promise: Promise<any>) => {
  await expect(promise).resolves.toBeDefined()
}

/**
 * Promise가 reject되는지 확인
 */
export const expectToReject = async (promise: Promise<any>, message?: string) => {
  if (message) {
    await expect(promise).rejects.toThrowError(message)
  } else {
    await expect(promise).rejects.toThrow()
  }
}
