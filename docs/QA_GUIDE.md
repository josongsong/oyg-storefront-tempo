# QA 협업 가이드

## 환경 설정

### 1. 초기 설정
```bash
# 저장소 클론
git clone [repo-url]
cd oyg-web-v2

# 의존성 설치
pnpm install

# Playwright 브라우저 설치
pnpm exec playwright install

# 개발 서버 실행
pnpm dev
```

### 2. 필수 도구
- **Node.js**: v18 이상
- **pnpm**: 패키지 매니저
- **VSCode**: 권장 IDE

---

## 테스트 실행

### 유닛/통합 테스트 (Vitest)
```bash
# UI로 보기 (브라우저)
pnpm test:ui

# 커버리지 확인
pnpm test:coverage

# Watch 모드
pnpm test:watch
```

### E2E 테스트 (Playwright)
```bash
# UI 모드 (디버깅)
pnpm test:e2e:ui

# 실행 후 리포트 보기
pnpm test:e2e
pnpm test:e2e:report
```

---

## 테스트 작성

### 위치
```
tests/
├── unit/           # 함수, 유틸리티 테스트
├── integration/    # 기능 통합 테스트
└── e2e/           # 사용자 시나리오 테스트
```

### E2E 테스트 작성 예시

```typescript
// tests/e2e/specs/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('결제 플로우', () => {
  test('상품 구매 완료까지', async ({ page }) => {
    // Given: 홈페이지 접속
    await page.goto('/')
    
    // When: 상품 선택
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('[data-testid="add-to-cart-btn"]')
    await page.click('[data-testid="cart-icon"]')
    await page.click('[data-testid="checkout-btn"]')
    
    // Then: 결제 페이지 확인
    await expect(page).toHaveURL(/.*checkout/)
    await expect(page.locator('h1')).toContainText('주문/결제')
  })
})
```

### 통합 테스트 작성 예시

```typescript
// tests/integration/features/cart/cart-flow.test.tsx
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent } from '@/test/utils'
import { CartPage } from '@/features/cart/pages/cart-page'

describe('장바구니 플로우', () => {
  it('상품을 추가하고 수량을 변경할 수 있다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartPage />)
    
    // 테스트 시나리오...
  })
})
```

---

## 버그 리포트

### 템플릿

```markdown
## 버그 요약
[한 줄 요약]

## 재현 단계
1. [단계 1]
2. [단계 2]
3. [단계 3]

## 예상 결과
[무엇을 기대했는지]

## 실제 결과
[실제로 무엇이 발생했는지]

## 환경
- 브라우저: Chrome 120
- OS: macOS 14
- 뷰포트: 1920x1080
- 로케일: ko

## 스크린샷/영상
[첨부]

## 추가 정보
[에러 메시지, 콘솔 로그 등]
```

---

## 테스트 체크리스트

### 기능 테스트

#### 홈페이지
- [ ] 페이지 로드 (< 3초)
- [ ] 상품 그리드 표시
- [ ] 프로모션 배너 동작
- [ ] 비디오 자동재생
- [ ] 반응형 레이아웃

#### 상품
- [ ] 상품 목록 표시
- [ ] 필터/정렬 기능
- [ ] 상품 상세 정보
- [ ] 이미지 확대
- [ ] 리뷰 작성/조회
- [ ] 위시리스트 추가/제거

#### 장바구니
- [ ] 상품 추가
- [ ] 수량 증감
- [ ] 상품 제거
- [ ] 가격 계산
- [ ] 쿠폰 적용
- [ ] 빈 장바구니 처리

#### 결제
- [ ] 배송지 입력
- [ ] 결제 수단 선택
- [ ] 주문 검토
- [ ] 결제 완료

#### 인증
- [ ] 로그인
- [ ] 로그아웃
- [ ] 회원가입
- [ ] 소셜 로그인

### 크로스 브라우저
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 반응형
- [ ] 데스크톱 (1920x1080)
- [ ] 태블릿 (768x1024)
- [ ] 모바일 (375x667)

### 다국어
- [ ] 한국어
- [ ] 영어
- [ ] 언어 전환

### 접근성
- [ ] 키보드 네비게이션
- [ ] 스크린 리더
- [ ] 색상 대비
- [ ] 포커스 표시

---

## 우선순위 정의

### P0 (긴급)
- 앱 크래시
- 결제 불가
- 로그인 불가

### P1 (높음)
- 주요 기능 오류
- 데이터 손실
- 성능 저하

### P2 (중간)
- UI 깨짐
- 텍스트 오류
- 비주요 기능 오류

### P3 (낮음)
- 개선 제안
- UX 피드백

---

## 협업 프로세스

### 1. 테스트 계획
1. 기능 스펙 검토
2. 테스트 케이스 작성
3. 우선순위 설정

### 2. 테스트 실행
1. 수동 테스트
2. 자동화 테스트 실행
3. 결과 기록

### 3. 버그 보고
1. 이슈 생성 (GitHub Issues)
2. 라벨 지정 (bug, P0-P3)
3. 담당자 할당

### 4. 재테스트
1. 수정 확인
2. 회귀 테스트
3. 이슈 클로즈

---

## 유용한 명령어

```bash
# 특정 테스트만 실행
pnpm test cart

# 디버그 모드
pnpm test:ui

# 브라우저 선택
pnpm test:e2e --project=chromium

# 특정 파일만
pnpm test:e2e checkout.spec.ts

# 헤드리스 끄기
pnpm test:e2e --headed

# 느린 실행 (디버깅)
pnpm test:e2e --slow-mo=1000
```

---

## 리소스

- [Playwright 문서](https://playwright.dev)
- [Vitest 문서](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- 프로젝트 테스트 가이드: `docs/TESTING.md`

