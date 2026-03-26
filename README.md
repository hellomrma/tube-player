# TubePlayer — Custom YouTube Player Library

**English** | [한국어](./README.ko.md)

[![npm version](https://img.shields.io/npm/v/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![npm downloads](https://img.shields.io/npm/dm/tubeplayer)](https://www.npmjs.com/package/tubeplayer)
[![license](https://img.shields.io/npm/l/tubeplayer)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tubeplayer.playgrounder.dev/)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/hellomrma?label=Sponsor&logo=githubsponsors&color=EA4AAA)](https://github.com/sponsors/hellomrma)

Embed YouTube videos the way **you** want — not the way YouTube wants.

TubePlayer completely replaces the default YouTube UI with your own custom controls. Use it as a **popup layer** with animations and dim overlay, or **embed inline** directly on the page — no popup needed.

**[Live Demo →](https://tubeplayer.playgrounder.dev/)**

## Why TubePlayer?

> Drop a YouTube video anywhere on your page — popup or inline — with a fully branded experience in under 5 minutes.

- **Your brand, not YouTube's** — Completely hides YouTube's logo, controls, and end-screen suggestions.
- **Popup or Inline** — Open in a focused overlay layer, or embed directly in any container element.
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

### Inline Player
- Embed the player directly on the page with `data-tube-inline`
- No popup, no overlay — the video lives in your layout
- Supports all the same options: controls, loop, start time, poster, and more
- Control bar hides during playback and reappears on hover

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

### Popup Mode

Open the video in a focused overlay layer.

```html
<!-- Trigger button -->
<button data-tube-open="demo-layer">Watch Video</button>

<!-- Layer + player declaration -->
<div data-tube-layer="demo-layer"
     data-tube-close-on-dim="true"
     data-tube-animation="fade">
  <div data-tube-youtube="jNQXAC9IVRw"
       data-tube-autoplay="true"
       data-tube-theme="dark"
       data-tube-controls="mute,fullscreen">
  </div>
</div>

<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

### Inline Mode

Embed the player directly on the page — no popup required.

```html
<div data-tube-inline="jNQXAC9IVRw"
     data-tube-theme="dark"
     data-tube-controls="play,progress,time,mute,volume,fullscreen"
     data-tube-autoplay="false">
</div>

<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

### JavaScript API

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

TubePlayer.init({ theme: 'dark' });

// Popup: open/close programmatically
const instance = TubePlayer.get('demo-layer');
instance.open();
instance.on('video:play', () => console.log('playback started'));
instance.on('video:end',  () => console.log('playback ended'));

// Inline: control the player directly
const player = TubePlayer.getPlayer('my-inline-id');
player.play();
player.pause();
```

## Data Attributes

### Layer (`data-tube-layer`) — Popup mode

| Attribute | Description | Default |
|---|---|---|
| `data-tube-layer` | Unique layer ID | (required) |
| `data-tube-close-on-dim` | Close when dim overlay is clicked | `true` |
| `data-tube-close-on-esc` | Close on ESC key | `true` |
| `data-tube-animation` | Animation type (`fade`, `slide`, `zoom`) | `fade` |

### Player attributes

Use `data-tube-youtube` inside a `[data-tube-layer]` for popup mode.
Use `data-tube-inline` as a standalone element for inline mode.
All other attributes below apply to both modes.

| Attribute | Description | Default |
|---|---|---|
| `data-tube-youtube` | YouTube video ID (popup mode) | (required) |
| `data-tube-inline` | YouTube video ID (inline mode) | (required) |
| `data-tube-autoplay` | Auto-play on open | `true` (popup) / `false` (inline) |
| `data-tube-muted` | Start muted | `false` |
| `data-tube-theme` | Theme (`dark`) | `dark` |
| `data-tube-controls` | Controls to show, comma-separated | `mute,fullscreen` |
| `data-tube-start` | Start time in seconds | `0` |
| `data-tube-loop` | Loop video | `false` |
| `data-tube-poster` | Custom poster image URL | YouTube thumbnail |
| `data-tube-close-on-end` | Auto-close layer when video ends (popup only) | `false` |

Available control keys: `play`, `progress`, `time`, `mute`, `volume`, `fullscreen`, `speed`, `youtube-link`

## Keyboard Shortcuts (Desktop)

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `Esc` | Close layer (popup only) |
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
