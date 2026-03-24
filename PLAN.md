# TubePlayer — 커스텀 YouTube 팝업 플레이어 라이브러리 설계 계획

> 작성일: 2026-03-24  
> 목적: `cinder-city.com` 트레일러 플레이어 구조 분석을 기반으로, 재사용 가능한 커스텀 YouTube 팝업 플레이어 라이브러리를 직접 설계 및 구현한다.

---

## 1. 개요

### 1.1 배경

게임 공식 사이트(`cinder-city.com`)에서 사용된 `layer` + `youtube` 구조를 분석하여, 프레임워크에 의존하지 않는 독립적인 라이브러리로 개발한다.

### 1.2 목표

- 프레임워크 비종속 (Vanilla JS 코어)
- 커스텀 UI 컨트롤 완전 제어 가능
- 에이전시 프로젝트 즉시 적용 가능한 수준의 완성도 (모바일 대응 완료)
- Vercel을 통한 데모 호스팅 및 npm 패키지 배포

### 1.3 라이브러리 정보

| 항목 | 내용 |
|---|---|
| 패키지명 | `tubeplayer` |
| 버전 | `0.1.0` (MVP) |
| 라이선스 | MIT |
| 지원 환경 | Chrome, Firefox, Safari, Edge (최신 2버전) + 모바일 웹 |
| 번들러 | Vite (ESM + CJS + UMD 빌드) |

---

## 2. 폴더 구조

```
tube-player/
├── src/
│   ├── core/
│   │   ├── TubeLayer.js          # 팝업 레이어 시스템
│   │   ├── TubeManager.js        # 전역 인스턴스 관리
│   │   └── EventEmitter.js       # 이벤트 시스템
│   ├── players/
│   │   └── TubeYouTube.js        # YouTube IFrame API 래퍼
│   ├── controls/
│   │   ├── PlayPause.js          # 재생 / 일시정지 (중앙 오버레이)
│   │   ├── Mute.js               # 음소거 토글
│   │   └── Fullscreen.js         # 전체화면 토글
│   ├── styles/
│   │   ├── base.css              # 공통 기본 스타일 (반응형 포함)
│   │   └── themes/
│   │       └── dark.css          # 다크 테마
│   └── index.js                  # 라이브러리 진입점
├── demo/                         # 데모 페이지 (Vercel 배포용)
├── docs/                         # 문서 (가이드)
├── tests/                        # 테스트 코드
├── vite.config.js
├── package.json
├── GEMINI.md                     # 엔지니어링 원칙
├── CLAUDE.md                     # 컨텍스트 문서
└── README.md
```

---

## 3. 핵심 모듈 설계 (구현 완료)

### 3.1 TubeLayer — 팝업 레이어

**역할**: 팝업 열기/닫기, 딤처리, 포커스 트랩, 애니메이션 관리

**주요 기능**
- `layer:open`, `layer:close` 이벤트 제공
- ESC 키 및 딤 클릭 시 닫기 지원

### 3.2 TubeYouTube — YouTube 플레이어

**역할**: YouTube IFrame API 래핑 + 커스텀 UI 제어

**주요 기능**
- YouTube 기본 UI 완전 차단 (Poster + Overlay)
- 모바일 전체화면 최적화 (`:fullscreen` 스타일)
- 레이어 재오픈 시 0초부터 재생 (`seek(0)`)

---

## 4. 개발 로드맵

### Phase 1 — MVP (완료)

- [x] 프로젝트 초기 세팅 (Vite)
- [x] `TubeLayer` — 팝업 레이어 시스템 구현
- [x] `TubeYouTube` — YouTube IFrame API 연동
- [x] 커스텀 컨트롤 구현 (음소거, 전체화면, 중앙 재생버튼)
- [x] 다크 테마 CSS 및 CSS 변수 시스템
- [x] 데이터 속성 기반 자동 초기화 (`TubePlayer.init()`)
- [x] Vercel 배포를 위한 빌드 설정 최적화
- [x] **모바일 최적화 (반응형 로고, 유동적 폰트, 터치 대응 레이아웃)**
- [x] **모바일 전체화면 버그 수정**

### Phase 2 — 확장 (예정)

- [ ] React / Vue 어댑터 추가 (별도 패키지 또는 폴더)
- [ ] ProgressBar (진행 바) 및 TimeDisplay 추가
- [ ] Vimeo 플레이어 지원 (`TubeVimeo`)
- [ ] 애니메이션 옵션 확장 (slide / zoom 고도화)

### Phase 3 — 안정화

- [ ] npm 패키지 배포
- [ ] 단위 테스트 커버리지 확대 (Vitest)
- [ ] API 문서 자동화

---

## 5. 빌드 및 배포 설정

- **데모 배포**: Vercel 연동 (`npm run build`)
- **라이브러리 빌드**: `npm run build:lib` 실행 시 `dist/` 폴더에 번들 생성
- **멀티 포맷**: ESM, CommonJS, UMD 지원
