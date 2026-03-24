# TubePlayer

커스텀 YouTube 팝업 플레이어 라이브러리.

YouTube 기본 UI를 완전히 숨기고, 커스텀 컨트롤과 팝업 레이어를 제공합니다.
프레임워크 비종속 Vanilla JS 코어 기반입니다.

## 특징

- YouTube 기본 UI 완전 차단 (포스터 + 오버레이 기법)
- 팝업 레이어 시스템 (딤, 포커스 트랩, ESC 닫기, 애니메이션)
- 커스텀 컨트롤 (음소거, 전체화면)
- 중앙 재생/일시정지 오버레이 버튼
- 다크 테마 (CSS 변수 기반 커스터마이징)
- 키보드 단축키 지원
- 데이터 속성 기반 선언적 초기화
- 레이어 재오픈 시 영상 처음부터 재생 기능
- ESM / CJS / UMD 번들 지원

## 설치

```bash
npm install tubeplayer
```

## 빠른 시작

### HTML 선언적 방식

```html
<!-- 트리거 버튼 -->
<button data-tube-open="trailer">트레일러 보기</button>

<!-- 레이어 + 플레이어 선언 -->
<div data-tube-layer="trailer"
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
const instance = TubePlayer.get('trailer');
instance.open();
instance.on('video:play', () => console.log('재생 시작'));
```

### CDN (UMD)

```html
<link rel="stylesheet" href="https://unpkg.com/tubeplayer/dist/style.css">
<script src="https://unpkg.com/tubeplayer/dist/tubeplayer.umd.js"></script>
<script>
  TubePlayer.init();
</script>
```

## 데이터 속성

### 레이어

| 속성 | 설명 | 기본값 |
|---|---|---|
| `data-tube-layer` | 레이어 고유 ID | (필수) |
| `data-tube-close-on-dim` | 딤 클릭 시 닫기 | `true` |
| `data-tube-close-on-esc` | ESC 키로 닫기 | `true` |
| `data-tube-animation` | 애니메이션 종류 (`fade`, `slide`, `zoom`) | `fade` |

### 플레이어

| 속성 | 설명 | 기본값 |
|---|---|---|
| `data-tube-youtube` | YouTube 비디오 ID | (필수) |
| `data-tube-autoplay` | 자동 재생 | `true` |
| `data-tube-muted` | 음소거 시작 | `false` |
| `data-tube-theme` | 테마 (`dark`) | `dark` |
| `data-tube-controls` | 표시할 컨트롤 (쉼표 구분) | `mute,fullscreen` |

### 트리거

| 속성 | 설명 |
|---|---|
| `data-tube-open` | 클릭 시 열 레이어 ID |

## 컨트롤 종류

| 이름 | 키 | 설명 |
|---|---|---|
| 음소거 | `mute` | 음소거/해제 토글 |
| 전체화면 | `fullscreen` | 전체화면 진입/종료 |

중앙 오버레이에 재생/일시정지 버튼이 표시됩니다.

## 이벤트

```js
const instance = TubePlayer.get('trailer');

// 레이어 이벤트
instance.on('layer:open', () => {});
instance.on('layer:close', () => {});

// 플레이어 이벤트
instance.on('video:ready', (player) => {});
instance.on('video:play', () => {});
instance.on('video:pause', () => {});
instance.on('video:ended', () => {});
instance.on('video:progress', ({ current, duration, percent }) => {});
instance.on('video:error', (error) => {});
instance.on('video:mute', (isMuted) => {});
instance.on('video:buffering', () => {});
```

## 키보드 단축키

레이어가 열려있을 때 동작합니다.

| 키 | 동작 |
|---|---|
| `Space` | 재생 / 일시정지 |
| `Esc` | 레이어 닫기 |
| `M` | 음소거 토글 |
| `F` | 전체화면 토글 |
| `←` / `→` | 5초 앞/뒤 이동 |

## 테마 커스터마이징

CSS 변수를 오버라이드하여 커스텀 테마를 적용할 수 있습니다.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

### CSS 변수 목록

| 변수 | 설명 | 기본값 |
|---|---|---|
| `--tube-dim-bg` | 딤 배경색 | `rgba(0,0,0,0.85)` |
| `--tube-control-color` | 컨트롤 색상 | `#ffffff` |
| `--tube-control-hover` | 컨트롤 호버 색상 | `rgba(255,255,255,0.8)` |
| `--tube-close-color` | 닫기 버튼 색상 | `#ffffff` |

## 빌드

```bash
npm run dev        # 개발 서버 (demo 사이트)
npm run build      # Vercel 배포용 데모 사이트 빌드
npm run build:lib  # 라이브러리 파일 빌드 (dist/)
npm run preview    # 빌드 결과물 프리뷰
npm run test       # 테스트
```

## 브라우저 지원

Chrome, Firefox, Safari, Edge (최신 2버전)

## 라이선스

MIT
