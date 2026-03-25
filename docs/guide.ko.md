# TubePlayer 사용 가이드

[English](./guide.md) | **한국어**

웹 프로젝트에 커스텀 YouTube 팝업 플레이어를 추가하는 방법을 단계별로 안내합니다.

---

## 목차

1. [설치](#1-설치)
2. [기본 사용법 (HTML 선언적 방식)](#2-기본-사용법)
3. [JavaScript API 방식](#3-javascript-api-방식)
4. [모바일 최적화](#4-모바일-최적화)
5. [여러 영상 등록](#5-여러-영상-등록)
6. [테마 설정](#6-테마-설정)
7. [컨트롤 커스터마이징](#7-컨트롤-커스터마이징)
8. [이벤트 활용](#8-이벤트-활용)
9. [수동 인스턴스 제어](#9-수동-인스턴스-제어)
10. [접근성과 키보드](#10-접근성과-키보드)
11. [데모 페이지](#11-데모-페이지)
12. [FAQ](#12-faq)

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

## 2. 기본 사용법

가장 간단한 방법은 HTML 데이터 속성만으로 선언하고, `TubePlayer.init()`을 호출하는 것입니다.

### Step 1: HTML 작성

```html
<!-- 1) 트리거 버튼 — 클릭하면 레이어가 열립니다 -->
<button data-tube-open="my-trailer">영상 보기</button>

<!-- 2) 레이어 + YouTube 플레이어 선언 -->
<div data-tube-layer="my-trailer"
     data-tube-close-on-dim="true"
     data-tube-animation="fade">
  <div data-tube-youtube="B868ddnPpsc"
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

## 3. JavaScript API 방식

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

TubePlayer.init();

// 특정 레이어 열기
const trailer = TubePlayer.get('my-trailer');
trailer.open();
```

---

## 4. 모바일 최적화

`tubeplayer`는 모바일 웹 환경에서도 완벽하게 동작하도록 설계되었습니다.

- **반응형 전체화면**: 모바일 브라우저의 전체화면 모드(`:fullscreen`)에서 영상이 화면 가득 차도록 자동 조정됩니다.
- **터치 이벤트**: 재생 바, 컨트롤 버튼 등 모든 UI 요소가 터치 조작에 최적화되어 있습니다.
- **레이아웃**: `clamp()` 등의 최신 CSS 기능을 활용하여 유동적인 레이아웃을 제공합니다.

---

## 5. 여러 영상 등록

하나의 페이지에 여러 개의 레이어와 영상을 등록할 수 있습니다.

```html
<button data-tube-open="trailer-1">트레일러 1</button>
<button data-tube-open="trailer-2">트레일러 2</button>

<div data-tube-layer="trailer-1" data-tube-animation="fade">
  <div data-tube-youtube="VIDEO_ID_1" data-tube-theme="dark"></div>
</div>

<div data-tube-layer="trailer-2" data-tube-animation="slide">
  <div data-tube-youtube="VIDEO_ID_2" data-tube-theme="dark"></div>
</div>
```

---

## 6. 테마 설정

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

## 7. 컨트롤 커스터마이징

`data-tube-controls` 속성에 표시할 컨트롤을 쉼표로 나열합니다.

| 키 | 위치 | 설명 |
|---|---|---|
| `mute` | 우측 | 음소거 토글 |
| `fullscreen` | 우측 | 전체화면 |

---

## 8. 이벤트 활용

```js
const instance = TubePlayer.get('my-trailer');

instance.on('layer:open',  () => console.log('레이어 열림'));
instance.on('layer:close', () => console.log('레이어 닫힘'));
instance.on('video:play',  () => console.log('재생 시작'));
instance.on('video:pause', () => console.log('일시정지'));
instance.on('video:end',   () => console.log('재생 종료'));
instance.on('video:ready', () => console.log('플레이어 준비'));
```

---

## 9. 수동 인스턴스 제어

```js
const player = TubePlayer.getPlayer('trailer');

player.play();
player.pause();
player.mute();
player.seek(30); // 30초로 이동
```

---

## 10. 접근성과 키보드

레이어가 열려있을 때 다음 키보드 단축키를 사용할 수 있습니다.
모바일 터치 환경에서는 단축키 안내가 자동으로 숨겨집니다.

| 키 | 동작 |
|---|---|
| `Space` | 재생 / 일시정지 |
| `Esc` | 레이어 닫기 |
| `M` | 음소거 토글 |
| `F` | 전체화면 토글 |
| `←` / `→` | 5초 앞/뒤 이동 |

---

## 11. 데모 페이지

데모 페이지(`demo/index.html`)는 라이브러리의 사용 방법을 직접 확인할 수 있는 인터랙티브 가이드입니다.

- **히어로 섹션**: 실제 팝업 플레이어 동작 확인 ("데모 열기" 버튼)
- **Get Started 섹션**: 설치 → HTML → 초기화 → 이벤트 4단계 가이드, 속성 레퍼런스 테이블, 코드 복사 버튼
- **다국어 지원**: 브라우저 언어 설정에 따라 자동 전환, 우측 상단 KO/EN 토글로 수동 변경 가능

로컬에서 실행하려면:

```bash
npm run dev
```

---

## 12. FAQ

### Q: Vercel에 배포하려면 어떻게 하나요?

프로젝트 루트에서 `npm run build`를 실행하면 `demo/` 폴더의 내용이 빌드되어 `dist/`에 저장됩니다. Vercel에서 기본 빌드 명령어로 설정되어 있어 바로 배포 가능합니다.

### Q: 레이어를 다시 열면 영상이 처음부터 나옵니다.

네, `tubeplayer`는 트레일러/홍보 영상 시청 경험을 위해 레이어 재오픈 시 영상을 항상 0초부터 다시 재생합니다.
