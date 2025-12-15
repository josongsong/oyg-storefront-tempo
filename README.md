# OYG Web v2

현대적인 전자상거래 웹 애플리케이션

## 📚 문서

- [프로젝트 상세 문서](./docs/README.md)
- [아키텍처 가이드](./docs/ARCHITECTURE.md)
- [디자인 시스템](./docs/DESIGN_SYSTEM.md)
- [테스트 가이드](./docs/TESTING.md)

## 🚀 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test
```

## 🏗️ 기술 스택

- **Framework**: React + TypeScript
- **Build**: Vite
- **Architecture**: Feature-Sliced Design (FSD)
- **State**: Zustand + TanStack Query
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Playwright

## 📁 프로젝트 구조

```
src/
├── app/          # 앱 초기화 및 전역 상태
├── widgets/      # 페이지 레벨 컴포넌트
├── features/     # 비즈니스 기능
├── entities/     # 도메인 모델
└── shared/       # 공통 코드
```

자세한 내용은 [아키텍처 문서](./docs/ARCHITECTURE.md)를 참조하세요.

