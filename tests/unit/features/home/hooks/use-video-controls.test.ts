/**
 * useVideoControls Hook Tests
 * 
 * 검증 내용:
 * 1. 초기 상태가 올바른지
 * 2. 재생/일시정지 토글이 동작하는지
 * 3. 음소거 토글이 동작하는지
 * 4. video 엘리먼트가 없을 때 에러 없이 처리되는지
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useVideoControls } from '@/features/home/hooks/use-video-controls'

describe('useVideoControls', () => {
  // Mock HTMLVideoElement
  let mockVideoElement: Partial<HTMLVideoElement>

  beforeEach(() => {
    mockVideoElement = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      muted: true,
    }
  })

  describe('초기 상태', () => {
    it('재생 중, 음소거 상태로 시작한다', async () => {
      const { result } = renderHook(() => useVideoControls())

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })

      expect(result.current.isPlaying).toBe(true)
      expect(result.current.isMuted).toBe(true)
    })

    it('videoRef가 제공된다', async () => {
      const { result } = renderHook(() => useVideoControls())

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })

      expect(result.current.videoRef).toBeDefined()
      expect(result.current.videoRef.current).toBeNull()
    })
  })

  describe('togglePlay', () => {
    it('재생 중일 때 호출하면 일시정지된다', () => {
      const { result } = renderHook(() => useVideoControls())
      
      // videoRef에 mock element 연결
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement

      act(() => {
        result.current.togglePlay()
      })

      expect(mockVideoElement.pause).toHaveBeenCalledTimes(1)
      expect(result.current.isPlaying).toBe(false)
    })

    it('일시정지 중일 때 호출하면 재생된다', () => {
      const { result } = renderHook(() => useVideoControls())
      
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement

      // 먼저 일시정지 상태로 만들기
      act(() => {
        result.current.togglePlay()
      })

      // 다시 재생
      act(() => {
        result.current.togglePlay()
      })

      expect(mockVideoElement.play).toHaveBeenCalledTimes(1)
      expect(result.current.isPlaying).toBe(true)
    })

    it('videoRef가 없으면 아무 일도 일어나지 않는다', () => {
      const { result } = renderHook(() => useVideoControls())

      // videoRef.current가 null인 상태에서 호출
      act(() => {
        result.current.togglePlay()
      })

      // 에러 없이 실행되고, 상태도 변하지 않음
      expect(result.current.isPlaying).toBe(true)
    })
  })

  describe('toggleMute', () => {
    it('음소거 상태를 토글한다', () => {
      const { result } = renderHook(() => useVideoControls())
      
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement

      act(() => {
        result.current.toggleMute()
      })

      expect(mockVideoElement.muted).toBe(false)
      expect(result.current.isMuted).toBe(false)
    })

    it('여러 번 토글할 수 있다', () => {
      const { result } = renderHook(() => useVideoControls())
      
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement

      // 첫 번째 토글 (음소거 해제)
      act(() => {
        result.current.toggleMute()
      })
      expect(result.current.isMuted).toBe(false)

      // 두 번째 토글 (다시 음소거)
      act(() => {
        result.current.toggleMute()
      })
      expect(result.current.isMuted).toBe(true)
    })

    it('videoRef가 없으면 아무 일도 일어나지 않는다', () => {
      const { result } = renderHook(() => useVideoControls())

      act(() => {
        result.current.toggleMute()
      })

      // 에러 없이 실행되고, 상태도 변하지 않음
      expect(result.current.isMuted).toBe(true)
    })
  })
})

