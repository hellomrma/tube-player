# TubePlayer — YouTube Popup Player

**English** | [한국어](./README.ko.md)

[![npm version](https://img.shields.io/npm/v/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![npm downloads](https://img.shields.io/npm/dm/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![license](https://img.shields.io/npm/l/tubeplayer)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tubeplayer.playgrounder.dev/)

A custom YouTube popup player library built with Vanilla JS.

Completely hides the default YouTube UI and replaces it with custom controls and a popup layer system.
Designed as a framework-agnostic Vanilla JS core.

**[Live Demo →](https://tubeplayer.playgrounder.dev/)**

## Features

- **Full YouTube UI blocking:** Hides YouTube's logo, controls, and related videos via poster + overlay technique.
- **Mobile-optimized:** Fluid typography with `clamp()`, responsive layout, and swipe-down-to-close gesture.
- **Popup system:** Dim overlay, focus trap, close on ESC / dim click, three animations (Fade, Slide, Zoom).
- **Advanced fullscreen:** Fullscreen mode optimized to fill the screen even on mobile browsers.
- **Reopen logic:** Playback always restarts from the beginning (or `data-tube-start`) when a layer is reopened.
- **Loop & start time:** `data-tube-loop` for repeat playback, `data-tube-start` to begin at a specific second.
- **Auto-close on end:** `data-tube-close-on-end` automatically closes the layer when the video finishes.
- **Custom poster:** `data-tube-poster` overrides the YouTube thumbnail with your own image.
- **Volume persistence:** Mute and volume level are saved to `localStorage` and restored on next visit.
- **Speed control:** Built-in playback speed control (0.5× – 2×) via `speed` in `data-tube-controls`.
- **Customizable:** Declarative initialization via data attributes and a CSS variable-based theme system.
- **Bundle formats:** ESM / CJS / UMD — works in any environment.
- **Multilingual demo:** Built-in Get Started guide that switches between Korean and English based on browser language (or manual toggle).

## Installation

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

## Quick Start

### Declarative HTML

```html
<!-- Trigger button -->
<button data-tube-open="demo-layer">Watch Video</button>

<!-- Layer + player declaration -->
<div data-tube-layer="demo-layer"
     data-tube-close-on-dim="true"
     data-tube-animation="fade">
  <div data-tube-youtube="B868ddnPpsc"
       data-tube-autoplay="true"
       data-tube-theme="dark"
       data-tube-controls="mute,fullscreen">
  </div>
</div>

<!-- Initialize -->
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

### JavaScript API

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

// Auto-initialize (scans for data-tube attributes)
TubePlayer.init({
  theme: 'dark',
  autoplay: true,
});

// Manual control
const instance = TubePlayer.get('demo-layer');
instance.open();
instance.on('video:play', () => console.log('playback started'));
instance.on('video:end',  () => console.log('playback ended'));
```

## Data Attributes

### Layer (`data-tube-layer`)

| Attribute | Description | Default |
|---|---|---|
| `data-tube-layer` | Unique layer ID | (required) |
| `data-tube-close-on-dim` | Close when dim overlay is clicked | `true` |
| `data-tube-close-on-esc` | Close on ESC key | `true` |
| `data-tube-animation` | Animation type (`fade`, `slide`, `zoom`) | `fade` |

### Player (`data-tube-youtube`)

| Attribute | Description | Default |
|---|---|---|
| `data-tube-youtube` | YouTube video ID | (required) |
| `data-tube-autoplay` | Auto-play on open | `true` |
| `data-tube-muted` | Start muted | `false` |
| `data-tube-theme` | Theme (`dark`) | `dark` |
| `data-tube-controls` | Controls to show, comma-separated: `mute,fullscreen,speed` | `mute,fullscreen` |
| `data-tube-start` | Start time in seconds | `0` |
| `data-tube-loop` | Loop video | `false` |
| `data-tube-poster` | Custom poster image URL | YouTube thumbnail |
| `data-tube-close-on-end` | Auto-close layer when video ends | `false` |

## Keyboard Shortcuts (Desktop)

Available while a layer is open. Hidden automatically on touch devices.

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `Esc` | Close layer |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |
| `←` / `→` | Seek ±5 seconds |

## Theme Customization

Override CSS variables to apply brand colors.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

## Build & Deploy

```bash
npm run dev        # Local dev server with demo
npm run build      # Build static demo site for Vercel
npm run build:lib  # Build library files for npm (dist/)
npm run test       # Run Vitest unit tests
```

## Browser Support

Chrome, Firefox, Safari, Edge (latest 2 versions). Fully optimized for mobile.

## License

MIT
