# Architecture Documentation

## Feature-Sliced Design (FSD) 아키텍처

이 프로젝트는 SOTA급 아키텍처를 위해 **Feature-Sliced Design (FSD)** 방법론을 채택했습니다.

## 레이어 구조

```
src/
├── app/           # 앱 초기화, 라우팅
├── widgets/       # 페이지 레벨 조합 컴포넌트 (Header, Footer)
├── features/      # 비즈니스 기능 (auth, cart, product, etc.)
├── entities/      # 비즈니스 엔티티 (product)
├── shared/        # 재사용 가능한 공통 코드
└── components/    # UI 컴포넌트 (layout, ui)
```

### 1. App Layer (`/src/app`)
- 앱 전역 설정 및 초기화
- 라우팅 구성
- 글로벌 프로바이더

### 2. Widgets Layer (`/src/widgets`)
- 페이지 레벨의 독립적인 조합 컴포넌트
- 여러 features를 조합하여 사용
- 예: Header, Footer

**구조:**
```
widgets/
├── header/
│   ├── header.tsx      # 메인 헤더 컴포넌트
│   └── index.ts
└── footer/
    ├── footer.tsx      # 메인 푸터 컴포넌트
    ├── components/     # 푸터 하위 컴포넌트
    └── index.ts
```

### 3. Features Layer (`/src/features`)
- 비즈니스 기능 단위로 분리
- 각 feature는 자체 완결적 (self-contained)
- **의존성 규칙**: features는 다른 features를 import하지 않음

**Feature 구조:**
```
features/[feature-name]/
├── api/              # API 요청 레이어
│   ├── service.ts    # HTTP 요청
│   ├── queries.ts    # React Query hooks (optional)
│   └── mutations.ts  # React Query mutations (optional)
├── components/       # Feature 컴포넌트
├── hooks/            # Feature 훅
├── stores/           # Zustand 상태 관리
├── types/            # Feature 타입
├── utils/            # Feature 유틸리티
└── index.ts          # Public API
```

**주요 Features:**
- `auth/` - 인증 및 사용자 관리
- `cart/` - 장바구니
- `product/` - 상품 관리
- `home/` - 홈 페이지
- `search/` - 검색
- `notification/` - 알림
- `locale/` - 다국어
- `promotion/` - 프로모션

### 4. Entities Layer (`/src/entities`)
- 비즈니스 엔티티 (도메인 모델)
- 여러 features에서 공유되는 핵심 비즈니스 로직
- Branded Types, Validation Schemas 포함

**Entity 구조:**
```
entities/product/
├── model/
│   ├── types.ts     # Branded types & smart constructors
│   ├── schemas.ts   # Zod validation schemas
│   └── index.ts
└── index.ts
```

**특징:**
- Branded Types로 타입 안전성 극대화
- Zod를 사용한 런타임 검증
- Smart Constructors 패턴

### 5. Shared Layer (`/src/shared`)
- 프로젝트 전반에서 재사용되는 공통 코드
- **비즈니스 로직 없음** - 순수한 재사용 가능한 코드만

**구조:**
```
shared/
├── api/          # API 클라이언트
├── components/   # Modal, Carousel 등
├── hooks/        # useModal, useCarousel 등
└── types/        # BaseEntity, PaginatedResponse 등
```

## 의존성 규칙

FSD의 핵심은 **명확한 의존성 방향**입니다:

```
app → widgets → features → entities → shared
```

### 금지 사항:
- ❌ features가 다른 features를 import
- ❌ shared가 features나 entities를 import
- ❌ entities가 features를 import
- ❌ 순환 의존성

### 허용 사항:
- ✅ widgets가 여러 features를 조합
- ✅ features가 entities를 사용
- ✅ features가 shared를 사용
- ✅ 모든 레이어가 shared 사용

## 상태 관리

### 1. 서버 상태 (TanStack Query)
- API 데이터 캐싱 및 동기화
- features/*/api/queries.ts에 정의

```typescript
// features/product/api/queries.ts
export const productQueries = {
  all: ['products'] as const,
  detail: (id) => queryOptions({...}),
}
```

### 2. 클라이언트 상태 (Zustand)
- UI 상태, 팝업, 로컬 상태
- features/*/stores/에 정의

```typescript
// features/auth/stores/auth-popup.store.ts
export const useAuthPopupStore = create<AuthPopupState>((set) => ({...}))
```

