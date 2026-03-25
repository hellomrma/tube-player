# TubePlayer — YouTube Popup Player

**English** | [한국어](./README.ko.md)

[![npm version](https://img.shields.io/npm/v/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![npm downloads](https://img.shields.io/npm/dm/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![license](https://img.shields.io/npm/l/tubeplayer)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tubeplayer.playgrounder.dev/)

Embed YouTube videos the way **you** want — not the way YouTube wants.

TubePlayer completely replaces the default YouTube UI with your own custom controls and a beautiful popup layer system. No YouTube logo. No suggested videos. No distractions. Just your content, your brand.

**[Live Demo →](https://tubeplayer.playgrounder.dev/)**

## Why TubePlayer?

> Drop a YouTube video into any webpage — with a fully branded popup experience in under 5 minutes.

- **Your brand, not YouTube's** — Completely hides YouTube's logo, controls, and end-screen suggestions.
- **Works everywhere** — Framework-agnostic Vanilla JS. React, Vue, plain HTML — it just works.
- **Mobile-first** — Swipe-to-close, touch-optimized controls, and flawless fullscreen on every device.
- **Zero dependencies** — No jQuery, no lodash, no bloat. Pure ES Modules at ~7 kB gzipped.
- **Declarative setup** — Add `data-tube-*` attributes to your HTML and call `TubePlayer.init()`. Done.

## Features

### Popup & UX
- Smooth popup layer with dim overlay, focus trap, and 3 animations (Fade / Slide / Zoom)
- Close on ESC, dim click, or swipe down (mobile)
- Remembers volume and mute state across visits via `localStorage`
- Playback always restarts cleanly when the layer is reopened

### Playback Control
- Custom control bar: play/pause, seek bar, time display, mute, volume slider, fullscreen, speed, YouTube link
- Playback speed cycling: 0.5× → 0.75× → 1× → 1.25× → 1.5× → 2×
- Set a start time (`data-tube-start`), loop playback (`data-tube-loop`), or auto-close on video end (`data-tube-close-on-end`)
- Full keyboard shortcuts — Space, M, F, ←/→ (auto-hidden on touch devices)

### Customization
- Custom poster image to replace the YouTube thumbnail
- CSS variable-based theme system — one line to apply your brand color
- Fully declarative via `data-tube-*` HTML attributes or JavaScript API

### Developer Experience
- ESM / CJS / UMD bundle formats — works in any environment
- TypeScript type definitions included
- Lightweight: ~7 kB gzipped (core)

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
