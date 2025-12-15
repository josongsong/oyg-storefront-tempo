import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/app/stores/app.store'

describe('AppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      isSidebarOpen: false,
      isLoading: false,
    })
  })

  describe('초기 상태', () => {
    it('사이드바가 닫혀있어야 함', () => {
      const { isSidebarOpen } = useAppStore.getState()
      expect(isSidebarOpen).toBe(false)
    })

    it('로딩 상태가 아니어야 함', () => {
      const { isLoading } = useAppStore.getState()
      expect(isLoading).toBe(false)
    })
  })

  describe('toggleSidebar', () => {
    it('사이드바를 열고 닫을 수 있어야 함', () => {
      const { toggleSidebar } = useAppStore.getState()
      
      toggleSidebar()
      expect(useAppStore.getState().isSidebarOpen).toBe(true)
      
      toggleSidebar()
      expect(useAppStore.getState().isSidebarOpen).toBe(false)
    })
  })

  describe('setLoading', () => {
    it('로딩 상태를 변경할 수 있어야 함', () => {
      const { setLoading } = useAppStore.getState()
      
      setLoading(true)
      expect(useAppStore.getState().isLoading).toBe(true)
      
      setLoading(false)
      expect(useAppStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    it('모든 상태를 초기화할 수 있어야 함', () => {
      const { toggleSidebar, setLoading, reset } = useAppStore.getState()
      
      // 상태 변경
      toggleSidebar()
      setLoading(true)
      
      expect(useAppStore.getState().isSidebarOpen).toBe(true)
      expect(useAppStore.getState().isLoading).toBe(true)
      
      // 초기화
      reset()
      
      const state = useAppStore.getState()
      expect(state.isSidebarOpen).toBe(false)
      expect(state.isLoading).toBe(false)
    })
  })
})

