import { create } from 'zustand'
import type { AIMessage, AIActionType, AIAgentState, AIAgentActions } from '@/types/ai-agent'

const initialSuggestions = [
  { id: 'search', label: 'Search products', action: 'search_products' as AIActionType },
  { id: 'orders', label: 'Check orders', action: 'check_orders' as AIActionType },
  { id: 'points', label: 'Check points', action: 'check_points' as AIActionType },
  { id: 'recommend', label: 'Recommend products', action: 'recommend_products' as AIActionType },
]

const welcomeMessage: AIMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to Olive Young! I\'m here to help you find the perfect beauty products, check your orders, and more.',
  timestamp: new Date(),
  suggestions: initialSuggestions,
}

export const useAIAgentStore = create<AIAgentState & AIAgentActions>((set, get) => ({
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
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  clearMessages: () => set({ messages: [welcomeMessage] }),

  setTyping: (isTyping) => set({ isTyping }),

  handleAction: async (action, params) => {
    const { addMessage, setTyping } = get()
    
    // Add user message
    const actionLabels = {
      search_products: 'Search for products',
      check_orders: 'Check my orders',
      check_points: 'Check my points',
      recommend_products: 'Recommend products for me',
    }
    
    addMessage({
      role: 'user',
      content: params?.query || actionLabels[action] || 'Help me',
    })

    // Simulate AI thinking
    setTyping(true)
    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let response = ''
    let suggestions = initialSuggestions

    switch (action) {
      case 'search_products':
        response = params?.query 
          ? `I found several products matching "${params.query}". Here are the top results:\n\n1. Premium Face Cream - $45\n2. Hydrating Serum - $32\n3. Vitamin C Toner - $28\n\nWould you like to see more details?`
          : 'What product would you like to search for?'
        break

      case 'check_orders':
        response = 'Here are your recent orders:'
        addMessage({
          role: 'assistant',
          content: response,
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
          suggestions,
        })
        setTyping(false)
        return

      case 'check_points':
        response = '💰 Your current point balance: 15,450 points\n\n• Earned this month: 3,200 points\n• Expiring soon: 500 points (Dec 31, 2025)\n• Membership tier: Gold\n\nYou can use your points for your next purchase!'
        break

      case 'recommend_products':
        response = 'Based on your preferences, here are some products you might love:'
        addMessage({
          role: 'assistant',
          content: response,
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
          suggestions,
        })
        setTyping(false)
        return

      default:
        response = 'I\'m here to help! You can ask me to search products, check orders, view your points, or get recommendations.'
    }

    setTyping(false)
    addMessage({
      role: 'assistant',
      content: response,
      suggestions,
    })
  },
}))

