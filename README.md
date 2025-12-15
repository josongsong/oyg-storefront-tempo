# Oliveyoung Web v2

> SOTA급 Feature-Sliced Design 아키텍처를 적용한 K-Beauty 이커머스 플랫폼

## 특징

### Architecture
- **Feature-Sliced Design (FSD)** - 엔터프라이즈급 아키텍처 패턴
- **Branded Types** - 타입 안전성 극대화
- **Public API Pattern** - 명확한 모듈 경계
- **Zero Circular Dependencies** - 깔끔한 의존성 그래프

### Tech Stack
- **React 19** + **TypeScript 5.9**
- **Vite 7** - 빠른 개발 환경
- **React Router v7** - 라우팅
- **TanStack Query v5** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Framer Motion** - 애니메이션
- **Tailwind CSS v4** - 스타일링
- **Zod** - 런타임 검증
- **Ky** - HTTP 클라이언트
- **Vitest** + **Playwright** - 테스팅

## 프로젝트 구조

```
src/
├── app/              # 앱 진입점, 라우터, 글로벌 스토어
│   ├── router/       # React Router 설정
│   └── stores/       # 앱 전역 상태 (app, toast)
│
├── widgets/          # 페이지 레벨 조합 컴포넌트
│   ├── header/       # 헤더 (검색, 네비게이션, 카트)
│   └── footer/       # 푸터
│
├── features/         # 비즈니스 기능 모듈 (독립적)
│   ├── auth/         # 인증 (로그인, 회원가입, 사용자)
│   ├── cart/         # 장바구니
│   ├── product/      # 상품 (목록, 상세, 필터, 리뷰)
│   ├── home/         # 홈 섹션 (히어로, 트렌드, TikTok)
│   ├── search/       # 검색 오버레이
│   ├── notification/ # 알림 센터
│   ├── locale/       # 다국어 전환
│   ├── promotion/    # 프로모션 팝업
│   ├── ai-assistant/ # AI 에이전트
│   └── checkout/     # 체크아웃
│
├── entities/         # 비즈니스 엔티티 (도메인 모델)
│   └── product/      # Product 엔티티 (Branded Types, Zod)
│
├── shared/           # 공용 재사용 코드
│   ├── api/          # HTTP 클라이언트
│   ├── components/   # UI 컴포넌트 (Modal, Carousel, Button)
│   ├── hooks/        # 공용 훅 (useDebounce, useModal)
│   ├── utils/        # 유틸리티 (cn, format, image)
│   ├── constants/    # 상수 (메뉴, 프로모션)
│   └── types/        # 공용 타입
│
└── test/             # 테스트 헬퍼 (factories, fixtures, mocks)
```

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md) 참조

## 시작하기

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev              # 개발 서버 (http://localhost:5173)
pnpm build            # 프로덕션 빌드
pnpm preview          # 빌드 미리보기
```

### Testing

```bash
# Unit & Integration Tests (Vitest)
pnpm test             # 테스트 실행
pnpm test:unit        # 유닛 테스트만
pnpm test:integration # 통합 테스트만
pnpm test:ui          # Vitest UI
pnpm test:coverage    # 커버리지 리포트
pnpm test:watch       # Watch 모드

# E2E Tests (Playwright)
pnpm test:e2e         # E2E 테스트
pnpm test:e2e:ui      # Playwright UI
pnpm test:e2e:report  # 리포트 보기
```

### Linting

```bash
pnpm lint             # ESLint 검사
```

## Features

### Core
- ✅ **Product** - 목록, 상세, 필터링, 비교, 리뷰
- ✅ **Cart** - 장바구니, 저장된 아이템, 주문 요약
- ✅ **Auth** - 로그인, 회원가입, 사용자 관리
- ✅ **Search** - 실시간 검색, 오버레이
- ✅ **Checkout** - 결제 프로세스

### Experience
- ✅ **Home** - 히어로, 트렌딩, 큐레이션, TikTok 갤러리
- ✅ **AI Assistant** - AI 에이전트 채팅
- ✅ **Notification** - 알림 센터
- ✅ **Promotion** - 프로모션 팝업, 럭키드로우
- ✅ **Locale** - 다국어 지원 (KR/EN)
- ✅ **Wishlist** - 위시리스트 관리

## 개발 가이드

### Feature 추가
```
features/my-feature/
├── api/              # API 레이어
│   ├── service.ts    # HTTP 요청
│   ├── queries.ts    # React Query (optional)
│   └── mutations.ts  # Mutations (optional)
├── components/       # UI 컴포넌트
├── hooks/            # Custom hooks
├── stores/           # Zustand stores
├── types/            # TypeScript 타입
├── utils/            # 유틸리티 (optional)
├── pages/            # 페이지 컴포넌트 (optional)
└── index.ts          # Public API
```

**예시:**
```typescript
// features/product/index.ts
export { ProductCard, ProductDetailView } from './components'
export { useProducts, useProductDetail } from './hooks/use-products'
export { useQuickShopStore } from './stores'
export type { Product, ProductFilter } from './types'
```

### Entity 추가
```
entities/my-entity/
└── model/
    ├── types.ts      # Branded types
    ├── schemas.ts    # Zod schemas
    └── index.ts      # Public API
