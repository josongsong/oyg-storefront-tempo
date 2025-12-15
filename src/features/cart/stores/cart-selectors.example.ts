/**
 * Cart Store Selector 사용 예제
 * 
 * useShallow를 사용하여 불필요한 리렌더링 방지
 */

import { useShallow } from '@/shared/hooks'
import { useCartStore } from './index'

// ❌ Bad: 매번 새로운 객체 생성으로 리렌더링 발생
export function BadExample() {
  const { items, getTotalItems } = useCartStore((state) => ({
    items: state.items,
    getTotalItems: state.getTotalItems,
  }))
  
  return <div>{getTotalItems()}</div>
}

// ✅ Good: useShallow로 shallow comparison
export function GoodExample() {
  const { items, getTotalItems } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      getTotalItems: state.getTotalItems,
    }))
  )
  
  return <div>{getTotalItems()}</div>
}

// ✅ Best: 최적화된 selector hooks 사용
import { useCartTotalItems, useCartItems } from './index'

export function BestExample() {
  const totalItems = useCartTotalItems()
  const items = useCartItems()
  
  return <div>{totalItems}</div>
}