### 3. 글로벌 상태
- `app/stores/app.store.ts` - 앱 전역 상태
- `app/stores/toast.store.ts` - 토스트 알림

### Store 최적화 (SOTA 수준)
모든 Zustand store는 다음 원칙을 따릅니다:

**메모리 안전성**
- `crypto.randomUUID()` 사용
- setTimeout/setInterval cleanup
- 메모리 누수 방지

**Persist 미들웨어**
- `partialize`로 필요한 상태만 저장
- `onRehydrateStorage`로 에러 처리

**DevTools 최적화**
- 프로덕션에서 devtools 제외
- `import.meta.env.DEV` 체크

**타입 안전성**
- TypeScript strict mode
- Branded types (ProductId, Price)

자세한 내용은 각 feature의 stores/ 폴더 참조

## API 레이어

### 기본 구조
```typescript
// shared/api/client.ts - Base HTTP client
export const apiClient = ky.create({...})

// features/product/api/service.ts - Feature API
export const productApi = {
  getList: async (params) => apiClient.get('products', {searchParams}).json(),
  getById: async (id) => apiClient.get(`products/${id}`).json(),
}
```

### React Query 통합
```typescript
// features/product/hooks/use-products.ts
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: () => productApi.getList(),
  })
}
```

## Public API 패턴

각 feature와 entity는 `index.ts`를 통해 public API를 노출합니다:

```typescript
// features/product/index.ts
export { ProductCard, ProductDetailView } from './components'
export { useProducts, productKeys } from './hooks/use-products'
export { useQuickShopStore } from './stores'
export type { Product, ProductListItem } from './types'
```

**이점:**
- 명확한 public/private 구분
- 리팩토링 용이성
- 의존성 관리 단순화

## 타입 시스템

### Branded Types (entities)
```typescript
// entities/product/model/types.ts
export type ProductId = string & { readonly __brand: 'ProductId' }
export type Price = number & { readonly __brand: 'Price' }

export const Price = {
  create: (value: number): Price => {...},
  format: (price: Price): string => {...},
}
```

### Zod Validation
```typescript
// entities/product/model/schemas.ts
export const ProductSchema = z.object({
  id: z.string().transform(ProductId.create),
  price: PriceSchema,
  rating: RatingSchema,
})
```

## 마이그레이션 가이드

### Legacy 코드에서의 전환
```typescript
// ❌ 기존
import { cartService } from '@/services'
import { useCartStore } from '@/stores'

// ✅ 새로운 방식
import { cartApi } from '@/features/cart/api'
import { useCartStore } from '@/features/cart/stores'
```

### 호환성 레이어
마이그레이션을 위해 호환성 레이어를 유지합니다:

```typescript
// services/index.ts (deprecated)
export { productApi as productService } from '@/features/product/api'

// types/index.ts (deprecated)
export type { BaseEntity } from '@/shared'
```

## 개발 워크플로우

### 새로운 Feature 추가
1. `features/[feature-name]` 폴더 생성
2. 필요한 하위 폴더 생성 (api, components, hooks, stores, types)
3. Public API 정의 (`index.ts`)
4. Feature 구현
5. 필요시 widgets에서 조합

### 새로운 Entity 추가
1. `entities/[entity-name]` 폴더 생성
2. model/types.ts - Branded types 정의
3. model/schemas.ts - Zod schemas 정의
4. Public API 정의 (`index.ts`)

### 새로운 Shared 컴포넌트 추가
1. `shared/components/[ComponentName]` 폴더 생성
2. 순수 재사용 가능한 컴포넌트 구현
3. shared/index.ts에 export 추가

## 테스팅 전략

### Unit Tests
```
tests/
├── entities/      # 엔티티 로직 테스트
├── features/      # Feature 단위 테스트
└── shared/        # 공통 유틸 테스트
```

### Integration Tests
```
_temp_test/        # 임시 통합 테스트
```

## 모범 사례

### DO ✅
- Feature는 자체 완결적으로 구성
- Public API 패턴 사용
- Branded Types로 타입 안전성 확보
- 명확한 레이어 분리
- 의존성 방향 준수

### DON'T ❌
- Feature 간 직접 import
- Shared에 비즈니스 로직 추가
- 순환 의존성 생성
- 글로벌 상태 남용
- 레이어 규칙 위반

## 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [TanStack Query](https://tanstack.com/query/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev/)
