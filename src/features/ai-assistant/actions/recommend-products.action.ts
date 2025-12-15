/**
 * Recommend Products Action Handler
 */

import type { AIMessage } from '../types'

export const handleRecommendProducts = async (): Promise<AIMessage> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    role: 'assistant',
    content: 'Based on your preferences, here are some products you might love:',
    products: [
      {
        id: '1',
        name: 'Hydrating Face Cream',
        price: '₩45,000',
        image: '/cosmetics/cosmetic1.png',
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Vitamin C Serum',
        price: '₩38,000',
        image: '/cosmetics/cosmetic2.png',
        rating: 4.8,
      },
    ],
  }
}

