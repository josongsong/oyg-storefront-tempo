# Cart Store 사용 가이드

## 최적화된 Selector 사용법

### ❌ Bad: 매번 새 객체 생성으로 불필요한 리렌더링

```tsx
import { useCartStore } from '@/features/cart/stores'

function CartBadge() {
  const { items, getTotalItems } = useCartStore((state) => ({
    items: state.items,
    getTotalItems: state.getTotalItems,
  }))
  
  return <Badge>{getTotalItems()}</Badge>
}
```

### ✅ Good: useShallow 사용

```tsx
import { useCartStore } from '@/features/cart/stores'
import { useShallow } from '@/shared/hooks'

function CartBadge() {
  const { items, getTotalItems } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      getTotalItems: state.getTotalItems,
    }))
  )
  
  return <Badge>{getTotalItems()}</Badge>
}
```

### ✅ Best: 최적화된 Selector Hooks 사용

```tsx
import { useCartTotalItems, useCartSummary } from '@/features/cart/stores'

function CartBadge() {
  const totalItems = useCartTotalItems()
  return <Badge>{totalItems}</Badge>
}

function CartSummary() {
  const summary = useCartSummary()
  return <div>Total: ${summary.total}</div>
}
```

## 사용 가능한 Selector Hooks

- `useCartItems()` - 모든 장바구니 아이템
- `useCartTotalItems()` - 총 아이템 개수
- `useCartSummary()` - 주문 요약 (subtotal, shipping, tax, total)
- `useCartItem(id)` - 특정 아이템
- `useHasCartItem(productId, options?)` - 아이템 존재 여부

## Store 구조

- **Map 기반**: 빠른 조회와 업데이트
- **Immer 미들웨어**: 불변성 자동 관리
- **Persist**: 로컬 스토리지 자동 동기화
- **DevTools**: 개발 환경에서만 활성화

