# 테스트 가이드

## 테스트 구조

```
src/test/              # 테스트 유틸리티
├── setup.ts           # Vitest 글로벌 설정 + MSW
├── utils.tsx          # 렌더링 헬퍼
├── factories/         # Mock 데이터 생성기
├── fixtures/          # 재사용 가능한 테스트 데이터
├── mocks/             # MSW 핸들러
└── helpers/           # 테스트 헬퍼 함수

tests/                 # 테스트 파일
├── unit/              # 유닛 테스트
│   ├── entities/
│   ├── features/
│   ├── shared/
│   └── utils/
├── integration/       # 통합 테스트
│   └── features/
└── config/            # 테스트 설정

e2e/                   # E2E 테스트
├── specs/             # 테스트 시나리오
├── pages/             # Page Object Models
└── fixtures/          # E2E 픽스처
```

## 테스트 실행

### 유닛 테스트
```bash
pnpm test:unit              # 유닛 테스트 실행
pnpm test:unit --watch      # Watch 모드
```

### 통합 테스트
```bash
pnpm test:integration       # 통합 테스트 실행
```

### E2E 테스트
```bash
pnpm test:e2e              # E2E 테스트 실행
pnpm test:e2e:ui           # UI 모드
pnpm test:e2e:report       # 리포트 보기
```

### 전체 테스트
```bash
pnpm test                  # 모든 테스트 (watch)
pnpm test:run              # CI 모드 (단일 실행)
pnpm test:coverage         # 커버리지 포함
pnpm test:ui               # Vitest UI
```

## 테스트 작성 가이드

### 1. 유닛 테스트

```typescript
// tests/unit/features/product/utils/product-loader.test.ts
import { describe, it, expect } from 'vitest'
import { searchProducts } from '@/features/product/utils/product-loader'
import { createProduct } from '@/test/factories'

describe('searchProducts', () => {
  it('should find products by name', () => {
    const products = [
      createProduct({ name: 'Glossier Cloud Paint' }),
      createProduct({ name: 'The Ordinary Serum' }),
    ]
    
    const result = searchProducts(products, 'glossier')
    
    expect(result).toHaveLength(1)
    expect(result[0].name).toContain('Glossier')
  })
})
```

### 2. 통합 테스트

```typescript
// tests/integration/features/cart/cart-flow.test.tsx
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/utils'
import { CartPage } from '@/features/cart/pages/cart-page'
import { useCartStore } from '@/features/cart/stores'
import { createCartItem } from '@/test/factories'

describe('Cart Flow Integration', () => {
  it('should add and display items', async () => {
    const item = createCartItem()
    
    renderWithProviders(<CartPage />)
    
    // Add item
    useCartStore.getState().addItem(item)
    
    // Verify display
    expect(await screen.findByText(item.name)).toBeInTheDocument()
  })
})
```

### 3. E2E 테스트

```typescript
// e2e/specs/checkout.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'

test('should complete checkout', async ({ page }) => {
  const homePage = new HomePage(page)
  
  await homePage.goto()
  await homePage.clickProductCard(0)
  // ...
})
```

## MSW 사용법

### 기본 사용
```typescript
// 자동으로 setup.ts에서 활성화됨
import { server } from '@/test/mocks/server'

// 특정 테스트에서 핸들러 오버라이드
it('should handle API error', async () => {
  server.use(
    http.get('/api/products', () => {
      return HttpResponse.error()
    })
  )
  
  // 테스트...
})
```

### 커스텀 핸들러 추가
```typescript
// src/test/mocks/handlers/custom.handlers.ts
export const customHandlers = [
  http.get('/api/custom', () => {
    return HttpResponse.json({ data: 'custom' })
  }),
]

// handlers/index.ts에 추가
export const handlers = [
  ...productHandlers,
  ...customHandlers,
]
```

## 팩토리 vs 픽스처

### Factory (동적 생성)
```typescript
import { createProduct } from '@/test/factories'

const product = createProduct({ price: '$29.99' })
```

### Fixture (정적 데이터)
```typescript
import { MOCK_PRODUCTS } from '@/test/fixtures'

const product = MOCK_PRODUCTS[0]
```

## Test IDs

```typescript
import { TEST_IDS } from '@/tests/config/test-ids'

// 컴포넌트에서
<button data-testid={TEST_IDS.CART.CHECKOUT_BTN}>

// 테스트에서
screen.getByTestId(TEST_IDS.CART.CHECKOUT_BTN)
```

## CI/CD

GitHub Actions에서 자동 실행:
- Push/PR 시 모든 테스트 실행
- 커버리지 체크 (최소 30%)
- E2E 테스트 (main 브랜치)

## 커버리지 목표

| 레이어 | 목표 |
|--------|------|
| entities | 90%+ |
| features/api | 80%+ |
| features/utils | 80%+ |
| stores | 70%+ |
| components | 30-40% |
| 전체 | 30%+ |

## 베스트 프랙티스

1. **AAA 패턴** - Arrange, Act, Assert
2. **테스트 격리** - beforeEach에서 초기화
3. **의미있는 이름** - "should..."로 시작
4. **하나의 관심사** - 한 테스트는 하나만 검증
5. **Mock 재사용** - factories/fixtures 활용

## 문제 해결

### MSW가 작동하지 않음
```bash
# setup.ts에서 server가 제대로 로드되는지 확인
# afterEach에서 server.resetHandlers() 호출 확인
```

### 테스트가 느림
```bash
# 통합 테스트를 유닛 테스트로 분리
# MSW 핸들러 최적화
# test.concurrent 사용
```

### E2E 테스트 실패
```bash
# 개발 서버가 실행 중인지 확인
pnpm dev

# Playwright 브라우저 재설치
pnpm exec playwright install
```
