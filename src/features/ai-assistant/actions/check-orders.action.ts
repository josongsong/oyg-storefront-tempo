/**
 * Check Orders Action Handler
 */

import type { AIMessage } from '../types'

export const handleCheckOrders = async (): Promise<AIMessage> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    role: 'assistant',
    content: 'Here are your recent orders:',
    orders: [
      {
        id: '#12345',
        date: 'Dec 1, 2025',
        status: 'delivered',
        items: 'Face Cream, Serum',
        total: '₩83,000',
      },
      {
        id: '#12344',
        date: 'Dec 3, 2025',
        status: 'in_transit',
        items: 'Vitamin C Toner',
        total: '₩28,000',
      },
      {
        id: '#12343',
        date: 'Dec 4, 2025',
        status: 'processing',
        items: 'Face Mask Set',
        total: '₩24,000',
      },
    ],
  }
}

