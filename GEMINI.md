# GEMINI.md — TubePlayer Engineering Mandates

이 파일은 `tubeplayer` 프로젝트의 개발 및 유지보수 시 Gemini CLI가 준수해야 할 최상위 지침을 정의합니다.

## 1. UI/UX 무결성 (UI Integrity)
- **YouTube UI 차단:** YouTube의 기본 컨트롤, 로고, 관련 영상 등이 노출되지 않도록 `poster` 및 `overlay` 로직을 엄격히 유지한다.
- **심미성 우선:** 모든 UI 변경은 현대적이고 미니멀한 다크 테마 디자인 가이드를 준수해야 한다. (Glassmorphism, 부드러운 애니메이션 등)
- **반응형 최적화:** 모든 기능은 데스크톱뿐만 아니라 모바일 터치 환경에서도 완벽하게 동작해야 한다.

## 2. 아키텍처 원칙 (Architectural Principles)
- **Vanilla Core:** 코어 로직은 특정 프레임워크(React, Vue 등)에 의존하지 않는 순수 자바스크립트(ESM)를 유지한다.
- **이벤트 기반:** 기능 간 결합도를 낮추기 위해 `EventEmitter`를 통한 통신 구조를 지향한다.
- **모듈화:** 새로운 컨트롤이나 플레이어 엔진(Vimeo 등) 추가 시 플러그인 형태로 확장 가능하도록 설계한다.

## 3. 개발 및 빌드 워크플로우
- **문서 동기화:** 코드 변경 시 `README.md`, `PLAN.md`, `CLAUDE.md`, `docs/guide.md`를 항상 최신 상태로 업데이트한다.
- **Vercel 배포:** `npm run build`는 항상 데모 사이트가 정상적으로 빌드되어 배포될 수 있도록 유지한다.
- **라이브러리 번들:** `npm run build:lib`를 통해 생성되는 라이브러리 파일의 무결성을 보장한다.

## 4. 품질 관리 (Quality Control)
- **테스트 필수:** 주요 로직 변경 시 `tests/` 폴더 내에 Vitest 기반의 테스트 코드를 확인하거나 추가한다.
- **접근성(A11y):** 키보드 단축키, 포커스 트랩, ARIA 속성 등 웹 접근성 표준을 준수한다.
- **성능:** 불필요한 의존성 추가를 지양하고 번들 사이즈 최적화를 고려한다.
