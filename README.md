# OYG Web v2

올리브영 신규 아키텍처를 위한 웹사이트 레포

## 문서

- [프로젝트 상세 문서](./docs/README.md)
- [아키텍처 가이드](./docs/ARCHITECTURE.md)
- [디자인 시스템](./docs/DESIGN_SYSTEM.md)
- [테스트 가이드](./docs/TESTING.md)

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test              # 전체 테스트
pnpm test:unit         # 단위 테스트
pnpm test:integration  # 통합 테스트
pnpm test:e2e          # E2E 테스트
pnpm test:coverage     # 커버리지 리포트
```

## 기술 스택

- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Architecture**: Feature-Sliced Design (FSD)
- **State**: Zustand + TanStack Query
- **Styling**: Tailwind CSS v4
- **i18n**: Paraglide (타입 안전)
- **Testing**: Vitest + Playwright
- **Quality**: ESLint + TypeScript strict

## 프로젝트 구조

```
src/
├── app/              # 앱 초기화 및 전역 상태
│   ├── i18n/         # Paraglide 런타임
│   └── stores/       # 전역 stores
├── widgets/          # 페이지 레벨 컴포넌트
│   ├── header/
│   └── footer/
├── features/         # 비즈니스 기능 (자체 완결)
│   └── [feature]/
│       ├── api/      # API 서비스
│       ├── components/
│       ├── i18n/     # Feature별 메시지
│       ├── stores/   # Feature 상태
│       └── types/
├── entities/         # 도메인 모델
│   └── product/
│       └── model/    # Branded Types, Zod 스키마
└── shared/           # 공통 코드
    ├── api/          # API 클라이언트
    ├── components/   # 공통 컴포넌트
    ├── i18n/         # 의미 코드, 디스패치
    └── types/        # 공통 타입
```

## 국제화 (i18n)

### Paraglide 타입 안전 i18n

```typescript
// 타입 안전 메시지 (컴파일 타임 검증)
import * as m from '@/app/i18n/paraglide/messages.js'

m.cart_empty_title()  // "장바구니가 비어있습니다"
m.cart_item_count({ count: 5 })  // "상품 5개" (ICU Plural)

// 컴파일 에러
m.nonexistent()  // 메시지 없음
m.cart_item_count()  // count 파라미터 필수
```

### 의미 코드 기반 계약

```typescript
// 서버-클라이언트 계약 (RFC-i18n-003)
import { dispatchSemanticMessage, CartSemanticCode } from '@/shared/i18n'

const message = dispatchSemanticMessage(
  CartSemanticCode.ACTION__ADD_SUCCESS,
  { productName: 'iPhone' }
)
```

### 지원 언어
- 한국어 (ko) - 기본
- English (en)

### Locale 변경
개발 모드에서 우측 하단 "i18n Demo" 위젯으로 실시간 테스트 가능

## 테스트 전략

### Test Pyramid

```
       /\
      /  \      E2E (6 specs)
     /    \     사용자 시나리오
    /------\
   /        \   Integration (11개)
  /          \  Feature 통합
 /____________\ Unit (36개)
                빠른 피드백
```

### 테스트 상세

**Unit Tests (36개 파일)**
- stores: toast, app, user, cart, wishlist, notification
- utils: format, image, cn
- entities: product types, schemas
- features: product stores, auth, cart
- i18n: message-dispatch, semantic-codes, loader
- hooks: use-debounce

**Integration Tests (11개 파일)**
- cart: quantity 변경, 아이템 추가/제거
- product: filter, quick-shop
- search: 검색 동작
- wishlist: 아이템 관리
- locale: locale 변경
- i18n: 메시지 통합

**E2E Tests (6 specs)**
- auth.spec.ts: 로그인, 회원가입, 로그아웃
- cart.spec.ts: 장바구니 추가, 수량 변경, 제거
- checkout.spec.ts: 주문 플로우
- search.spec.ts: 검색, 필터
- wishlist.spec.ts: 위시리스트 관리
- product.spec.ts: 상품 상세, 리뷰

**i18n Tests (5개 파일, 37개 케이스)**
- message-dispatch: 의미 코드 → 메시지 변환
- semantic-codes: 의미 코드 타입, Type Guards
- loader: Locale 결정 로직
- cart-i18n: Cart 메시지
- locale-change: Locale 변경 통합

### 테스트 실행

```bash
# 단위 테스트 (빠름, ~2초)
pnpm test:unit

# 통합 테스트 (~5초)
pnpm test:integration

# E2E 테스트 (느림, ~5-10분)
pnpm test:e2e
pnpm test:e2e:ui  # UI 모드

# 커버리지
pnpm test:coverage

# 특정 테스트
pnpm test tests/unit/shared/i18n/
pnpm test tests/integration/features/cart/
```

### 테스트 통계

- 테스트 파일: 53개
- 테스트 케이스: 483개
- 통과: 287개
- 실패: 196개 (기존 코드 이슈)
- i18n 테스트: 37개 (100% 통과)

## 코드 품질

### FSD 아키텍처
- 5개 레이어 (app, widgets, features, entities, shared)
- 명확한 의존성 방향
- Feature 격리
- Public API 패턴

### 타입 안전성
- TypeScript strict mode
- Branded Types (ProductId, Price, Rating)
- Zod 스키마 런타임 검증
- Paraglide 타입 안전 i18n

### 상태 관리 (SOTA급)
- Zustand (클라이언트 상태)
  - DevTools 최적화
  - Persist 미들웨어
  - Immer 통합
- TanStack Query (서버 상태)
  - 자동 캐싱
  - Optimistic updates
- 메모리 안전성
  - crypto.randomUUID()
  - setTimeout cleanup

### i18n (RFC-i18n-003 준수)
- 런타임 문자열 키 금지
- 타입 안전 메시지 함수
- 의미 코드 기반 계약 (48개)
- 컴파일 타임 검증
- ICU Plural
- 제로 런타임 오버헤드

## 프로젝트 통계

- 소스 파일: 231개
- 테스트 파일: 53개
- 테스트 케이스: 483개
- 통과율: 59% (287/483)
- i18n 메시지: 46개 x 2개 언어
- 의미 코드: 48개
- TypeScript 에러: 0개

## 개발 도구

### 필수 도구
- Node.js 20+
- pnpm 10+

### 권장 VSCode 확장
- ESLint
- TypeScript
- Tailwind CSS IntelliSense

자세한 내용은 [아키텍처 문서](./docs/ARCHITECTURE.md)를 참조하세요.
