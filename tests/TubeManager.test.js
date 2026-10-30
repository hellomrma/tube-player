import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tubeManager } from '../src/core/TubeManager.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// YouTube IFrame API 모킹
function setupYTMock() {
  const ytPlayer = {
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    stopVideo: vi.fn(),
    seekTo: vi.fn(),
    mute: vi.fn(),
    unMute: vi.fn(),
    isMuted: vi.fn(() => false),
    setVolume: vi.fn(),
    getVolume: vi.fn(() => 100),
    getCurrentTime: vi.fn(() => 10),
    getDuration: vi.fn(() => 120),
    setPlaybackQuality: vi.fn(),
    destroy: vi.fn(),
  };

  window.YT = {
    Player: vi.fn(function (targetId, config) {
      setTimeout(() => config.events.onReady({}), 0);
      return ytPlayer;
    }),
  };

  return ytPlayer;
}

describe('TubeManager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    tubeManager.destroyAll();
    delete window.YT;
    document.body.innerHTML = '';
  });

  it('data-tube-controls가 없으면 기본 컨트롤(mute, fullscreen)을 렌더링', async () => {
    setupYTMock();
    document.body.innerHTML = `<div id="inline-1" data-tube-inline="abc123"></div>`;
    tubeManager.init();
    await wait(50);

    const el = document.getElementById('inline-1');
    expect(tubeManager.getPlayer('inline-1').options.controls).toEqual(['mute', 'fullscreen']);
    expect(el.querySelector('.tube-control--mute')).not.toBeNull();
    expect(el.querySelector('.tube-control--fullscreen')).not.toBeNull();
  });

  it('data-tube-animation이 전역 animation 옵션보다 우선', () => {
    document.body.innerHTML = `<div data-tube-layer="a" data-tube-animation="slide"></div>`;
    tubeManager.init({ animation: 'zoom' });
    expect(tubeManager.getLayer('a').options.animation).toBe('slide');
  });

  it('data-tube-autoplay가 전역 autoplay 옵션보다 우선', () => {
    document.body.innerHTML = `
      <div data-tube-layer="a">
        <div data-tube-youtube="abc123" data-tube-autoplay="false"></div>
      </div>`;
    tubeManager.init({ autoplay: true });
    expect(tubeManager.getPlayer('a').options.autoplay).toBe(false);
  });

  it('레이어를 다시 열어도 키보드 단축키가 동작', async () => {
    const ytPlayer = setupYTMock();
    document.body.innerHTML = `
      <div data-tube-layer="a">
        <div data-tube-youtube="abc123" data-tube-controls=""></div>
      </div>`;
    tubeManager.init();
    const layer = tubeManager.getLayer('a');

    layer.open();
    await wait(50);
    layer.close();
    await wait(400);
    layer.open();
    await wait(50);

    ytPlayer.mute.mockClear();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' }));
    expect(ytPlayer.mute).toHaveBeenCalled();
  });
});

describe('TubeManager 마운트 실패', () => {
  afterEach(() => {
    tubeManager.destroyAll();
    delete window.YT;
    document.body.innerHTML = '';
  });

  it('인라인 플레이어 오류가 처리되지 않은 rejection으로 새지 않음', async () => {
    const onUnhandled = vi.fn();
    process.on('unhandledRejection', onUnhandled);
    window.YT = {
      Player: vi.fn(function (targetId, config) {
        setTimeout(() => config.events.onError({ data: 100 }), 0);
        return { destroy: vi.fn() };
      }),
    };
    document.body.innerHTML = `<div id="bad" data-tube-inline="nope"></div>`;
    tubeManager.init();
    await wait(50);
    process.off('unhandledRejection', onUnhandled);
    expect(onUnhandled).not.toHaveBeenCalled();
  });
});

describe('접근성 라벨', () => {
  afterEach(() => {
    tubeManager.destroyAll();
    document.body.innerHTML = '';
  });

  it('init({ labels })로 라벨 덮어쓰기', () => {
    document.body.innerHTML = `<div data-tube-layer="a"></div>`;
    tubeManager.init({ labels: { close: '닫기', dialog: '동영상 플레이어' } });
    const layerEl = tubeManager.getLayer('a').el;
    expect(layerEl.getAttribute('aria-label')).toBe('동영상 플레이어');
    expect(layerEl.querySelector('.tube-layer__close').getAttribute('aria-label')).toBe('닫기');
  });
});
