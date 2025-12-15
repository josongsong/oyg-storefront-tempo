/**
 * Vitest Workspace Configuration
 * 유닛/통합 테스트를 분리하여 관리
 */

import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    // 유닛 테스트 - 빠르고 많음
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      include: ['tests/unit/**/*.test.{ts,tsx}'],
      environment: 'jsdom',
    },
  },
  {
    // 통합 테스트 - 느리지만 실제 사용 패턴 검증
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      include: ['tests/integration/**/*.test.{ts,tsx}'],
      environment: 'jsdom',
      testTimeout: 10000, // 10초
    },
  },
])
