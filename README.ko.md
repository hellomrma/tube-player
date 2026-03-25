# TubePlayer — YouTube Popup Player

[English](./README.md) | **한국어**

[![npm version](https://img.shields.io/npm/v/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![npm downloads](https://img.shields.io/npm/dm/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![license](https://img.shields.io/npm/l/tubeplayer)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tubeplayer.playgrounder.dev/)

커스텀 YouTube 팝업 플레이어 라이브러리.

YouTube 기본 UI를 완전히 숨기고, 커스텀 컨트롤과 팝업 레이어를 제공합니다.
프레임워크 비종속 Vanilla JS 코어 기반으로 설계되었습니다.

**[라이브 데모 →](https://tubeplayer.playgrounder.dev/)**

## 특징

- **YouTube UI 완전 차단:** 포스터 + 오버레이 기법을 통해 YouTube의 로고 및 컨트롤을 완벽히 숨김.
- **모바일 최적화:** `clamp()` 기반 유동 타이포그래피, 반응형 레이아웃, 아래로 스와이프하여 닫기 제스처 지원.
- **팝업 시스템:** 딤(Dim), 포커스 트랩, ESC 키/딤 클릭 시 닫기, 3가지 애니메이션(Fade, Slide, Zoom).
- **고도화된 전체화면:** 모바일 브라우저에서도 영상이 화면에 꽉 차도록 최적화된 전체화면 모드 지원.
- **레이어 재오픈 로직:** 레이어를 다시 열 때 영상이 항상 처음(`data-tube-start` 기준)부터 재생되도록 자동 제어.
- **반복 재생 & 시작 시간:** `data-tube-loop`로 반복 재생, `data-tube-start`로 특정 초부터 시작.
- **영상 종료 시 자동 닫기:** `data-tube-close-on-end`로 영상이 끝나면 레이어 자동 닫기.
- **커스텀 포스터:** `data-tube-poster`로 YouTube 썸네일 대신 원하는 이미지 지정.
- **볼륨 상태 유지:** 음소거 및 볼륨 수준을 `localStorage`에 저장하여 다음 방문 시 자동 복원.
- **재생 속도 컨트롤:** `data-tube-controls`에 `speed` 추가로 0.5× – 2× 속도 조절 지원.
- **커스터마이징:** CSS 변수 기반 테마 시스템 및 데이터 속성을 이용한 선언적 초기화.
- **번들 지원:** ESM / CJS / UMD 포맷 제공으로 다양한 환경에서 사용 가능.
- **다국어 데모 페이지:** 브라우저 언어 설정에 따라 한국어/영어 자동 전환되는 Get Started 가이드 내장.

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
