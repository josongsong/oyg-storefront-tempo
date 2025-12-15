import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/shared/hooks/use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    )

    expect(result.current).toBe('first')

    // 값 변경
    rerender({ value: 'second', delay: 300 })
    
    // 아직 debounce 시간이 지나지 않음
    expect(result.current).toBe('first')

    // 시간 경과
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('second')
  })

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(150)
    })

    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // 총 300ms 경과했지만 마지막 변경 후 300ms는 안됨
    expect(result.current).toBe('first')

    // 추가 150ms 경과 (마지막 변경 후 300ms)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(result.current).toBe('third')
  })

  it('should use default delay of 300ms', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('second')
  })

  it('should work with custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('should work with different types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 123 } }
    )

    rerender({ value: 456 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(456)
  })

  it('should work with objects', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { count: 1 } } }
    )

    rerender({ value: { count: 2 } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toEqual({ count: 2 })
  })
})
