# Shared Layer

FSD (Feature-Sliced Design)의 Shared 레이어입니다.

## 역할
- **재사용 가능한 UI 컴포넌트**: Modal, Carousel 등
- **공통 훅**: useModal, useCarousel 등
- **공통 유틸리티 타입**: BaseEntity, PaginatedResponse 등
- **API 클라이언트**: 모든 feature에서 사용하는 기본 HTTP 클라이언트

## 규칙
1. **비즈니스 로직 금지**: 도메인 특화 로직은 features나 entities에 위치
2. **외부 의존성 없음**: shared는 features를 import하지 않음
3. **순수 재사용성**: 어떤 프로젝트에서도 재사용 가능한 코드만 포함

## 구조
```
shared/
├── api/          # API 클라이언트
├── components/   # 재사용 가능한 UI 컴포넌트
├── hooks/        # 공통 훅
└── types/        # 공통 타입
```
