# tubeplayer 사용 가이드

웹 프로젝트에 커스텀 YouTube 팝업 플레이어를 추가하는 방법을 단계별로 안내합니다.

---

## 목차

1. [설치](#1-설치)
2. [기본 사용법 (HTML 선언적 방식)](#2-기본-사용법)
3. [JavaScript API 방식](#3-javascript-api-방식)
4. [CDN으로 사용하기](#4-cdn으로-사용하기)
5. [여러 영상 등록](#5-여러-영상-등록)
6. [테마 설정](#6-테마-설정)
7. [컨트롤 커스터마이징](#7-컨트롤-커스터마이징)
8. [이벤트 활용](#8-이벤트-활용)
9. [수동 인스턴스 제어](#9-수동-인스턴스-제어)
10. [접근성과 키보드](#10-접근성과-키보드)
11. [실전 예제](#11-실전-예제)
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
<link rel="stylesheet" href="https://unpkg.com/tubeplayer/dist/style.css">
<!-- JS (UMD) -->
<script src="https://unpkg.com/tubeplayer/dist/tubeplayer.umd.js"></script>
```

---

## 2. 기본 사용법

가장 간단한 방법은 HTML 데이터 속성만으로 선언하고, `TubePlayer.init()`을 호출하는 것입니다.

### Step 1: HTML 작성

```html
<!-- 1) 트리거 버튼 — 클릭하면 레이어가 열립니다 -->
<button data-tube-open="my-trailer">트레일러 보기</button>

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

## 4. 특이 사항: 레이어 재오픈

`tubeplayer`는 사용자 경험을 위해 **레이어를 닫았다가 다시 열 때 영상을 항상 처음(0초)부터 재생**합니다. 트레일러나 홍보 영상을 보여주는 목적에 최적화되어 있습니다.

---

## 5. 테마 설정

CSS 변수를 오버라이드하여 브랜드 컬러를 적용할 수 있습니다.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

### 사용 가능한 CSS 변수

| 변수 | 설명 |
|---|---|
| `--tube-dim-bg` | 딤(배경 오버레이) 색상 |
| `--tube-control-color` | 컨트롤 아이콘/텍스트 색상 |
| `--tube-control-hover` | 컨트롤 호버 시 색상 |
| `--tube-close-color` | 닫기 버튼 색상 |

---

## 6. 접근성과 키보드

레이어가 열려있을 때 다음 키보드 단축키를 사용할 수 있습니다.

| 키 | 동작 |
|---|---|
| `Space` | 재생 / 일시정지 |
| `Esc` | 레이어 닫기 |
| `M` | 음소거 토글 |
| `F` | 전체화면 토글 |
| `←` / `→` | 5초 앞/뒤 이동 |

---

## 7. FAQ

### Q: Vercel에 배포하려면 어떻게 하나요?

프로젝트 루트에서 `npm run build`를 실행하면 `demo/` 폴더의 내용이 빌드되어 `dist/`에 저장됩니다. Vercel에서 기본 빌드 명령어로 설정되어 있어 바로 배포 가능합니다.

### Q: 라이브러리 파일만 빌드하고 싶어요.

`npm run build:lib` 명령어를 사용하세요. `dist/` 폴더에 `tubeplayer.es.js`, `tubeplayer.cjs.js` 등이 생성됩니다.
