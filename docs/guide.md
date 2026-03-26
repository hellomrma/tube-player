# TubePlayer — Usage Guide

**English** | [한국어](./guide.ko.md)

A step-by-step guide to embedding YouTube videos with custom controls — as a popup layer or inline on the page.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Popup Mode](#2-popup-mode)
3. [Inline Mode](#3-inline-mode)
4. [JavaScript API](#4-javascript-api)
5. [Mobile Optimization](#5-mobile-optimization)
6. [Multiple Videos](#6-multiple-videos)
7. [Theme Configuration](#7-theme-configuration)
8. [Control Customization](#8-control-customization)
9. [Events](#9-events)
10. [Manual Instance Control](#10-manual-instance-control)
11. [Accessibility & Keyboard](#11-accessibility--keyboard)
12. [Demo Page](#12-demo-page)
13. [New Attributes (v0.2+)](#13-new-attributes-v02)
14. [FAQ](#14-faq)

---

## 1. Installation

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

## 2. Popup Mode

Open the video in a focused overlay layer. Ideal for trailers, previews, and modal-style video experiences.

### Step 1: HTML

```html
<!-- 1) Trigger button — opens the layer on click -->
<button data-tube-open="my-trailer">Watch Video</button>

<!-- 2) Layer + YouTube player declaration -->
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

### Step 2: Initialize

```html
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

---

## 3. Inline Mode

Embed the player directly on the page — no popup, no overlay. Ideal for dedicated video sections, landing pages, and content pages.

### HTML

```html
<div data-tube-inline="jNQXAC9IVRw"
     data-tube-theme="dark"
     data-tube-controls="play,progress,time,mute,volume,fullscreen"
     data-tube-autoplay="false">
</div>
```

### Initialize

```html
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

`TubePlayer.init()` automatically detects both `[data-tube-layer]` (popup) and `[data-tube-inline]` (inline) elements. Multiple inline players on the same page are fully supported.

### Inline-specific behavior

- **`autoplay` defaults to `false`** — browsers block autoplay without user interaction for unmuted video.
- **Control bar auto-hides** during playback and reappears on hover.
- All popup player options (`data-tube-loop`, `data-tube-start`, `data-tube-poster`, etc.) work identically in inline mode.

---

## 4. JavaScript API

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

TubePlayer.init();

// Popup: open a specific layer
const trailer = TubePlayer.get('my-trailer');
trailer.open();

// Inline: get player by element id
const player = TubePlayer.getPlayer('my-inline-player');
player.play();
```

---

## 5. Mobile Optimization

`tubeplayer` is designed to work perfectly in mobile web environments.

- **Responsive fullscreen**: Automatically fills the screen in mobile fullscreen mode (`:fullscreen`).
- **Touch events**: All UI elements including controls are optimized for touch interaction.
- **Swipe to close**: In popup mode, swiping down closes the layer.
- **Layout**: Uses modern CSS features like `clamp()` for fluid, adaptive layouts.

---

## 6. Multiple Videos

You can register multiple popup layers, multiple inline players, or a mix of both on a single page.

```html
<!-- Popup players -->
<button data-tube-open="trailer-1">Trailer 1</button>
<button data-tube-open="trailer-2">Trailer 2</button>

<div data-tube-layer="trailer-1" data-tube-animation="fade">
  <div data-tube-youtube="VIDEO_ID_1" data-tube-theme="dark"></div>
</div>
<div data-tube-layer="trailer-2" data-tube-animation="slide">
  <div data-tube-youtube="VIDEO_ID_2" data-tube-theme="dark"></div>
</div>

<!-- Inline players -->
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

## 7. Theme Configuration

Override CSS variables to apply your brand colors.

```js
TubePlayer.init({
  theme: {
    '--tube-dim-bg': 'rgba(10, 10, 30, 0.9)',
    '--tube-control-color': '#e0e0ff',
  }
});
```

---

## 8. Control Customization

List the controls to display in the `data-tube-controls` attribute, comma-separated.

| Key | Position | Description |
|---|---|---|
| `play` | left | Play / Pause toggle |
| `progress` | top | Seek bar |
| `time` | left | Elapsed / duration |
| `speed` | left | Cycle playback speed (0.5× → 2×) |
| `mute` | right | Toggle mute |
| `volume` | right | Volume slider |
| `fullscreen` | right | Toggle fullscreen |
| `youtube-link` | right | Open on YouTube |

---

## 9. Events

```js
// Popup mode
const instance = TubePlayer.get('my-trailer');
instance.on('layer:open',  () => console.log('layer opened'));
instance.on('layer:close', () => console.log('layer closed'));
instance.on('video:play',  () => console.log('playback started'));
instance.on('video:pause', () => console.log('playback paused'));
instance.on('video:end',   () => console.log('playback ended'));
instance.on('video:ready', () => console.log('player ready'));

// Inline mode
const player = TubePlayer.getPlayer('my-inline-player');
player.on('video:play',  () => console.log('playback started'));
player.on('video:pause', () => console.log('playback paused'));
player.on('video:end',   () => console.log('playback ended'));
```

---

## 10. Manual Instance Control

```js
const player = TubePlayer.getPlayer('my-inline-player');

player.play();
player.pause();
player.mute();
player.unmute();
player.setVolume(80);   // 0–100
player.seek(30);        // seek to 30 seconds
```

---

## 11. Accessibility & Keyboard

The following keyboard shortcuts are available while a layer is open (popup) or the player is focused (inline).
On mobile touch devices, shortcut hints are hidden automatically.

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `Esc` | Close layer (popup only) |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |
| `←` / `→` | Seek ±5 seconds |

---

## 12. Demo Page

The demo page (`demo/index.html`) is an interactive guide to explore the library.

- **Hero section**: Try the live player ("Try it Live" button)
- **Feature Demos**: 7 interactive cards — Popup Animations, Loop, Start Time, Auto-close on End, Control Customization, Custom Poster, Inline Player
- **Inline Demo section**: 3 live inline players (Full Controls / Minimal / Loop) embedded directly on the page
- **Get Started section**: 4-step guide with Popup/Inline tabs for the HTML markup step, attribute reference tables, copy buttons
- **Multilingual**: Auto-switches to Korean or English based on browser language. A manual KO/EN toggle is available in the top-right corner.

To run locally:

```bash
npm run dev
```

---

## 13. New Attributes (v0.2+)

| Attribute | Description | Default |
|---|---|---|
| `data-tube-inline` | YouTube video ID for inline mode (no popup) | — |
| `data-tube-start` | Start time in seconds | `0` |
| `data-tube-loop` | Loop video | `false` |
| `data-tube-poster` | Custom poster image URL | YouTube thumbnail |
| `data-tube-close-on-end` | Auto-close layer when video ends (popup only) | `false` |

Volume and mute state are automatically persisted to `localStorage` (`tube-volume`, `tube-muted`).

In popup mode, layers can be closed on mobile by swiping down.

---

## 14. FAQ

### Q: How do I deploy to Vercel?

Run `npm run build` from the project root. The `demo/` folder will be built and output to `dist/`. The default build command is already configured for Vercel.

### Q: The video restarts from the beginning when I reopen the popup layer.

Yes, this is by design. `tubeplayer` always restarts playback from 0 seconds on reopen, optimized for trailer and promotional video experiences. Set `data-tube-restart-on-open="false"` to disable this.

### Q: Can I have multiple inline players on the same page?

Yes. Each `[data-tube-inline]` element is independently initialized. Give each element a unique `id` attribute to access them via `TubePlayer.getPlayer(id)`.

### Q: Why doesn't autoplay work on my inline player?

Browsers block autoplay for unmuted video without user interaction. Set `data-tube-muted="true"` alongside `data-tube-autoplay="true"` to enable autoplay, or rely on user-initiated play.
