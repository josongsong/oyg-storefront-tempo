# Design System - Tailwind CSS

## 개요

SOTA급 Tailwind CSS 디자인 시스템. 일관성, 재사용성, 유지보수성을 극대화.

## 색상 토큰

### Brand Colors
```css
--color-brand-primary: #00C73C          /* Oliveyoung Green */
--color-brand-primary-hover: #00B035
--color-brand-primary-light: #E6F9ED
--color-brand-primary-dark: #009B2E
--color-brand-accent-lime: #7DD321
--color-brand-accent-mint: #00D98F
```

### Semantic Colors
```css
--color-danger: #D23F57           /* 에러, 알림 배지 */
--color-danger-light: #F5A7B8     /* 강조 배경 */
--color-warning: #D4A017          /* 프리미엄 배지 */
--color-success: #00C73C          /* 성공 메시지 */
--color-info: #3B82F6             /* 정보 표시 */
```

### Neutral Colors
```css
--color-surface-primary: #FFFFFF
--color-surface-secondary: #F9F9F9    /* 카드 배경 */
--color-surface-tertiary: #F0EAE5     /* Alt 배경 */
--color-text-primary: #000000
--color-text-secondary: #4B5563
--color-border-default: #E5E7EB
--color-border-strong: #000000
```

## 유틸리티 클래스

### Badge
```tsx
// 사용법
<Badge variant="default">NEW</Badge>
<Badge variant="premium">VALUE SET</Badge>
<Badge variant="danger">SALE</Badge>
<CountBadge count={3} />
```

**Variants:**
- `default` - 기본 (흰색 배경, 검은 테두리)
- `premium` - 프리미엄 (골드)
- `danger` - 긴급/할인 (빨간색)
- `success` - 성공 (초록색)
- `info` - 정보 (파란색)

**CSS Classes:**
```css
.badge              /* 기본 스타일 */
.badge-default      /* 기본 variant */
.badge-premium      /* 프리미엄 variant */
.badge-danger       /* 위험 variant */
.count-badge        /* 카운트 배지 (장바구니, 알림) */
```

### Icon Button
```tsx
// 사용법
<IconButton variant="default">
  <Heart />
</IconButton>
<IconButton variant="bordered" size="lg">
  <Settings />
</IconButton>
```

**Variants:**
- `default` - 투명 배경, hover시 반투명 흰색
- `bordered` - 테두리, hover시 검은 테두리

**Sizes:**
- `sm` - padding: 4px
- `md` - padding: 8px (기본)
- `lg` - padding: 12px

**CSS Classes:**
```css
.icon-btn           /* 기본 아이콘 버튼 */
.icon-btn-bordered  /* 테두리 아이콘 버튼 */
```

### Surfaces
```css
.card-surface       /* bg-[#F9F9F9] → 제품 카드 배경 */
.card-surface-alt   /* bg-[#F0EAE5] → 대체 배경 */
```

### Interactive
```css
.quick-action-btn   /* 호버시 나타나는 빠른 액션 버튼 */
.interactive-card   /* 호버 효과가 있는 카드 */
.brand-link         /* 브랜드명 링크 스타일 */
```

## 컴포넌트 사용

### Button
```tsx
import { Button } from '@/shared/components/ui/button'

<Button variant="primary">Add to Cart</Button>
<Button variant="outline" size="lg">View Details</Button>
<Button isLoading>Processing...</Button>
```

### Badge & CountBadge
```tsx
import { Badge, CountBadge } from '@/shared/components/ui/badge'

<Badge variant="premium">VALUE SET</Badge>
<CountBadge count={cartCount} />
```

### IconButton
```tsx
import { IconButton } from '@/shared/components/ui/icon-button'
import { Heart } from 'lucide-react'

<IconButton variant="default" onClick={handleFavorite}>
  <Heart />
</IconButton>
```

### Rating
```tsx
import { Rating } from '@/shared/components/ui/rating'

<Rating rating={4.5} showValue />
<Rating rating={3.8} size="sm" />
```

### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner'

<LoadingSpinner size="lg" text="Loading products..." />
<LoadingDots />
<LoadingPulse text="Processing..." />
```

## Z-Index 레이어

```css
--z-base: 0
--z-dropdown: 10
--z-sticky: 20
--z-modal-backdrop: 40
--z-modal: 50
--z-popover: 60
--z-toast: 70
--z-tooltip: 80
```

## Breakpoints

```css
xs: 475px    /* 작은 모바일 */
sm: 640px    /* 모바일 */
md: 768px    /* 태블릿 */
lg: 1024px   /* 데스크톱 */
xl: 1280px   /* 큰 데스크톱 */
2xl: 1536px  /* 초대형 화면 */
```

## 타이포그래피

```css
xs: 0.75rem    (12px)
sm: 0.875rem   (14px)
md: 1rem       (16px)
lg: 1.125rem   (18px)
xl: 1.25rem    (20px)
xxl: 1.5rem    (24px)
3xl: 1.875rem  (30px)
```

## 성능 최적화

### GPU 가속
```tsx
<div className="gpu-accelerated">
  {/* 애니메이션 최적화 */}
</div>
```

### Will Change
```tsx
<div className="will-change-transform">
  {/* Transform 애니메이션 */}
</div>
<div className="will-change-scroll">
  {/* 스크롤 최적화 */}
</div>
```

### 접근성
```tsx
/* 모션 감소 선호 자동 적용 */
@media (prefers-reduced-motion: reduce)

/* 터치 타겟 최소 크기 */
--touch-target-min: 44px
```

## 디자인 규칙

### DO ✅
- CSS 변수 색상 사용 (`bg-[var(--color-danger)]`)
- 유틸리티 클래스 조합 (`badge-default`, `icon-btn`)
- `cn()` 함수로 조건부 클래스 병합
- 시맨틱 컴포넌트 사용 (`Badge`, `IconButton`)
- 모바일 우선 반응형 (`md:`, `lg:`)

### DON'T ❌
- Hardcoded 색상 (`bg-[#D23F57]`)
- 인라인 스타일 남용
- 긴 className 문자열 반복
- 일관성 없는 spacing/sizing
- Z-index 임의 값

## 마이그레이션 예시

### Before
```tsx
<span className="text-xs font-medium px-2 py-1 uppercase tracking-wider bg-white border border-black text-black">
  NEW
</span>
<div className="absolute -top-0.5 -right-0.5 bg-[#D23F57] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center">
  5
</div>
<div className="bg-[#F9F9F9] p-4">
  Content
</div>
```

### After
```tsx
<Badge variant="default">NEW</Badge>
<CountBadge count={5} />
<div className="card-surface p-4">
  Content
</div>
```

## 확장 가이드

### 새 색상 추가
1. `src/index.css` @theme에 CSS 변수 추가
2. 유틸리티 클래스 정의 (필요시)
3. 이 문서에 기록

### 새 유틸리티 추가
1. `src/index.css` @layer utilities에 추가
2. 명명 규칙: `{purpose}-{variant}`
3. 문서화

### 새 컴포넌트 추가
1. `src/shared/components/ui/` 에 생성
2. 기존 유틸리티 활용
3. TypeScript Props 정의
4. `index.ts`에 export
5. 테스트 작성

