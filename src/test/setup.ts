import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { enableMapSet } from 'immer'
import { server } from './mocks/server'

// Enable Immer Map/Set support
enableMapSet()

// MSW Server Setup
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

// React 19 act polyfill
if (!React.act) {
  React.act = (callback: () => void | Promise<void>) => {
    const result = callback()
    if (result && typeof result === 'object' && 'then' in result) {
      return result
    }
    return Promise.resolve()
  }
}

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// window.matchMedia mock
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

// IntersectionObserver mock
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock('lucide-react', () => ({
  Star: ({ className, ...props }: any) => (
    <svg className={className} data-testid="star-icon" {...props}>
      <title>Star</title>
    </svg>
  ),
  Heart: ({ className, ...props }: any) => (
    <svg className={className} data-testid="heart-icon" {...props}>
      <title>Heart</title>
    </svg>
  ),
  Search: ({ className, ...props }: any) => (
    <svg className={className} data-testid="search-icon" {...props}>
      <title>Search</title>
    </svg>
  ),
  ShoppingBag: ({ className, ...props }: any) => (
    <svg className={className} data-testid="shopping-bag-icon" {...props}>
      <title>ShoppingBag</title>
    </svg>
  ),
  User: ({ className, ...props }: any) => (
    <svg className={className} data-testid="user-icon" {...props}>
      <title>User</title>
    </svg>
  ),
  X: ({ className, ...props }: any) => (
    <svg className={className} data-testid="x-icon" {...props}>
      <title>X</title>
    </svg>
  ),
  ChevronDown: ({ className, ...props }: any) => (
    <svg className={className} data-testid="chevron-down-icon" {...props}>
      <title>ChevronDown</title>
    </svg>
  ),
  ChevronLeft: ({ className, ...props }: any) => (
    <svg className={className} data-testid="chevron-left-icon" {...props}>
      <title>ChevronLeft</title>
    </svg>
  ),
  ChevronRight: ({ className, ...props }: any) => (
    <svg className={className} data-testid="chevron-right-icon" {...props}>
      <title>ChevronRight</title>
    </svg>
  ),
  Menu: ({ className, ...props }: any) => (
    <svg className={className} data-testid="menu-icon" {...props}>
      <title>Menu</title>
    </svg>
  ),
  Bell: ({ className, ...props }: any) => (
    <svg className={className} data-testid="bell-icon" {...props}>
      <title>Bell</title>
    </svg>
  ),
  LogOut: ({ className, ...props }: any) => (
    <svg className={className} data-testid="logout-icon" {...props}>
      <title>LogOut</title>
    </svg>
  ),
  Package: ({ className, ...props }: any) => (
    <svg className={className} data-testid="package-icon" {...props}>
      <title>Package</title>
    </svg>
  ),
  Truck: ({ className, ...props }: any) => (
    <svg className={className} data-testid="truck-icon" {...props}>
      <title>Truck</title>
    </svg>
  ),
  Clock: ({ className, ...props }: any) => (
    <svg className={className} data-testid="clock-icon" {...props}>
      <title>Clock</title>
    </svg>
  ),
  Send: ({ className, ...props }: any) => (
    <svg className={className} data-testid="send-icon" {...props}>
      <title>Send</title>
    </svg>
  ),
  Wand2: ({ className, ...props }: any) => (
    <svg className={className} data-testid="wand-icon" {...props}>
      <title>Wand2</title>
    </svg>
  ),
  Check: ({ className, ...props }: any) => (
    <svg className={className} data-testid="check-icon" {...props}>
      <title>Check</title>
    </svg>
  ),
  AlertTriangle: ({ className, ...props }: any) => (
    <svg className={className} data-testid="alert-icon" {...props}>
      <title>AlertTriangle</title>
    </svg>
  ),
  Home: ({ className, ...props }: any) => (
    <svg className={className} data-testid="home-icon" {...props}>
      <title>Home</title>
    </svg>
  ),
  ArrowLeft: ({ className, ...props }: any) => (
    <svg className={className} data-testid="arrow-left-icon" {...props}>
      <title>ArrowLeft</title>
    </svg>
  ),
  Play: ({ className, ...props }: any) => (
    <svg className={className} data-testid="play-icon" {...props}>
      <title>Play</title>
    </svg>
  ),
  Pause: ({ className, ...props }: any) => (
    <svg className={className} data-testid="pause-icon" {...props}>
      <title>Pause</title>
    </svg>
  ),
