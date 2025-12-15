import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Send, ChevronDown, Wand2, Star, Package, Truck, Clock } from 'lucide-react'
import { useAIAgentStore } from '@/features/ai-assistant/stores'

export function AIAgent() {
  const navigate = useNavigate()
  const {
    isOpen,
    messages,
    isTyping,
    openAgent,
    closeAgent,
    addMessage,
    handleAction,
  } = useAIAgentStore()

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 모바일에서 배경 스크롤 막기
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflowY = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage({
      role: 'user',
      content: inputValue,
    })

    const query = inputValue.toLowerCase()
    if (query.includes('search') || query.includes('find') || query.includes('looking for')) {
      handleAction('search_products', { query: inputValue })
    } else if (query.includes('order') || query.includes('delivery')) {
      handleAction('check_orders')
    } else if (query.includes('point') || query.includes('balance')) {
      handleAction('check_points')
    } else if (query.includes('recommend') || query.includes('suggest')) {
      handleAction('recommend_products')
    } else {
      handleAction('custom', { query: inputValue })
    }

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { emoji: '🛍️', label: 'Search products', action: 'search_products' as const },
    { emoji: '📦', label: 'Check orders', action: 'check_orders' as const },
    { emoji: '💰', label: 'Check points', action: 'check_points' as const },
    { emoji: '⭐', label: 'Recommend products', action: 'recommend_products' as const },
  ]

  if (!isOpen) {
    return (
      <button
        onClick={openAgent}
        className="fixed bottom-0 right-0 bg-black hover:bg-gray-900 text-white transition-all px-3 py-3 md:px-3.5 md:py-3.5 flex items-center gap-2 group rounded-tl-lg z-[60]"
        aria-label="Open AI Assistant"
      >
        <Wand2 className="w-4 h-4 animate-sparkle" />
        <span className="text-xs font-medium">AI Assistant</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-0 md:right-0 w-full md:w-[400px] h-full md:h-[500px] bg-white shadow-2xl flex flex-col z-[100] animate-slideInUp md:border border-gray-200 overflow-hidden font-inherit">
      {/* Header */}
      <div className="relative px-4 md:px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">AI Assistant</span>
          </div>
          <button
            onClick={closeAgent}
            className="w-9 h-9 md:w-8 md:h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-700 hover:text-black"
            aria-label="Close"
          >
            <X className="w-6 h-6 md:w-5 md:h-5 stroke-2" />
          </button>
        </div>
      </div>

      {/* Welcome Screen */}
      {messages.length === 1 && (
        <div className="flex-1 px-4 md:px-6 py-8 md:py-8 bg-white overflow-y-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>
          
          <h2 className="text-lg md:text-xl font-bold text-black mb-6 md:mb-8 text-center">What can I help you with?</h2>
          
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleAction(action.action)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded transition-all text-left group"
              >
                <span className="text-xl">{action.emoji}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-black">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 1 && (
        <div className="flex-1 overflow-y-auto px-4 md:px-5 pt-4 pb-8 space-y-4 bg-gray-50 custom-scrollbar">
          {messages.slice(1).map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                      <span className="text-sm">✨</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">AI</span>
                  </div>
                )}
                
                <div
                  className={`px-3.5 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-gray-100 text-black'
                      : 'bg-white border border-gray-200 text-black'
                  }`}
                >
                  <p className="text-xs whitespace-pre-line leading-relaxed">{message.content}</p>
                </div>

                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="flex gap-3 p-3 bg-white border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-gray-100 overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black mb-1 truncate">{product.name}</h4>
                          <p className="text-sm font-bold text-black mb-1">{product.price}</p>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Tracking */}
                {message.orders && message.orders.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.orders.map((order) => {
                      const statusConfig = {
                        delivered: { icon: Package, label: 'Delivered', color: 'text-black' },
                        in_transit: { icon: Truck, label: 'In Transit', color: 'text-gray-700' },
                        processing: { icon: Clock, label: 'Processing', color: 'text-gray-500' },
                      }
                      const config = statusConfig[order.status]
                      const StatusIcon = config.icon

                      return (
                        <div
                          key={order.id}
                          className="p-3 bg-white border border-gray-200 hover:border-gray-300 transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-black">Order {order.id}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                            <div className={`flex items-center gap-1 ${config.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{config.label}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{order.items}</p>
                          <p className="text-sm font-bold text-black">{order.total}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleAction(suggestion.action)}
                        className="block w-full text-left px-3.5 py-2.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-800"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                  <span className="text-sm">✨</span>
                </div>
                <div className="bg-white border border-gray-200 px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-4 md:p-4 bg-white">
        <div className="flex gap-2 items-center bg-gray-50 px-3.5 py-3 md:py-2.5 hover:bg-gray-100 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-7 h-7 bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

