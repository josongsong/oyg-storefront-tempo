/**
 * Search Products Action Handler
 */

import type { AIMessage } from '../types'

export const handleSearchProducts = async (
  params?: { query?: string }
): Promise<AIMessage> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const response = params?.query 
      ? `I found several products matching "${params.query}". Here are the top results:\n\n1. Premium Face Cream - $45\n2. Hydrating Serum - $32\n3. Vitamin C Toner - $28\n\nWould you like to see more details?`
      : 'What product would you like to search for?'
    
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      role: 'assistant',
      content: response,
    }
  } catch (error) {
    console.error('Failed to search products:', error)
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      role: 'assistant',
      content: 'Sorry, I couldn\'t complete the search. Please try again.',
    }
  }
}

