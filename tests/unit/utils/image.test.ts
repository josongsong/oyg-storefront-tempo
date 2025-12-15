import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRandomCosmeticImage, getCosmeticImage } from '@/utils/image'

describe('getRandomCosmeticImage', () => {
  it('should return a cosmetic image path', () => {
    const image = getRandomCosmeticImage()
    expect(image).toMatch(/^\/cosmetics\//)
  })

  it('should return different images on multiple calls', () => {
    const images = new Set()
    for (let i = 0; i < 20; i++) {
      images.add(getRandomCosmeticImage())
    }
    // 20번 호출하면 최소 2개 이상의 다른 이미지가 나와야 함
    expect(images.size).toBeGreaterThan(1)
  })

  it('should return valid image path format', () => {
    const image = getRandomCosmeticImage()
    expect(image).toMatch(/\.(png|jpg|webp)$/)
  })
})

describe('getCosmeticImage', () => {
  it('should return image by index', () => {
    const image = getCosmeticImage(0)
    expect(image).toBe('/cosmetics/cosmetic1.png')
  })

  it('should handle index within range', () => {
    const image = getCosmeticImage(2)
    expect(image).toMatch(/^\/cosmetics\//)
  })

  it('should wrap around with modulo for large index', () => {
    const image1 = getCosmeticImage(0)
    const image2 = getCosmeticImage(11) // 11개 이미지, 11 % 11 = 0
    expect(image1).toBe(image2)
  })

  it('should handle large positive index', () => {
    const image = getCosmeticImage(100)
    expect(image).toMatch(/^\/cosmetics\//)
  })
})