```

**예시:**
```typescript
// entities/product/model/types.ts
export type ProductId = string & { readonly __brand: 'ProductId' }
export const ProductId = {
  create: (value: string): ProductId => value as ProductId,
}

// entities/product/model/schemas.ts
export const ProductSchema = z.object({
  id: z.string().transform(ProductId.create),
  name: z.string(),
  price: PriceSchema,
})
```

### Widget 추가
```
widgets/my-widget/
├── components/       # 하위 컴포넌트
├── my-widget.tsx     # 메인 컴포넌트
└── index.ts          # Public API
```

## 아키텍처 규칙

1. **의존성 방향**: `app → widgets → features → entities → shared`
2. **Feature 독립성**: Features는 서로 import 금지
3. **Public API**: 모든 모듈은 index.ts로 export
4. **타입 안전성**: Branded Types + Zod 검증 필수

## 성능

- Bundle Size: **192 kB** (gzipped)
- Route-based Code Splitting
- Lazy Loading
- Optimized Builds

## 테스트

### 테스트 구조
```
tests/                        # Unit & Integration Tests (Vitest)
├── unit/                     # 단위 테스트
│   ├── entities/             # 엔티티 로직 테스트
│   │   └── product/
│   │       └── model/        # Branded Types, Zod 스키마
│   ├── features/             # Feature 단위 테스트
│   │   ├── auth/             # 인증 (API, stores)
│   │   ├── cart/             # 장바구니 (API, hooks, model, stores)
│   │   └── product/          # 상품 (API, components, hooks, stores, utils)
│   ├── shared/               # 공용 코드 테스트
│   │   ├── components/       # Modal, Carousel
│   │   └── hooks/            # useModal, useCarousel
│   ├── stores/               # 글로벌 스토어 (toast)
│   └── utils/                # 유틸리티 (cn, format, image)
│
├── integration/              # 통합 테스트
│   └── features/
│       ├── cart/             # 장바구니 플로우
│       └── product/          # 상품 플로우
│
└── config/                   # 테스트 설정
    └── test-ids.ts           # Test ID 상수

e2e/                          # E2E Tests (Playwright)
├── specs/                    # 테스트 시나리오
│   ├── auth.spec.ts          # 인증 플로우
│   ├── checkout.spec.ts      # 체크아웃
│   ├── search.spec.ts        # 검색
│   └── wishlist.spec.ts      # 위시리스트
├── pages/                    # Page Object Model
│   ├── base.page.ts
│   ├── cart.page.ts
│   ├── home.page.ts
│   └── product.page.ts
└── fixtures/                 # E2E 픽스처

src/test/                     # 테스트 헬퍼
├── factories/                # 테스트 데이터 팩토리
│   ├── cart.factory.ts
│   ├── product.factory.ts
│   └── user.factory.ts
├── fixtures/                 # 고정 테스트 데이터
│   ├── products.fixture.ts
│   └── users.fixture.ts
├── mocks/                    # MSW Mock Handlers
│   ├── handlers/
│   ├── browser.ts
│   └── server.ts
├── helpers/                  # 테스트 유틸리티
│   ├── assertions.ts
│   └── wait.ts
└── setup.ts                  # Vitest 전역 설정
```

### 테스트 전략
- **Unit Tests** - 개별 함수/컴포넌트/훅/스토어 검증
- **Integration Tests** - Feature 간 상호작용 및 플로우 테스트
- **E2E Tests** - 실제 사용자 시나리오 검증 (Playwright)
- **MSW** - API 모킹으로 독립적인 프론트엔드 테스트

## 문서

- [Architecture Guide](./ARCHITECTURE.md) - FSD 아키텍처 상세 가이드
- [Store Architecture](./STORE_ARCHITECTURE.md) - Zustand 스토어 설계
- [Test README](./README.TEST.md) - 테스트 가이드
- [Shared Layer](./src/shared/README.md) - Shared 레이어 규칙

## 프로젝트 상태

✅ **Production Ready**

### 아키텍처
- ✅ FSD 완전 적용 (app → widgets → features → entities → shared)
- ✅ Zero Circular Dependencies
- ✅ Public API Pattern
- ✅ Feature 독립성 확보

### 타입 안전성
- ✅ TypeScript 5.9 Strict Mode
- ✅ Branded Types (entities)
- ✅ Zod Runtime Validation
- ✅ 0 Type Errors

### 성능
- ✅ Bundle Size: ~192 kB (gzipped)
- ✅ Route-based Code Splitting
- ✅ React 19 Lazy Loading
- ✅ Optimized Builds

### 테스트
- ✅ Vitest 설정 완료
- ✅ Playwright E2E 설정 완료
- ✅ MSW 핸들러
- ✅ Test Factories & Fixtures

## License

MIT
