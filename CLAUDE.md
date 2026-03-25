# CLAUDE.md — TubePlayer

This file provides context for Claude Code to understand the project.

## Project Overview

`tubeplayer` is a custom YouTube popup player JavaScript library.
Designed by referencing the layer + YouTube structure of `cinder-city.com`.

- Framework-agnostic (Vanilla JS core)
- Completely hides the default YouTube UI and replaces it with custom controls
- **Mobile-optimized (responsive, fullscreen)**
- Vercel-optimized for demo hosting
- **Built-in Get Started docs section in demo page** (install, HTML, init, events — 4 steps)
- **Demo page i18n**: auto-switches Korean/English via `navigator.language`, with manual toggle persisted to `localStorage`
- **Published to npm** as `tubeplayer@0.1.0`

## Tech Stack

- **Build**: Vite 5 (ESM + CJS + UMD)
- **Testing**: Vitest
- **Language**: Vanilla JavaScript (ES Modules)
- **Styles**: CSS (CSS variable-based theming, responsive)
- **Docs**: README.md (English), README.ko.md (Korean), docs/guide.md (usage guide)

## Folder Structure

```
tubeplayer/
├── src/
│   ├── core/           # TubeLayer, TubeManager, EventEmitter
│   ├── players/        # TubeYouTube (future: TubeVimeo, TubeVideo)
│   ├── controls/       # Mute, Fullscreen, PlayPause
│   ├── styles/         # base.css (mobile-optimized), themes/dark.css
│   └── index.js        # entry point
├── demo/               # demo page (Vercel deploy source)
├── docs/               # guide docs (guide.md / guide.ko.md)
├── tests/              # test code
└── vite.config.js
```

## Core Architecture

### YouTube UI Blocking Strategy (important)

Three layers are stacked on top of the YouTube iframe to fully block the default UI:

1. **iframe** (z-index: auto) — YouTube video
2. **poster** (z-index: 1) — covers iframe with YouTube thumbnail when paused/ended
3. **overlay** (z-index: 2) — always on top, intercepts mouse hover to block YouTube UI + center play/pause button
4. **controls** (z-index: 3) — bottom custom control bar (mute, fullscreen)

### Mobile Optimization

- **Fullscreen**: `:fullscreen` and `:-webkit-full-screen` pseudo-classes force `100vw`/`100vh` and release the `padding-bottom` ratio on mobile.
- **Responsive UI**: demo page uses `clamp()` fluid typography and responsive logo (`max-width: 80vw`).
- **Touch support**: `(hover: none) and (pointer: coarse)` media query hides keyboard shortcut hints automatically.

### Demo Page Structure (`demo/index.html`)

- **Hero section**: logo, description, "Open Demo" button, scroll hint
- **Get Started section**: install (npm/CDN tabs) → HTML markup (attribute reference tables) → init (ESM/UMD tabs) → events (4 steps). Code blocks use highlight.js for syntax highlighting with copy buttons.
- **i18n**: managed via `TRANSLATIONS` object (`ko`/`en`) and `data-i18n` / `data-i18n-html` / `data-i18n-code` attributes. `data-i18n-code` (code block text) is applied before highlight.js runs.

### Notable Behavior

- **Video restart**: `TubeManager` calls `player.seek(0).play()` when a layer is reopened while already mounted, forcing playback to always start from the beginning.

## Build Commands

```bash
npm run dev        # Vite dev server (opens demo site)
npm run build      # Build demo site for Vercel → dist/
npm run build:lib  # Library-only build (ES+CJS+UMD) → dist/
npm run preview    # Preview build output
npm run test       # Run Vitest tests
```

## Naming Conventions

- CSS classes: `tube-` prefix (e.g. `tube-layer`, `tube-youtube`, `tube-control`)
- Data attributes: `data-tube-` prefix (e.g. `data-tube-layer`, `data-tube-youtube`)
- CSS variables: `--tube-` prefix (e.g. `--tube-control-color`, `--tube-dim-bg`)
- JS classes: `Tube` prefix (e.g. `TubeLayer`, `TubeYouTube`, `TubeManager`)
