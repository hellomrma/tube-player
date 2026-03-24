import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TubeYouTube } from '../src/players/TubeYouTube.js';

// YouTube IFrame API 모킹
function setupYTMock({ errorCode } = {}) {
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
    destroy: vi.fn(),
    _callbacks: {},
  };

  window.YT = {
    Player: vi.fn((targetId, config) => {
      // onReady 또는 onError 비동기 호출
      setTimeout(() => {
        if (errorCode !== undefined) {
          config.events.onError({ data: errorCode });
        } else {
          config.events.onReady({});
        }
      }, 0);
      return ytPlayer;
    }),
  };

  return ytPlayer;
}

describe('TubeYouTube', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    delete window.YT;
    document.body.innerHTML = '';
  });

  it('mount 후 tube-youtube 클래스 추가', async () => {
    setupYTMock();
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);
    expect(container.classList.contains('tube-youtube')).toBe(true);
  });

  it('play/pause/seek API 호출 위임', async () => {
    const ytPlayer = setupYTMock();
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);

    player.play();
    expect(ytPlayer.playVideo).toHaveBeenCalled();

    player.pause();
    expect(ytPlayer.pauseVideo).toHaveBeenCalled();

    player.seek(30);
    expect(ytPlayer.seekTo).toHaveBeenCalledWith(30, true);
  });

  it('muted 옵션이 true면 마운트 시 mute() 호출', async () => {
    const ytPlayer = setupYTMock();
    const player = new TubeYouTube('abc123', { muted: true, controls: [] });
    await player.mount(container);
    expect(ytPlayer.mute).toHaveBeenCalled();
  });

  it('중복 mount 호출 무시', async () => {
    setupYTMock();
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);
    const result = await player.mount(container);
    expect(result).toBe(player);
  });

  it('onError 이벤트 emit', async () => {
    setupYTMock({ errorCode: 2 });
    const player = new TubeYouTube('bad-id', { controls: [] });
    const errorFn = vi.fn();
    player.on('video:error', errorFn);

    // mount은 onReady가 아닌 onError로 끝나므로 reject 또는 걸림
    await player.mount(container).catch(() => {});
    await new Promise((r) => setTimeout(r, 50));
    expect(errorFn).toHaveBeenCalledWith(expect.objectContaining({ code: 2 }));
  });

  it('destroy 후 인스턴스 정리', async () => {
    const ytPlayer = setupYTMock();
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);
    player.destroy();
    expect(ytPlayer.destroy).toHaveBeenCalled();
    expect(container.innerHTML).toBe('');
  });

  it('getCurrentTime / getDuration 위임', async () => {
    setupYTMock();
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);
    expect(player.getCurrentTime()).toBe(10);
    expect(player.getDuration()).toBe(120);
  });
});
