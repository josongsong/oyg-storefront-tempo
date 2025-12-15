import path from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'src/main.tsx',
          'src/vite-env.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
        ],
        // 점진적 목표
        thresholds: {
          lines: 30,
          functions: 30,
          branches: 30,
          statements: 30,
        },
      },
    },
  })
)
