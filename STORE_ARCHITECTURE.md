# Store Architecture - SOTA 수준 구현

## 📋 개요

이 프로젝트의 모든 Zustand store는 다음 SOTA 원칙을 따릅니다:

## ✅ 적용된 최적화

### 1. 메모리 안전성
- ✅ `crypto.randomUUID()` 사용으로 안전한 ID 생성
- ✅ setTimeout/setInterval cleanup 구현
- ✅ 메모리 누수 방지

### 2. Persist 미들웨어
- ✅ 수동 localStorage 관리 제거
- ✅ Zustand persist 미들웨어 사용
- ✅ `partialize`로 필요한 상태만 저장
- ✅ `onRehydrateStorage`로 에러 처리

### 3. DevTools 최적화
- ✅ 프로덕션 빌드에서 devtools 제외
- ✅ `import.meta.env.DEV` 체크
- ✅ 번들 크기 최적화

### 4. 타입 안전성
- ✅ TypeScript strict mode
- ✅ Branded types (ProductId, Price 등)
- ✅ 명확한 인터페이스 정의

### 5. 성능 최적화
- ✅ Selector hooks 제공 (useShallow)
- ✅ Map 기반 데이터 구조 (cart)
- ✅ Immer 미들웨어로 불변성 관리
- ✅ 배열 크기 제한 (toast: 3개, notification: 50개)

## 📁 Store 구조

```
src/
├── app/stores/              # 전역 stores
│   ├── app.store.ts        # UI 상태
│   ├── toast.store.ts      # 토스트 알림
│   ├── test-helpers.ts     # 테스트 헬퍼
│   └── index.ts
│
└── features/
    ├── auth/stores/        # 인증
    │   ├── user.store.ts
    │   └── auth-popup.store.ts
    │
    ├── cart/
    │   ├── model/store.ts  # 최적화된 cart (Map + immer)
    │   └── stores/
    │       ├── index.ts    # Selector hooks export
    │       └── README.md   # 사용 가이드
    │
    ├── product/stores/     # 제품
    │   ├── wishlist.store.ts
    │   └── quick-shop.store.ts
    │
    ├── promotion/stores/   # 프로모션
    │   ├── lucky-draw.store.ts
    │   └── promo-popup.store.ts
    │
    ├── notification/stores/
    │   └── notification.store.ts
    │
    ├── locale/stores/
    │   └── locale.store.ts
    │
    └── ai-assistant/stores/
        └── ai-agent.store.ts
```

## 🔧 Store 패턴

### 기본 패턴 (UI 상태만)

```typescript
import { create } from 'zustand'

interface SimpleState {
  isOpen: boolean
  toggle: () => void
}

export const useSimpleStore = create<SimpleState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
```

### Persist 패턴 (로컬 저장 필요)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePersistedStore = create<State>()(
  persist(
    (set, get) => ({
      // state & actions
    }),
    {
      name: 'storage-key',
      partialize: (state) => ({ /* 저장할 필드만 */ }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate:', error)
        }
      },
    }
  )
)
```

### Full Pattern (DevTools + Persist + 최적화)

```typescript
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const isDev = import.meta.env.DEV

export const useOptimizedStore = create<State>()(
  (isDev ? devtools : (fn) => fn)(
    persist(
      immer((set, get) => ({
        // state & actions with immer
      })),
      {
        name: 'storage-key',
        partialize: (state) => ({ /* 필요한 것만 */ }),
        onRehydrateStorage: () => (state, error) => {
          if (error) console.error('Rehydrate error:', error)
        },
      }
    ),
    { name: 'StoreName', enabled: isDev }
  )
)

// Selector hooks
export const useItemCount = () => useOptimizedStore((s) => s.getCount())
```

## 🧪 테스트 패턴

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './store'

describe('Store', () => {
  beforeEach(() => {
    useStore.getState().reset() // 또는 직접 setState
    localStorage.clear()
  })

  it('should work', () => {
    const { action } = useStore.getState()
    action()
    expect(useStore.getState().value).toBe(expected)
  })
})
```

## 📊 Store별 특징

| Store | Persist | DevTools | Immer | 특징 |
|-------|---------|----------|-------|------|
| app | ✅ | ✅ | - | UI 전역 상태 |
| toast | - | - | - | 메모리 cleanup |
| user | ✅ | ✅ | - | 세션 저장 |
| cart | ✅ | ✅ | ✅ | Map + Selector hooks |
| wishlist | ✅ | - | - | 에러 처리 |
| notification | ✅ | ✅ | - | 50개 제한 |
| locale | ✅ | - | - | 언어/통화 |
| ai-agent | ✅ | - | - | 50개 메시지 제한 |
| promo-popup | ✅ | - | - | 24시간 쿨다운 |

## 🚀 사용 예제

### 1. useShallow로 최적화

```typescript
import { useCartStore } from '@/features/cart/stores'
import { useShallow } from '@/shared/hooks'

function Component() {
  const { items, total } = useCartStore(
    useShallow((state) => ({
      items: state.getItems(),
      total: state.getSummary().total,
    }))
  )
}
```

### 2. Selector hooks 사용

```typescript
import { useCartTotalItems } from '@/features/cart/stores'

function Badge() {
  const count = useCartTotalItems()
  return <span>{count}</span>
}
```

### 3. Test helpers 사용

```typescript
import { resetCartStore } from '@/app/stores/test-helpers'

beforeEach(() => {
  resetCartStore()
})
```

## 📚 참고 자료

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Re-renders Guide](https://www.developerway.com/)
- [Immer Documentation](https://immerjs.github.io/immer/)

## 🔍 성능 체크리스트

- [ ] 불필요한 리렌더링 확인 (React DevTools Profiler)
- [ ] localStorage 크기 확인 (50KB 이하 권장)
- [ ] DevTools가 프로덕션에서 제외되는지 확인
- [ ] Selector hooks 제공 여부
- [ ] 메모리 누수 확인 (cleanup 함수)

