# TubePlayer — YouTube Popup Player

[English](./README.md) | **한국어**

[![npm version](https://img.shields.io/npm/v/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![npm downloads](https://img.shields.io/npm/dm/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![license](https://img.shields.io/npm/l/tubeplayer)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tubeplayer.playgrounder.dev/)

YouTube 영상을 **내 방식**으로 — YouTube 방식이 아닌.

TubePlayer는 YouTube 기본 UI를 완전히 걷어내고, 커스텀 컨트롤과 세련된 팝업 레이어로 대체합니다. YouTube 로고도, 추천 영상도, 불필요한 UI도 없습니다. 오직 당신의 콘텐츠와 브랜드만.

**[라이브 데모 →](https://tubeplayer.playgrounder.dev/)**

## 왜 TubePlayer인가?

> HTML에 YouTube 영상을 넣고, 완전히 브랜드화된 팝업 경험을 5분 안에 구현하세요.

- **내 브랜드, YouTube 아님** — 로고, 컨트롤, 엔드 스크린 추천 영상까지 완벽히 차단.
- **어디서든 동작** — 프레임워크 비종속 Vanilla JS. React, Vue, 순수 HTML — 모두 지원.
- **모바일 퍼스트** — 스와이프로 닫기, 터치 최적화 컨트롤, 모든 기기에서 완벽한 전체화면.
- **의존성 제로** — jQuery도, lodash도 없음. 순수 ES Modules, 약 7 kB (gzip).
- **선언적 설정** — HTML에 `data-tube-*` 속성을 추가하고 `TubePlayer.init()` 호출 끝.

## 기능

### 팝업 & UX
- 딤 오버레이, 포커스 트랩, 3가지 애니메이션(Fade / Slide / Zoom)
- ESC, 딤 클릭, 또는 아래로 스와이프(모바일)로 닫기
- 볼륨 및 음소거 상태를 `localStorage`에 저장하여 재방문 시 자동 복원
- 레이어를 다시 열면 항상 깔끔하게 처음부터 재생

### 재생 제어
- 커스텀 컨트롤 바: 재생/일시정지, 시크 바, 시간 표시, 음소거, 볼륨 슬라이더, 전체화면, 속도, YouTube 링크
- 재생 속도 순환: 0.5× → 0.75× → 1× → 1.25× → 1.5× → 2×
- 시작 시간(`data-tube-start`), 반복 재생(`data-tube-loop`), 영상 종료 시 자동 닫기(`data-tube-close-on-end`)
- 키보드 단축키 지원 — Space, M, F, ←/→ (터치 기기에서는 자동 숨김)

### 커스터마이징
- 커스텀 포스터 이미지로 YouTube 썸네일 대체
- CSS 변수 기반 테마 시스템 — 한 줄로 브랜드 컬러 적용
- `data-tube-*` HTML 속성 또는 JavaScript API로 완전한 선언적 설정 가능

### 개발자 경험
- ESM / CJS / UMD 번들 포맷 — 모든 환경에서 사용 가능
- TypeScript 타입 정의 포함
- 경량: 약 7 kB gzipped (코어)

## 설치

### npm

```bash
npm install tubeplayer
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tubeplayer/dist/style.css">
<!-- JS (UMD) -->
<script src="https://cdn.jsdelivr.net/npm/tubeplayer/dist/tubeplayer.umd.js"></script>
```

## 빠른 시작

### HTML 선언적 방식

```html
<!-- 트리거 버튼 -->
<button data-tube-open="demo-layer">데모 열기</button>

<!-- 레이어 + 플레이어 선언 -->
<div data-tube-layer="demo-layer"
     data-tube-close-on-dim="true"
     data-tube-animation="fade">
  <div data-tube-youtube="B868ddnPpsc"
       data-tube-autoplay="true"
       data-tube-theme="dark"
       data-tube-controls="mute,fullscreen">
  </div>
</div>

<!-- 초기화 -->
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

### JavaScript API 방식

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

// 자동 초기화 (data-tube 속성 탐색)
TubePlayer.init({
  theme: 'dark',
  autoplay: true,
});

// 수동 제어
const instance = TubePlayer.get('demo-layer');
instance.open();
instance.on('video:play', () => console.log('재생 시작'));
instance.on('video:end',  () => console.log('재생 종료'));
```

## 데이터 속성

### 레이어 (`data-tube-layer`)

| 속성 | 설명 | 기본값 |
|---|---|---|
| `data-tube-layer` | 레이어 고유 ID | (필수) |
| `data-tube-close-on-dim` | 딤 클릭 시 닫기 여부 | `true` |
| `data-tube-close-on-esc` | ESC 키로 닫기 여부 | `true` |
| `data-tube-animation` | 애니메이션 종류 (`fade`, `slide`, `zoom`) | `fade` |

### 플레이어 (`data-tube-youtube`)

| 속성 | 설명 | 기본값 |
|---|---|---|
| `data-tube-youtube` | YouTube 비디오 ID | (필수) |
| `data-tube-autoplay` | 자동 재생 여부 | `true` |
| `data-tube-muted` | 음소거 시작 여부 | `false` |
| `data-tube-theme` | 테마 색상 (`dark`) | `dark` |
| `data-tube-controls` | 노출할 컨트롤 (쉼표 구분: `mute,fullscreen,speed`) | `mute,fullscreen` |
| `data-tube-start` | 재생 시작 시간 (초) | `0` |
| `data-tube-loop` | 반복 재생 여부 | `false` |
| `data-tube-poster` | 커스텀 포스터 이미지 URL | YouTube 썸네일 |
| `data-tube-close-on-end` | 영상 종료 시 레이어 자동 닫기 | `false` |

## 키보드 단축키 (데스크톱)

레이어가 열려있을 때 다음 단축키를 사용할 수 있습니다. 터치 기기에서는 단축키 안내가 자동으로 숨겨집니다.

| 키 | 동작 |
|---|---|
| `Space` | 재생 / 일시정지 |
| `Esc` | 레이어 닫기 |
| `M` | 음소거 토글 |
| `F` | 전체화면 토글 |
| `←` / `→` | 5초 앞/뒤 이동 |

## 테마 커스터마이징

CSS 변수를 오버라이드하여 브랜드 컬러를 적용할 수 있습니다.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

## 빌드 및 배포

```bash
npm run dev        # 로컬 개발 서버 및 데모 확인
npm run build      # Vercel 배포용 정적 데모 사이트 빌드
npm run build:lib  # NPM 배포용 라이브러리 파일 빌드 (dist/)
npm run test       # Vitest 기반 단위 테스트 실행
```

## 브라우저 지원

Chrome, Firefox, Safari, Edge (최신 2버전 기준). 모바일 환경 최적화 완료.

## 라이선스

MIT
