# TubePlayer — YouTube Popup Player: Usage Guide

**English** | [한국어](./guide.ko.md)

A step-by-step guide to adding a custom YouTube popup player to your web project.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Basic Usage (Declarative HTML)](#2-basic-usage)
3. [JavaScript API](#3-javascript-api)
4. [Mobile Optimization](#4-mobile-optimization)
5. [Multiple Videos](#5-multiple-videos)
6. [Theme Configuration](#6-theme-configuration)
7. [Control Customization](#7-control-customization)
8. [Events](#8-events)
9. [Manual Instance Control](#9-manual-instance-control)
10. [Accessibility & Keyboard](#10-accessibility--keyboard)
11. [Demo Page](#11-demo-page)
12. [FAQ](#12-faq)

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

## 2. Basic Usage

The simplest approach is to declare everything with HTML data attributes and call `TubePlayer.init()`.

### Step 1: HTML

```html
<!-- 1) Trigger button — opens the layer on click -->
<button data-tube-open="my-trailer">Watch Video</button>

<!-- 2) Layer + YouTube player declaration -->
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

### Step 2: Initialize

```html
<script type="module">
  import TubePlayer from 'tubeplayer';
  TubePlayer.init();
</script>
```

---

## 3. JavaScript API

```js
import TubePlayer, { TubeLayer, TubeYouTube } from 'tubeplayer';

TubePlayer.init();

// Open a specific layer
const trailer = TubePlayer.get('my-trailer');
trailer.open();
```

---

## 4. Mobile Optimization

`tubeplayer` is designed to work perfectly in mobile web environments.

- **Responsive fullscreen**: Automatically fills the screen in mobile fullscreen mode (`:fullscreen`).
- **Touch events**: All UI elements including controls are optimized for touch interaction.
- **Layout**: Uses modern CSS features like `clamp()` for fluid, adaptive layouts.

---

## 5. Multiple Videos

You can register multiple layers and videos on a single page.

```html
<button data-tube-open="trailer-1">Trailer 1</button>
<button data-tube-open="trailer-2">Trailer 2</button>

<div data-tube-layer="trailer-1" data-tube-animation="fade">
  <div data-tube-youtube="VIDEO_ID_1" data-tube-theme="dark"></div>
</div>

<div data-tube-layer="trailer-2" data-tube-animation="slide">
  <div data-tube-youtube="VIDEO_ID_2" data-tube-theme="dark"></div>
</div>
```

---

## 6. Theme Configuration

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

## 7. Control Customization

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

## 8. Events

```js
const instance = TubePlayer.get('my-trailer');

instance.on('layer:open',  () => console.log('layer opened'));
instance.on('layer:close', () => console.log('layer closed'));
instance.on('video:play',  () => console.log('playback started'));
instance.on('video:pause', () => console.log('playback paused'));
instance.on('video:end',   () => console.log('playback ended'));
instance.on('video:ready', () => console.log('player ready'));
```

---

## 9. Manual Instance Control

```js
const player = TubePlayer.getPlayer('trailer');

player.play();
player.pause();
player.mute();
player.seek(30); // seek to 30 seconds
```

---

## 10. Accessibility & Keyboard

The following keyboard shortcuts are available while a layer is open.
On mobile touch devices, shortcut hints are hidden automatically.

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `Esc` | Close layer |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |
| `←` / `→` | Seek ±5 seconds |

---

## 11. Demo Page

The demo page (`demo/index.html`) is an interactive guide to explore the library.

- **Hero section**: Try the live popup player ("Open Demo" button)
- **Get Started section**: 4-step guide (install → HTML → init → events), attribute reference tables, copy buttons
- **Multilingual**: Auto-switches to Korean or English based on browser language. A manual KO/EN toggle is available in the top-right corner.

To run locally:

```bash
npm run dev
```

---

## 12. New Attributes (v0.2+)

| Attribute | Description | Default |
|---|---|---|
| `data-tube-start` | Start time in seconds | `0` |
| `data-tube-loop` | Loop video | `false` |
| `data-tube-poster` | Custom poster image URL | YouTube thumbnail |
| `data-tube-close-on-end` | Auto-close layer when video ends | `false` |

Volume and mute state are automatically persisted to `localStorage` (`tube-volume`, `tube-muted`).

Layers can be closed on mobile by swiping down.

---

## 13. FAQ

### Q: How do I deploy to Vercel?


Run `npm run build` from the project root. The `demo/` folder will be built and output to `dist/`. The default build command is already configured for Vercel.

### Q: The video restarts from the beginning when I reopen the layer.

Yes, this is by design. `tubeplayer` always restarts playback from 0 seconds on reopen, optimized for trailer and promotional video experiences.
