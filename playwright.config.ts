/**
 * Playwright Configuration
 * E2E 테스트 설정
 */

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  
  // 병렬 실행
  fullyParallel: true,
  
  // CI에서 실패 시 재시도
  retries: process.env.CI ? 2 : 0,
  
  // 워커 수
  workers: process.env.CI ? 1 : undefined,
  
  // 리포터
  reporter: 'html',
  
  use: {
    // Base URL
    baseURL: 'http://localhost:5173',
    
    // 스크린샷
    screenshot: 'only-on-failure',
    
    // 비디오
    video: 'retain-on-failure',
    
    // 트레이스
    trace: 'on-first-retry',
  },

  // 프로젝트별 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 모바일
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 개발 서버
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
