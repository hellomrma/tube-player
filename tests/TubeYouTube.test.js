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
    setPlaybackQuality: vi.fn(),
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

describe('Mute 컨트롤', () => {
  afterEach(() => {
    delete window.YT;
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('음소거 상태로 시작하면 음소거 해제 아이콘으로 표시', async () => {
    const ytPlayer = setupYTMock();
    ytPlayer.isMuted.mockReturnValue(true);
    const container = document.createElement('div');
    document.body.appendChild(container);

    const player = new TubeYouTube('abc123', { autoplay: false, muted: true, controls: ['mute'] });
    await player.mount(container);
    await new Promise((r) => setTimeout(r, 50));

    const btn = container.querySelector('.tube-control--mute');
    expect(btn.getAttribute('aria-label')).toBe('Unmute');
  });
});

describe('localStorage 접근 차단 환경', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete window.YT;
    document.body.innerHTML = '';
  });

  it('localStorage가 예외를 던져도 mount/mute/setVolume 동작', async () => {
    const ytPlayer = setupYTMock();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const container = document.createElement('div');
    document.body.appendChild(container);

    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await player.mount(container);

    expect(() => player.mute()).not.toThrow();
    expect(() => player.setVolume(50)).not.toThrow();
    expect(ytPlayer.mute).toHaveBeenCalled();
    expect(ytPlayer.setVolume).toHaveBeenCalledWith(50);
  });
});

describe('음소거/볼륨 저장', () => {
  afterEach(() => {
    delete window.YT;
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('mute/setVolume 상태를 localStorage에 저장하고 다음 마운트 때 복원', async () => {
    setupYTMock();
    const first = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await first.mount(document.body.appendChild(document.createElement('div')));
    first.setVolume(40);
    first.mute();
    expect(localStorage.getItem('tube-muted')).toBe('true');
    expect(localStorage.getItem('tube-volume')).toBe('40');

    const ytPlayer = setupYTMock();
    const second = new TubeYouTube('abc123', { autoplay: false, controls: [] });
    await second.mount(document.body.appendChild(document.createElement('div')));
    expect(ytPlayer.mute).toHaveBeenCalled();
  });
});

describe('API 로드 실패', () => {
  afterEach(() => {
    delete window.YT;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('로드 실패 후 다시 mount 하면 재시도', async () => {
    delete window.YT;
    const container = document.body.appendChild(document.createElement('div'));
    const player = new TubeYouTube('abc123', { autoplay: false, controls: [] });

    const first = player.mount(container);
    document.head.querySelector('script[src*="iframe_api"]').onerror();
    await expect(first).rejects.toThrow();
    expect(player._mounted).toBe(false);

    setupYTMock();
    await player.mount(container);
    expect(player._ready).toBe(true);
  });
});
