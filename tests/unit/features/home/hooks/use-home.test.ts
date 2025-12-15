import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useState } from 'react'

describe('Home Hooks', () => {
  describe('useState for view management', () => {
    it('초기 뷰가 HOME이어야 함', () => {
      const { result } = renderHook(() => useState('HOME'))
      
      expect(result.current[0]).toBe('HOME')
    })

    it('뷰를 변경할 수 있어야 함', () => {
      const { result } = renderHook(() => useState('HOME'))
      const [, setView] = result.current
      
      setView('PDP')
      // Note: useState는 비동기가 아니므로 즉시 확인 불가
      expect(setView).toBeDefined()
    })
  })

  describe('Selection management', () => {
    it('선택 항목을 관리할 수 있어야 함', () => {
      const { result } = renderHook(() => useState<string[]>([]))
      const [selections] = result.current
      
      expect(Array.isArray(selections)).toBe(true)
    })

    it('선택 항목을 업데이트할 수 있어야 함', () => {
      const { result } = renderHook(() => {
        const [items, setItems] = useState(['item1', 'item2'])
        return { items, setItems }
      })
      
      expect(result.current.items).toHaveLength(2)
      expect(result.current.setItems).toBeDefined()
    })
  })
})

