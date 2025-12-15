const COSMETIC_IMAGES = [
  '/cosmetics/cosmetic1.png',
  '/cosmetics/cosmetic2.png',
  '/cosmetics/s2542843-main-zoom.webp',
  '/cosmetics/s2640688-main-zoom.webp',
  '/cosmetics/s2782985-main-zoom.webp',
  '/cosmetics/s2862480-main-zoom.webp',
  '/cosmetics/s2895845-main-zoom.webp',
  '/cosmetics/s2895985-main-zoom.webp',
  '/cosmetics/s2895993-main-zoom.jpg',
  '/cosmetics/s2898419-main-zoom.webp',
  '/cosmetics/s2923134-main-zoom.webp',
]

export function getRandomCosmeticImage(): string {
  return COSMETIC_IMAGES[Math.floor(Math.random() * COSMETIC_IMAGES.length)]
}

export function getCosmeticImage(index: number): string {
  return COSMETIC_IMAGES[index % COSMETIC_IMAGES.length]
}

