import { describe, it, expect, beforeEach } from 'vitest'
import { useAIAgentStore } from '@/features/ai-assistant/stores/ai-agent.store'

describe('AIAgentStore', () => {
  beforeEach(() => {
    // 초기 상태로 리셋
    const initialState = useAIAgentStore.getState()
    useAIAgentStore.setState({
      isOpen: false,
      isMinimized: false,
      messages: initialState.messages.slice(0, 1), // Welcome message만 유지
      isTyping: false,
    })
  })

  describe('초기 상태', () => {
    it('닫혀있어야 함', () => {
      const { isOpen } = useAIAgentStore.getState()
      expect(isOpen).toBe(false)
    })

    it('최소화되지 않아야 함', () => {
      const { isMinimized } = useAIAgentStore.getState()
      expect(isMinimized).toBe(false)
    })

    it('웰컴 메시지가 있어야 함', () => {
      const { messages } = useAIAgentStore.getState()
      expect(messages.length).toBeGreaterThan(0)
      expect(messages[0].role).toBe('assistant')
    })

    it('타이핑 중이 아니어야 함', () => {
      const { isTyping } = useAIAgentStore.getState()
      expect(isTyping).toBe(false)
    })
  })

  describe('openAgent', () => {
    it('에이전트를 열 수 있어야 함', () => {
      const { openAgent } = useAIAgentStore.getState()
      
      openAgent()
      
      const { isOpen, isMinimized } = useAIAgentStore.getState()
      expect(isOpen).toBe(true)
      expect(isMinimized).toBe(false)
    })
  })

  describe('closeAgent', () => {
    it('에이전트를 닫을 수 있어야 함', () => {
      const { openAgent, closeAgent } = useAIAgentStore.getState()
      
      openAgent()
      closeAgent()
      
      const { isOpen } = useAIAgentStore.getState()
      expect(isOpen).toBe(false)
    })
  })

  describe('toggleAgent', () => {
    it('에이전트를 토글할 수 있어야 함', () => {
      const { toggleAgent } = useAIAgentStore.getState()
      
      toggleAgent()
      expect(useAIAgentStore.getState().isOpen).toBe(true)
      
      toggleAgent()
      expect(useAIAgentStore.getState().isOpen).toBe(false)
    })
  })

  describe('minimizeAgent', () => {
    it('에이전트를 최소화할 수 있어야 함', () => {
      const { openAgent, minimizeAgent } = useAIAgentStore.getState()
      
      openAgent()
      minimizeAgent()
      
      const { isMinimized } = useAIAgentStore.getState()
      expect(isMinimized).toBe(true)
    })
  })

  describe('maximizeAgent', () => {
    it('에이전트를 최대화할 수 있어야 함', () => {
      const { openAgent, minimizeAgent, maximizeAgent } = useAIAgentStore.getState()
      
      openAgent()
      minimizeAgent()
      maximizeAgent()
      
      const { isMinimized } = useAIAgentStore.getState()
      expect(isMinimized).toBe(false)
    })
  })

  describe('addMessage', () => {
    it('메시지를 추가할 수 있어야 함', () => {
      const { addMessage } = useAIAgentStore.getState()
      const initialLength = useAIAgentStore.getState().messages.length
      
      addMessage({
        role: 'user',
        content: 'Test message',
      })
      
      const { messages } = useAIAgentStore.getState()
      expect(messages).toHaveLength(initialLength + 1)
      expect(messages[messages.length - 1].content).toBe('Test message')
      expect(messages[messages.length - 1].role).toBe('user')
    })

    it('메시지에 ID와 timestamp가 자동 생성되어야 함', () => {
      const { addMessage } = useAIAgentStore.getState()
      
      addMessage({
        role: 'user',
        content: 'Test',
      })
      
      const { messages } = useAIAgentStore.getState()
      const lastMessage = messages[messages.length - 1]
      expect(lastMessage.id).toBeDefined()
      expect(lastMessage.timestamp).toBeInstanceOf(Date)
    })

    it('최대 50개 메시지까지만 유지해야 함', () => {
      const { addMessage } = useAIAgentStore.getState()
      
      // 51개 추가
      for (let i = 0; i < 51; i++) {
        addMessage({
          role: 'user',
          content: `Message ${i}`,
        })
      }
      
      const { messages } = useAIAgentStore.getState()
      expect(messages.length).toBeLessThanOrEqual(50)
    })
  })

  describe('clearMessages', () => {
    it('메시지를 초기화할 수 있어야 함', () => {
      const { addMessage, clearMessages } = useAIAgentStore.getState()
      
      addMessage({ role: 'user', content: 'Test 1' })
      addMessage({ role: 'user', content: 'Test 2' })
      
      clearMessages()
      
      const { messages } = useAIAgentStore.getState()
      expect(messages.length).toBe(1) // Welcome message만 남음
      expect(messages[0].role).toBe('assistant')
    })
  })

  describe('setTyping', () => {
    it('타이핑 상태를 변경할 수 있어야 함', () => {
      const { setTyping } = useAIAgentStore.getState()
      
      setTyping(true)
      expect(useAIAgentStore.getState().isTyping).toBe(true)
      
      setTyping(false)
      expect(useAIAgentStore.getState().isTyping).toBe(false)
    })
  })
})

