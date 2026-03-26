# TubePlayer — 사용 가이드

[English](./guide.md) | **한국어**

YouTube 영상을 커스텀 컨트롤로 삽입하는 방법을 단계별로 안내합니다 — 팝업 레이어 또는 페이지 인라인 방식으로.

---

## 목차

1. [설치](#1-설치)
2. [팝업 모드](#2-팝업-모드)
3. [인라인 모드](#3-인라인-모드)
4. [JavaScript API 방식](#4-javascript-api-방식)
5. [모바일 최적화](#5-모바일-최적화)
6. [여러 영상 등록](#6-여러-영상-등록)
7. [테마 설정](#7-테마-설정)
8. [컨트롤 커스터마이징](#8-컨트롤-커스터마이징)
9. [이벤트 활용](#9-이벤트-활용)
10. [수동 인스턴스 제어](#10-수동-인스턴스-제어)
11. [접근성과 키보드](#11-접근성과-키보드)
12. [데모 페이지](#12-데모-페이지)
13. [신규 속성 (v0.2+)](#13-신규-속성-v02)
14. [FAQ](#14-faq)

---

## 1. 설치

### npm / yarn / pnpm

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

---

## 2. 팝업 모드

영상을 오버레이 레이어로 엽니다. 트레일러, 프리뷰, 모달형 영상 경험에 적합합니다.

### Step 1: HTML 작성

```html
<!-- 1) 트리거 버튼 — 클릭하면 레이어가 열립니다 -->
<button data-tube-open="my-trailer">영상 보기</button>

<!-- 2) 레이어 + YouTube 플레이어 선언 -->
<div data-tube-layer="my-trailer"
     data-tube-close-on-dim="true"
     data-tube-animation="fade">
  <div data-tube-youtube="jNQXAC9IVRw"
       data-tube-autoplay="true"
       data-tube-theme="dark"
       data-tube-controls="mute,fullscreen">
  </div>
</div>
```

### Step 2: 초기화

```html
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

---

## 3. 인라인 모드

팝업 없이 페이지에 직접 플레이어를 삽입합니다. 전용 영상 섹션, 랜딩 페이지, 콘텐츠 페이지에 적합합니다.

### HTML

```html
<div data-tube-inline="jNQXAC9IVRw"
     data-tube-theme="dark"
     data-tube-controls="play,progress,time,mute,volume,fullscreen"
     data-tube-autoplay="false">
</div>
```

### 초기화

```html
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

`TubePlayer.init()`은 `[data-tube-layer]`(팝업)와 `[data-tube-inline]`(인라인) 요소를 모두 자동 감지합니다. 같은 페이지에 여러 인라인 플레이어를 사용해도 정상 동작합니다.

### 인라인 모드 특이사항

- **`autoplay` 기본값은 `false`** — 브라우저 정책상 음소거 없이는 자동재생이 차단됩니다.
- **컨트롤바 자동 숨김** — 재생 중에는 숨겨지고, hover 시 다시 표시됩니다.
- 팝업 플레이어의 모든 옵션(`data-tube-loop`, `data-tube-start`, `data-tube-poster` 등)이 인라인 모드에서도 동일하게 동작합니다.

---

## 4. JavaScript API 방식

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

TubePlayer.init();

// 팝업: 특정 레이어 열기
const trailer = TubePlayer.get('my-trailer');
trailer.open();

// 인라인: 엘리먼트 id로 플레이어 가져오기
const player = TubePlayer.getPlayer('my-inline-player');
player.play();
```

---

## 5. 모바일 최적화

`tubeplayer`는 모바일 웹 환경에서도 완벽하게 동작하도록 설계되었습니다.

- **반응형 전체화면**: 모바일 브라우저의 전체화면 모드(`:fullscreen`)에서 화면 가득 차도록 자동 조정됩니다.
- **터치 이벤트**: 재생 바, 컨트롤 버튼 등 모든 UI 요소가 터치 조작에 최적화되어 있습니다.
- **스와이프 닫기**: 팝업 모드에서 아래로 스와이프하면 레이어를 닫을 수 있습니다.
- **레이아웃**: `clamp()` 등의 최신 CSS 기능을 활용하여 유동적인 레이아웃을 제공합니다.

---

## 6. 여러 영상 등록

팝업 레이어 여러 개, 인라인 플레이어 여러 개, 또는 둘을 혼합하여 한 페이지에 등록할 수 있습니다.

```html
<!-- 팝업 플레이어 -->
<button data-tube-open="trailer-1">트레일러 1</button>
<button data-tube-open="trailer-2">트레일러 2</button>

<div data-tube-layer="trailer-1" data-tube-animation="fade">
  <div data-tube-youtube="VIDEO_ID_1" data-tube-theme="dark"></div>
</div>
<div data-tube-layer="trailer-2" data-tube-animation="slide">
  <div data-tube-youtube="VIDEO_ID_2" data-tube-theme="dark"></div>
</div>

<!-- 인라인 플레이어 -->
<div id="player-a" data-tube-inline="VIDEO_ID_3"
     data-tube-theme="dark"
     data-tube-controls="play,progress,time,mute,fullscreen">
</div>
<div id="player-b" data-tube-inline="VIDEO_ID_4"
     data-tube-theme="dark"
     data-tube-controls="mute,fullscreen">
</div>
```

---

## 7. 테마 설정

CSS 변수를 오버라이드하여 브랜드 컬러를 적용할 수 있습니다.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

---

## 8. 컨트롤 커스터마이징

`data-tube-controls` 속성에 표시할 컨트롤을 쉼표로 나열합니다.

| 키 | 위치 | 설명 |
|---|---|---|
| `play` | 좌측 | 재생 / 일시정지 토글 |
| `progress` | 상단 | 시크 바 |
| `time` | 좌측 | 경과 시간 / 전체 시간 |
| `speed` | 좌측 | 재생 속도 순환 (0.5× → 2×) |
| `mute` | 우측 | 음소거 토글 |
| `volume` | 우측 | 볼륨 슬라이더 |
| `fullscreen` | 우측 | 전체화면 |
| `youtube-link` | 우측 | YouTube에서 열기 |

---

## 9. 이벤트 활용

```js
// 팝업 모드
const instance = TubePlayer.get('my-trailer');
instance.on('layer:open',  () => console.log('레이어 열림'));
instance.on('layer:close', () => console.log('레이어 닫힘'));
instance.on('video:play',  () => console.log('재생 시작'));
instance.on('video:pause', () => console.log('일시정지'));
instance.on('video:end',   () => console.log('재생 종료'));
instance.on('video:ready', () => console.log('플레이어 준비'));

// 인라인 모드
const player = TubePlayer.getPlayer('my-inline-player');
player.on('video:play',  () => console.log('재생 시작'));
player.on('video:pause', () => console.log('일시정지'));
player.on('video:end',   () => console.log('재생 종료'));
```

---

## 10. 수동 인스턴스 제어

```js
const player = TubePlayer.getPlayer('my-inline-player');

player.play();
player.pause();
player.mute();
player.unmute();
player.setVolume(80);   // 0–100
player.seek(30);        // 30초로 이동
```

---

## 11. 접근성과 키보드

레이어가 열려있을 때(팝업) 또는 플레이어에 포커스가 있을 때(인라인) 다음 키보드 단축키를 사용할 수 있습니다.
모바일 터치 환경에서는 단축키 안내가 자동으로 숨겨집니다.

| 키 | 동작 |
|---|---|
| `Space` | 재생 / 일시정지 |
| `Esc` | 레이어 닫기 (팝업 전용) |
| `M` | 음소거 토글 |
| `F` | 전체화면 토글 |
| `←` / `→` | 5초 앞/뒤 이동 |

---

## 12. 데모 페이지

데모 페이지(`demo/index.html`)는 라이브러리의 사용 방법을 직접 확인할 수 있는 인터랙티브 가이드입니다.

- **히어로 섹션**: 실제 플레이어 동작 확인 ("플레이어 열기" 버튼)
- **Feature Demos**: 7개 인터랙티브 카드 — 팝업 애니메이션, 반복 재생, 재생 시작 시간, 자동 닫기, 컨트롤 커스터마이징, 커스텀 포스터, 인라인 플레이어
- **인라인 데모 섹션**: 페이지에 직접 삽입된 3개의 라이브 인라인 플레이어 (전체 컨트롤 / 최소 / 반복)
- **Get Started 섹션**: HTML 마크업 단계에 Popup/Inline 탭 포함, 속성 레퍼런스 테이블, 코드 복사 버튼
- **다국어 지원**: 브라우저 언어 설정에 따라 자동 전환, 우측 상단 KO/EN 토글로 수동 변경 가능

로컬에서 실행하려면:

```bash
npm run dev
```

---

## 13. 신규 속성 (v0.2+)

| 속성 | 설명 | 기본값 |
|---|---|---|
| `data-tube-inline` | 인라인 모드용 YouTube 영상 ID (팝업 없음) | — |
| `data-tube-start` | 재생 시작 시간 (초) | `0` |
| `data-tube-loop` | 반복 재생 여부 | `false` |
| `data-tube-poster` | 커스텀 포스터 이미지 URL | YouTube 썸네일 |
| `data-tube-close-on-end` | 영상 종료 시 레이어 자동 닫기 (팝업 전용) | `false` |

볼륨 및 음소거 상태는 `localStorage`(`tube-volume`, `tube-muted`)에 자동 저장됩니다.

팝업 모드에서는 모바일에서 아래로 스와이프하면 레이어를 닫을 수 있습니다.

---

## 14. FAQ

### Q: Vercel에 배포하려면 어떻게 하나요?

프로젝트 루트에서 `npm run build`를 실행하면 `demo/` 폴더의 내용이 빌드되어 `dist/`에 저장됩니다. Vercel에서 기본 빌드 명령어로 설정되어 있어 바로 배포 가능합니다.

### Q: 레이어를 다시 열면 영상이 처음부터 나옵니다.

네, `tubeplayer`는 트레일러/홍보 영상 시청 경험을 위해 레이어 재오픈 시 영상을 항상 0초부터 다시 재생합니다. `data-tube-restart-on-open="false"`로 비활성화할 수 있습니다.

### Q: 같은 페이지에 인라인 플레이어를 여러 개 사용할 수 있나요?

네. 각 `[data-tube-inline]` 요소는 독립적으로 초기화됩니다. `TubePlayer.getPlayer(id)`로 접근하려면 각 요소에 고유한 `id` 속성을 부여하세요.

### Q: 인라인 플레이어에서 자동재생이 동작하지 않습니다.

브라우저 정책상 음소거 없이는 자동재생이 차단됩니다. `data-tube-autoplay="true"`와 함께 `data-tube-muted="true"`를 설정하거나, 사용자가 직접 재생 버튼을 누르도록 유도하세요.
