import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { enableMapSet } from 'immer'
import { server } from './mocks/server'

enableMapSet()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

if (!React.act) {
  React.act = (callback: () => void | Promise<void>) => {
    const result = callback()
    if (result && typeof result === 'object' && 'then' in result) {
      return result
    }
    return Promise.resolve()
  }
}

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock('lucide-react', () => ({
  Star: vi.fn(() => null),
  Heart: vi.fn(() => null),
  Search: vi.fn(() => null),
  ShoppingBag: vi.fn(() => null),
  User: vi.fn(() => null),
  X: vi.fn(() => null),
  ChevronDown: vi.fn(() => null),
  ChevronLeft: vi.fn(() => null),
  ChevronRight: vi.fn(() => null),
  Menu: vi.fn(() => null),
  Bell: vi.fn(() => null),
  LogOut: vi.fn(() => null),
  Package: vi.fn(() => null),
  Truck: vi.fn(() => null),
  Clock: vi.fn(() => null),
  Send: vi.fn(() => null),
  Wand2: vi.fn(() => null),
  Check: vi.fn(() => null),
  AlertTriangle: vi.fn(() => null),
  Home: vi.fn(() => null),
  ArrowLeft: vi.fn(() => null),
  Play: vi.fn(() => null),
  Pause: vi.fn(() => null),
}))
