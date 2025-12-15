import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIMessage, AIActionType, AIAgentState, AIAgentActions } from '@/features/ai-assistant/types'

const initialSuggestions = [
  { id: 'search', label: 'Search products', action: 'search_products' as AIActionType },
  { id: 'orders', label: 'Check orders', action: 'check_orders' as AIActionType },
  { id: 'points', label: 'Check points', action: 'check_points' as AIActionType },
  { id: 'recommend', label: 'Recommend products', action: 'recommend_products' as AIActionType },
]

const welcomeMessage: AIMessage = {
  id: crypto.randomUUID(),
  role: 'assistant',
  content: 'Welcome to Olive Young! I\'m here to help you find the perfect beauty products, check your orders, and more.',
  timestamp: new Date(),
  suggestions: initialSuggestions,
}

export const useAIAgentStore = create<AIAgentState & AIAgentActions>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isMinimized: false,
      messages: [welcomeMessage],
      isTyping: false,

      openAgent: () => set({ isOpen: true, isMinimized: false }),
      
      closeAgent: () => set({ isOpen: false }),
      
      toggleAgent: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
      
      minimizeAgent: () => set({ isMinimized: true }),
      
      maximizeAgent: () => set({ isMinimized: false }),

      addMessage: (message) => {
        const newMessage: AIMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        }
        set((state) => ({
          messages: [...state.messages, newMessage].slice(-50), // 최대 50개 메시지 유지
        }))
      },

      clearMessages: () => set({ messages: [welcomeMessage] }),

      setTyping: (isTyping) => set({ isTyping }),

      handleAction: async (action, params) => {
        const { addMessage, setTyping } = get()
        
        // Action labels
        const actionLabels: Record<AIActionType, string> = {
          search_products: 'Search for products',
          check_orders: 'Check my orders',
          check_points: 'Check my points',
          recommend_products: 'Recommend products for me',
          custom: 'Help me',
        }
        
        // Add user message
        addMessage({
          role: 'user',
          content: params?.query || actionLabels[action],
        })

        // Start typing
        setTyping(true)
        
        try {
          await new Promise((resolve) => setTimeout(resolve, 800))
          
          // Handle action
          let response: Partial<AIMessage> = {}
          
          switch (action) {
            case 'search_products':
              response = {
                content: params?.query 
                  ? `I found several products matching "${params.query}". Here are the top results:\n\n1. Premium Face Cream - $45\n2. Hydrating Serum - $32\n3. Vitamin C Toner - $28\n\nWould you like to see more details?`
                  : 'What product would you like to search for?'
              }
              break

            case 'check_orders':
              response = {
                content: 'Here are your recent orders:',
                orders: [
                  { id: '#12345', date: 'Dec 1, 2025', status: 'delivered', items: 'Face Cream, Serum', total: '₩83,000' },
                  { id: '#12344', date: 'Dec 3, 2025', status: 'in_transit', items: 'Vitamin C Toner', total: '₩28,000' },
                  { id: '#12343', date: 'Dec 4, 2025', status: 'processing', items: 'Face Mask Set', total: '₩24,000' },
                ],
              }
              break

            case 'check_points':
              response = {
                content: '💰 Your current point balance: 15,450 points\n\n• Earned this month: 3,200 points\n• Expiring soon: 500 points (Dec 31, 2025)\n• Membership tier: Gold\n\nYou can use your points for your next purchase!'
              }
              break

            case 'recommend_products':
              response = {
                content: 'Based on your preferences, here are some products you might love:',
                products: [
                  { id: '1', name: 'Hydrating Face Cream', price: '₩45,000', image: '/cosmetics/cosmetic1.png', rating: 4.5 },
                  { id: '2', name: 'Vitamin C Serum', price: '₩38,000', image: '/cosmetics/cosmetic2.png', rating: 4.8 },
                ],
              }
              break

            default:
              response = {
                content: 'I\'m here to help! You can ask me to search products, check orders, view your points, or get recommendations.'
              }
          }
          
          // Add response
          addMessage({
            role: 'assistant',
            content: response.content || '',
            ...response,
            suggestions: initialSuggestions,
          })
        } finally {
          setTyping(false)
        }
      },
    }),
    {
      name: 'ai-agent-storage',
      partialize: (state) => ({ 
        messages: state.messages,
        isMinimized: state.isMinimized
      }),
    }
  )
)

