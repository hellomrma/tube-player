import { TubeLayer } from './TubeLayer.js';
import { TubeYouTube } from '../players/TubeYouTube.js';

/**
 * 전역 인스턴스 관리자
 * - data-tube 속성 기반 자동 초기화
 * - 인스턴스 조회 및 수동 제어
 */
class TubeManager {
  constructor() {
    this._layers = new Map();
    this._players = new Map();
    this._initialized = false;
  }

  /**
   * data-tube 속성 기반 자동 초기화
   * @param {object} globalOptions
   */
  init(globalOptions = {}) {
    if (this._initialized) return;
    this._initialized = true;

    // 커스텀 테마 변수 적용
    if (globalOptions.theme && typeof globalOptions.theme === 'object') {
      const root = document.documentElement;
      Object.entries(globalOptions.theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // data-tube-layer 탐색
    const layerEls = document.querySelectorAll('[data-tube-layer]');
    layerEls.forEach((el) => {
      const id = el.getAttribute('data-tube-layer');
      const closeOnDim = el.getAttribute('data-tube-close-on-dim') !== 'false';
      const closeOnEsc = el.getAttribute('data-tube-close-on-esc') !== 'false';
      const animation = el.getAttribute('data-tube-animation') || globalOptions.animation || 'fade';

      const layer = new TubeLayer(id, {
        closeOnDim,
        closeOnEsc,
        animation,
        ...globalOptions,
      });
      this._layers.set(id, layer);

      // 내부 YouTube 플레이어 탐색
      const ytEl = el.querySelector('[data-tube-youtube]');
      if (ytEl) {
        const videoId = ytEl.getAttribute('data-tube-youtube');
        const autoplay = ytEl.getAttribute('data-tube-autoplay') !== 'false';
        const muted = ytEl.getAttribute('data-tube-muted') === 'true';
        const theme = ytEl.getAttribute('data-tube-theme') || globalOptions.theme || 'dark';
        const controlsAttr = ytEl.getAttribute('data-tube-controls');
        const controls = controlsAttr
          ? controlsAttr.split(',').map((s) => s.trim())
          : undefined;
        const restartOnOpenAttr = ytEl.getAttribute('data-tube-restart-on-open');
        const restartOnOpen = restartOnOpenAttr !== null
          ? restartOnOpenAttr !== 'false'
          : globalOptions.restartOnOpen !== undefined
            ? globalOptions.restartOnOpen
            : true;

        const player = new TubeYouTube(videoId, {
          autoplay: globalOptions.autoplay !== undefined ? globalOptions.autoplay : autoplay,
          muted,
          theme: typeof theme === 'string' ? theme : 'dark',
          controls,
          restartOnOpen,
        });
        this._players.set(id, player);

        let shortcutsBound = false;

        // 레이어 열릴 때 플레이어 마운트 (player._mounted로 상태 관리)
        layer.on('layer:open', async () => {
          if (!player._mounted) {
            await player.mount(layer.contentsEl);
          } else if (player.options.restartOnOpen !== false) {
            player.seek(0).play();
          }
          if (!shortcutsBound) {
            shortcutsBound = true;
            this._bindPlayerShortcuts(layer, player);
          }
        });

        // 레이어 닫힐 때 일시정지
        layer.on('layer:close', () => {
          player.pause();
        });
      }
    });

    // data-tube-open 트리거 버튼 연결
    const triggers = document.querySelectorAll('[data-tube-open]');
    triggers.forEach((btn) => {
      const targetId = btn.getAttribute('data-tube-open');
      btn.addEventListener('click', () => {
        const layer = this._layers.get(targetId);
        if (layer) layer.open();
      });
    });
  }

  _bindPlayerShortcuts(layer, player) {
    const handler = (e) => {
      if (!layer.isActive()) {
        document.removeEventListener('keydown', handler);
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (player.getState() === 'playing') player.pause();
          else player.play();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (player.isMuted()) player.unmute();
          else player.mute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          const container = player.getContainerEl();
          if (container) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              container.requestFullscreen();
            }
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.seek(Math.max(0, player.getCurrentTime() - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.seek(Math.min(player.getDuration(), player.getCurrentTime() + 5));
          break;
      }
    };

    document.addEventListener('keydown', handler);

    layer.on('layer:close', () => {
      document.removeEventListener('keydown', handler);
    });
  }

  /**
   * 레이어 인스턴스 반환
   */
  getLayer(id) {
    return this._layers.get(id);
  }

  /**
   * 플레이어 인스턴스 반환
   */
  getPlayer(id) {
    return this._players.get(id);
  }

  /**
   * 레이어+플레이어 통합 접근 (이벤트 바인딩용)
   */
  get(id) {
    const layer = this._layers.get(id);
    const player = this._players.get(id);

    if (!layer && !player) return null;

    return {
      layer,
      player,
      on(event, fn) {
        if (event.startsWith('layer:') && layer) layer.on(event, fn);
        else if (event.startsWith('video:') && player) player.on(event, fn);
        return this;
      },
      off(event, fn) {
        if (event.startsWith('layer:') && layer) layer.off(event, fn);
        else if (event.startsWith('video:') && player) player.off(event, fn);
        return this;
      },
      open() {
        if (layer) layer.open();
        return this;
      },
      close() {
        if (layer) layer.close();
        return this;
      },
    };
  }

  /**
   * 모든 인스턴스 제거
   */
  destroyAll() {
    this._players.forEach((p) => p.destroy());
    this._layers.forEach((l) => l.destroy());
    this._players.clear();
    this._layers.clear();
    this._initialized = false;
  }
}

export const tubeManager = new TubeManager();
