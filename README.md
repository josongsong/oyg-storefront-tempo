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
- **TanStack Query v5** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Framer Motion** - 애니메이션
- **Tailwind CSS v4** - 스타일링
- **Zod** - 런타임 검증

## 프로젝트 구조

```
src/
├── app/           # 앱 초기화, 라우팅
├── widgets/       # 페이지 레벨 조합 (Header, Footer)
├── features/      # 비즈니스 기능
│   ├── auth/      # 인증
│   ├── cart/      # 장바구니
│   ├── product/   # 상품
│   └── ...
├── entities/      # 비즈니스 엔티티 (Branded Types, Zod)
├── shared/        # 재사용 가능한 공통 코드
└── components/    # UI 컴포넌트
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
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## 주요 기능

- ✅ 상품 목록/상세 조회
- ✅ 장바구니 관리
- ✅ 사용자 인증
- ✅ 검색 기능
- ✅ 위시리스트
- ✅ 알림 센터
- ✅ 다국어 지원
- ✅ 프로모션 관리

## 개발 가이드

### Feature 추가
```typescript
// features/my-feature/
├── api/           # API 레이어
├── components/    # UI 컴포넌트
├── hooks/         # React hooks
├── stores/        # Zustand stores
├── types/         # TypeScript 타입
└── index.ts       # Public API
```

### Entity 추가
```typescript
// entities/my-entity/
└── model/
    ├── types.ts      # Branded types
    ├── schemas.ts    # Zod schemas
    └── index.ts
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

## 문서

- [Architecture Guide](./ARCHITECTURE.md) - 상세 아키텍처 가이드
- [Refactoring Complete](./.temp/SOTA_REFACTORING_COMPLETE.md) - 리팩토링 완료 보고서
- [Shared Layer](./src/shared/README.md) - Shared 레이어 규칙

## 프로젝트 상태

✅ **Production Ready**

- TypeScript 컴파일: ✅ 0 Errors
- Vite 빌드: ✅ Success
- FSD 아키텍처: ✅ 완전 적용
- 타입 안전성: ✅ Branded Types + Zod
- 코드 분할: ✅ Route-based Lazy Loading

## License

MIT
