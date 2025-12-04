# 모듈 단위 리팩토링 체크리스트

## 1. 중복 코드 제거 (High Priority)

### 1.1 Modal/Popup 공통 패턴
**문제**: auth-popup, promo-popup, locale-popup, quick-shop-modal에서 동일한 패턴 반복
- 스크롤 잠금 로직 중복 (4개 파일에서 동일)
- Backdrop + AnimatePresence 패턴 중복
- Close 버튼 스타일 중복

**해결방안**:
```typescript
// components/ui/modal/base-modal.tsx 생성
// hooks/use-modal-scroll-lock.ts 생성
```

### 1.2 Header 컴포넌트 (535 lines)
**문제**: 너무 많은 책임
- 프로모 배너 로직
- 메가 메뉴 로직
- 검색 오버레이
- 사용자 인증 상태
- 로케일 설정
- 장바구니 상태

**해결방안**:
```
header/
  ├── promo-banner.tsx
  ├── logo.tsx
  ├── search-bar.tsx
  ├── user-menu.tsx
  └── navigation.tsx
```

### 1.3 Product Detail Page (804 lines)
**문제**: 단일 파일에 너무 많은 로직
- 이미지 갤러리
- 리뷰 섹션
- 배송 옵션
- 추천 상품

**해결방안**:
```
product/components/
  ├── product-gallery.tsx
  ├── product-info.tsx
  ├── delivery-options.tsx
  ├── reviews-section.tsx
  └── recommended-products.tsx
```

## 2. Hooks 추출

### 2.1 공통 Hooks 필요
```typescript
// hooks/use-modal-scroll-lock.ts
// hooks/use-image-carousel.ts
// hooks/use-sort-filter.ts
```

### 2.2 Feature별 Hooks
```typescript
// features/product/hooks/use-product-reviews.ts
// features/product/hooks/use-delivery-options.ts
```

## 3. 타입 정리

### 3.1 중복 타입 통합
- Review, ReviewMedia 타입이 여러 곳에서 정의
- Product 관련 타입 분산 (glossier.ts, product.ts, product-data.ts)

**해결방안**:
```
types/
  ├── product/
  │   ├── index.ts
  │   ├── product.ts
  │   └── review.ts
  └── ui/
      ├── modal.ts
      └── form.ts
```

## 4. 상수 관리

### 4.1 하드코딩된 값들
- 배송 옵션 데이터
- 정렬 옵션
- 애니메이션 설정값

**해결방안**:
```typescript
// constants/delivery.ts
// constants/animation.ts
// constants/sort-options.ts
```

## 5. 서비스 레이어 개선

### 5.1 API 호출 통합
- product.service.ts와 product-loader.ts 역할 중복

**해결방안**:
```typescript
// services/product.service.ts에 통합
// utils/product-loader.ts 제거 또는 단순화
```

## 6. 스타일 일관성

### 6.1 반복되는 Tailwind 클래스
```typescript
// 버튼 스타일 중복
"flex-1 bg-black text-white py-4 font-medium text-base hover:bg-gray-800"

// 해결: components/ui/button.tsx 생성
```

### 6.2 애니메이션 설정 중복
```typescript
// 공통 애니메이션 variants
// constants/motion-variants.ts
```

## 7. 데이터 관리

### 7.1 Mock 데이터 정리
```
data/
  ├── mocks/
  │   ├── products.ts
  │   ├── cart.ts
  │   └── tiktok.ts
  └── constants/
      ├── menu.ts
      └── filters.ts
```

## 8. 우선순위

### Phase 1 (즉시)
1. Modal 공통 컴포넌트 생성
2. use-modal-scroll-lock hook 추출
3. Header 컴포넌트 분리

### Phase 2 (단기)
1. Product Detail Page 분리
2. 공통 Button 컴포넌트
3. 타입 정리 및 통합

### Phase 3 (중기)
1. 서비스 레이어 통합
2. 상수 파일 정리
3. 애니메이션 variants 통합

## 9. 파일 크기 기준

- 컴포넌트: 200 lines 이하
- 페이지: 300 lines 이하
- Hook: 100 lines 이하
- 서비스: 200 lines 이하

## 10. 개선 효과

- 코드 중복 제거: 약 30% 감소 예상
- 유지보수성 향상
- 테스트 용이성 증가
- 번들 크기 최적화

