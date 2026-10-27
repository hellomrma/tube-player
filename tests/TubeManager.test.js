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
    Player: vi.fn((targetId, config) => {
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
