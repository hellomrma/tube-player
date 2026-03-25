# CLAUDE.md — TubePlayer

이 파일은 Claude Code가 프로젝트를 이해하기 위한 컨텍스트 문서입니다.

## 프로젝트 개요

`tubeplayer`는 커스텀 YouTube 팝업 플레이어 JavaScript 라이브러리입니다.
`cinder-city.com`의 레이어 + YouTube 구조를 참고하여 설계되었습니다.

- 프레임워크 비종속 (Vanilla JS 코어)
- YouTube 기본 UI를 완전히 숨기고 커스텀 컨트롤로 대체
- **모바일 웹 환경 최적화 (반응형, 전체화면)**
- Vercel 배포 최적화 (데모 호스팅용)
- **데모 페이지에 Get Started 문서 섹션 내장** (설치, HTML, 초기화, 이벤트 4단계)
- **데모 페이지 i18n**: `navigator.language`로 한국어/영어 자동 전환

## 기술 스택

- **빌드**: Vite 5 (ESM + CJS + UMD)
- **테스트**: Vitest
- **언어**: Vanilla JavaScript (ES Modules)
- **스타일**: CSS (CSS 변수 기반 테마, 반응형)
- **문서**: README.md (영문), README.ko.md (한국어), docs/guide.md (사용 가이드)

## 폴더 구조

```
tubeplayer/
├── src/
│   ├── core/           # TubeLayer, TubeManager, EventEmitter
│   ├── players/        # TubeYouTube (향후 TubeVimeo, TubeVideo)
│   ├── controls/       # Mute, Fullscreen, PlayPause
│   ├── styles/         # base.css (모바일 최적화), themes/dark.css
│   └── index.js        # 진입점
├── demo/               # 데모 페이지 (Vercel 배포 소스)
├── docs/               # 가이드 문서
├── tests/              # 테스트 코드
└── vite.config.js
```

## 핵심 아키텍처

### YouTube 기본 UI 차단 전략 (중요)

YouTube iframe 위에 3개 레이어를 쌓아 기본 UI를 완전히 차단합니다:

1. **iframe** (z-index: auto) — YouTube 영상
2. **poster** (z-index: 1) — 일시정지/종료 시 YouTube 썸네일로 iframe을 덮음
3. **overlay** (z-index: 2) — 항상 최상위, 마우스 hover를 가로채 YouTube UI 노출 차단 + 중앙 재생/일시정지 버튼
4. **controls** (z-index: 3) — 하단 커스텀 컨트롤 바 (음소거, 전체화면)

### 모바일 최적화 포인트

- **전체화면**: `:fullscreen`, `:-webkit-full-screen` 의사 클래스를 사용하여 모바일 전체화면 시 `100vw`, `100vh`를 강제하고 `padding-bottom` 비율을 해제합니다.
- **반응형 UI**: 데모 페이지는 `clamp()` 유동 타이포그래피와 반응형 로고(`max-width: 80vw`)를 사용합니다.
- **터치 대응**: `(hover: none) and (pointer: coarse)` 미디어 쿼리로 키보드 단축키 안내를 자동으로 숨깁니다.

### 데모 페이지 구조 (`demo/index.html`)

- **히어로 섹션**: 로고, 설명, "데모 열기" 버튼, 스크롤 힌트
- **Get Started 섹션**: 설치(npm/CDN 탭) → HTML 마크업(속성 레퍼런스 테이블 포함) → 초기화(ESM/UMD 탭) → 이벤트 4단계. 코드 블록은 highlight.js로 구문 강조, 복사 버튼 내장.
- **i18n**: `TRANSLATIONS` 객체(`ko`/`en`)와 `data-i18n` / `data-i18n-html` / `data-i18n-code` 속성으로 관리. highlight.js 실행 전에 `data-i18n-code` (코드 블록 텍스트) 적용.

### 특이 동작

- **비디오 재시작**: `TubeManager`는 레이어가 이미 마운트된 상태에서 다시 열릴 때 `player.seek(0).play()`를 실행하여 영상을 항상 처음부터 재생하도록 강제합니다.

## 빌드 명령어

```bash
npm run dev        # Vite 개발 서버 (demo 사이트 자동 열림)
npm run build      # Vercel 배포용 데모 사이트 빌드 → dist/
npm run build:lib  # 라이브러리 전용 빌드 (ES+CJS+UMD) → dist/
npm run preview    # 빌드 결과물 프리뷰
npm run test       # Vitest 테스트
```

## 네이밍 컨벤션

- CSS 클래스: `tube-` 접두사 (예: `tube-layer`, `tube-youtube`, `tube-control`)
- 데이터 속성: `data-tube-` 접두사 (예: `data-tube-layer`, `data-tube-youtube`)
- CSS 변수: `--tube-` 접두사 (예: `--tube-control-color`, `--tube-dim-bg`)
- JS 클래스: `Tube` 접두사 (예: `TubeLayer`, `TubeYouTube`, `TubeManager`)
