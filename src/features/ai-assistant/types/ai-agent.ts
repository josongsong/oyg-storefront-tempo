export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: AISuggestion[]
  products?: AIProduct[]
  orders?: AIOrder[]
}

export interface AIProduct {
  id: string
  name: string
  price: string
  image: string
  rating?: number
}

export interface AIOrder {
  id: string
  date: string
  status: 'delivered' | 'in_transit' | 'processing'
  items: string
  total: string
}

export interface AISuggestion {
  id: string
  label: string
  action: AIActionType
  icon?: string
}

export type AIActionType = 
  | 'search_products'
  | 'check_orders'
  | 'check_points'
  | 'recommend_products'
  | 'custom'

export interface AIAgentState {
  isOpen: boolean
  isMinimized: boolean
  messages: AIMessage[]
  isTyping: boolean
}

export interface AIAgentActions {
  openAgent: () => void
  closeAgent: () => void
  toggleAgent: () => void
  minimizeAgent: () => void
  maximizeAgent: () => void
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  setTyping: (isTyping: boolean) => void
  handleAction: (action: AIActionType, params?: Record<string, unknown>) => void
}

